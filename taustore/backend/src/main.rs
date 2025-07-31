#[macro_use] extern crate rocket;
#[macro_use] extern crate diesel;

use rocket::serde::{json::Json, Deserialize, Serialize};
use rocket::http::{Status, Header, CookieJar, Cookie};
use rocket::response::status;
use rocket::State;
use rocket_sync_db_pools::{database, diesel};
use diesel::prelude::*;
use serde_json::json;
use jsonwebtoken::{encode, decode, Header as JwtHeader, Validation, EncodingKey, DecodingKey, Algorithm};
use chrono::{Utc, Duration};
use bcrypt::{hash, verify, DEFAULT_COST};
use std::fs;
use std::path::Path;
use uuid::Uuid;

// DB setup
#[database("sqlite_db")]
pub struct DbConn(diesel::SqliteConnection);

mod schema {
    table! {
        users (id) {
            id -> Integer,
            username -> Text,
            password_hash -> Text,
            email -> Nullable<Text>,
            is_admin -> Bool,
            created_at -> Timestamp,
        }
    }
    table! {
        apps (id) {
            id -> Integer,
            name -> Text,
            version -> Text,
            description -> Text,
            icon -> Nullable<Text>,
            package_path -> Nullable<Text>,
            author_id -> Integer,
            category -> Text,
            downloads -> Integer,
            rating -> Double,
            status -> Text, // pending, approved, rejected
            created_at -> Timestamp,
            updated_at -> Timestamp,
        }
    }
    table! {
        reviews (id) {
            id -> Integer,
            app_id -> Integer,
            user_id -> Integer,
            rating -> Integer,
            comment -> Text,
            created_at -> Timestamp,
        }
    }
    table! {
        downloads (id) {
            id -> Integer,
            app_id -> Integer,
            user_id -> Integer,
            downloaded_at -> Timestamp,
        }
    }
}

use schema::*;

#[derive(Queryable, Serialize, Deserialize, Insertable)]
#[table_name = "users"]
struct User {
    id: i32,
    username: String,
    password_hash: String,
    email: Option<String>,
    is_admin: bool,
    created_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Serialize, Deserialize, Insertable)]
#[table_name = "apps"]
struct App {
    id: i32,
    name: String,
    version: String,
    description: String,
    icon: Option<String>,
    package_path: Option<String>,
    author_id: i32,
    category: String,
    downloads: i32,
    rating: f64,
    status: String,
    created_at: chrono::NaiveDateTime,
    updated_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Serialize, Deserialize, Insertable)]
#[table_name = "reviews"]
struct Review {
    id: i32,
    app_id: i32,
    user_id: i32,
    rating: i32,
    comment: String,
    created_at: chrono::NaiveDateTime,
}

#[derive(Queryable, Serialize, Deserialize, Insertable)]
#[table_name = "downloads"]
struct Download {
    id: i32,
    app_id: i32,
    user_id: i32,
    downloaded_at: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthRequest {
    username: String,
    password: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct AuthResponse {
    token: String,
    user: UserInfo,
}

#[derive(Debug, Serialize, Deserialize)]
struct UserInfo {
    id: i32,
    username: String,
    is_admin: bool,
}

#[derive(Debug, Serialize, Deserialize)]
struct RegisterRequest {
    username: String,
    password: String,
    email: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct UploadRequest {
    name: String,
    version: String,
    description: String,
    category: String,
    icon_data: Option<String>, // Base64 encoded icon
}

#[derive(Debug, Serialize, Deserialize)]
struct SearchRequest {
    query: Option<String>,
    category: Option<String>,
    min_rating: Option<f64>,
    sort_by: Option<String>, // name, rating, downloads, date
    sort_order: Option<String>, // asc, desc
}

#[derive(Debug, Serialize, Deserialize)]
struct ModerationRequest {
    app_id: i32,
    status: String, // approved, rejected
    reason: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String,
    user_id: i32,
    is_admin: bool,
    exp: usize,
}

const SECRET: &[u8] = b"super_secret_key";
const UPLOAD_DIR: &str = "/var/lib/taustore/uploads";
const ICON_DIR: &str = "/var/lib/taustore/icons";

// Helper: create JWT
fn create_jwt(user: &User) -> String {
    let exp = (Utc::now() + Duration::hours(24)).timestamp() as usize;
    let claims = Claims { 
        sub: user.username.clone(), 
        user_id: user.id,
        is_admin: user.is_admin,
        exp 
    };
    encode(&JwtHeader::default(), &claims, &EncodingKey::from_secret(SECRET)).unwrap()
}

// Helper: validate JWT
fn validate_jwt(token: &str) -> Result<Claims, String> {
    decode::<Claims>(token, &DecodingKey::from_secret(SECRET), &Validation::new(Algorithm::HS256))
        .map(|data| data.claims)
        .map_err(|e| e.to_string())
}

// Helper: ensure upload directories exist
fn ensure_upload_dirs() -> Result<(), String> {
    fs::create_dir_all(UPLOAD_DIR).map_err(|e| e.to_string())?;
    fs::create_dir_all(ICON_DIR).map_err(|e| e.to_string())?;
    Ok(())
}

// Helper: save uploaded file
fn save_uploaded_file(file_data: &[u8], filename: &str) -> Result<String, String> {
    let file_path = format!("{}/{}", UPLOAD_DIR, filename);
    fs::write(&file_path, file_data).map_err(|e| e.to_string())?;
    Ok(file_path)
}

// Helper: save icon
fn save_icon(icon_data: &str, app_id: i32) -> Result<String, String> {
    let icon_filename = format!("{}.png", app_id);
    let icon_path = format!("{}/{}", ICON_DIR, icon_filename);
    
    // Decode base64 and save
    let decoded = base64::decode(icon_data).map_err(|e| e.to_string())?;
    fs::write(&icon_path, decoded).map_err(|e| e.to_string())?;
    
    Ok(icon_path)
}

// --- Endpoints ---

#[post("/register", data = "<reg>")]
async fn register(db: DbConn, reg: Json<RegisterRequest>) -> Result<status::Created<Json<UserInfo>>, status::Custom<String>> {
    let username = reg.username.trim();
    let password = reg.password.trim();
    let email = reg.email.as_ref().map(|e| e.trim()).filter(|e| !e.is_empty());
    
    if username.is_empty() || password.len() < 6 {
        return Err(status::Custom(Status::BadRequest, "Invalid username or password (min 6 chars)".into()));
    }
    
    let hash = hash(password, DEFAULT_COST).map_err(|_| status::Custom(Status::InternalServerError, "Hash error".into()))?;
    let now = Utc::now().naive_utc();
    let new_user = User { 
        id: 0, 
        username: username.to_string(), 
        password_hash: hash,
        email,
        is_admin: false,
        created_at: now,
    };
    
    let user = db.run(move |c| {
        diesel::insert_into(users::table).values(&new_user).execute(c)?;
        users::table.filter(users::username.eq(username)).first::<User>(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    let user_info = UserInfo {
        id: user.id,
        username: user.username,
        is_admin: user.is_admin,
    };
    
    Ok(status::Created::new("/register").body(Json(user_info)))
}

#[post("/auth", data = "<auth>")]
async fn auth(db: DbConn, auth: Json<AuthRequest>) -> Result<Json<AuthResponse>, status::Custom<String>> {
    let user: Option<User> = db.run(move |c| {
        users::table.filter(users::username.eq(&auth.username)).first::<User>(c).ok()
    }).await;
    
    if let Some(user) = user {
        if verify(&auth.password, &user.password_hash).unwrap_or(false) {
            let token = create_jwt(&user);
            let user_info = UserInfo {
                id: user.id,
                username: user.username,
                is_admin: user.is_admin,
            };
            return Ok(Json(AuthResponse { token, user: user_info }));
        }
    }
    Err(status::Custom(Status::Unauthorized, "Invalid credentials".into()))
}

#[get("/apps?<search>")]
async fn list_apps(db: DbConn, search: Option<SearchRequest>) -> Result<Json<Vec<App>>, status::Custom<String>> {
    let apps = db.run(|c| {
        let mut query = apps::table.into_boxed();
        
        // Apply search filters
        if let Some(search_req) = search {
            if let Some(query_text) = search_req.query {
                query = query.filter(
                    apps::name.like(format!("%{}%", query_text))
                    .or(apps::description.like(format!("%{}%", query_text)))
                );
            }
            
            if let Some(category) = search_req.category {
                query = query.filter(apps::category.eq(category));
            }
            
            if let Some(min_rating) = search_req.min_rating {
                query = query.filter(apps::rating.ge(min_rating));
            }
            
            // Apply sorting
            match (search_req.sort_by.as_deref(), search_req.sort_order.as_deref()) {
                Some("name") => {
                    query = if search_req.sort_order.as_deref() == Some("desc") {
                        query.order(apps::name.desc())
                    } else {
                        query.order(apps::name.asc())
                    };
                }
                Some("rating") => {
                    query = if search_req.sort_order.as_deref() == Some("desc") {
                        query.order(apps::rating.desc())
                    } else {
                        query.order(apps::rating.asc())
                    };
                }
                Some("downloads") => {
                    query = if search_req.sort_order.as_deref() == Some("desc") {
                        query.order(apps::downloads.desc())
                    } else {
                        query.order(apps::downloads.asc())
                    };
                }
                Some("date") => {
                    query = if search_req.sort_order.as_deref() == Some("desc") {
                        query.order(apps::created_at.desc())
                    } else {
                        query.order(apps::created_at.asc())
                    };
                }
                _ => {
                    query = query.order(apps::created_at.desc());
                }
            }
        } else {
            query = query.order(apps::created_at.desc());
        }
        
        // Only show approved apps
        query = query.filter(apps::status.eq("approved"));
        
        query.load::<App>(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    Ok(Json(apps))
}

#[get("/apps/<id>")]
async fn get_app(db: DbConn, id: i32) -> Result<Json<App>, status::Custom<String>> {
    let app = db.run(move |c| apps::table.find(id).first::<App>(c))
        .await.map_err(|_| status::Custom(Status::NotFound, "App not found".into()))?;
    Ok(Json(app))
}

#[get("/apps/<id>/reviews")]
async fn get_reviews(db: DbConn, id: i32) -> Result<Json<Vec<Review>>, status::Custom<String>> {
    let reviews = db.run(move |c| reviews::table.filter(reviews::app_id.eq(id)).load::<Review>(c))
        .await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    Ok(Json(reviews))
}

#[post("/upload", data = "<upload>")]
async fn upload(db: DbConn, upload: Json<UploadRequest>, auth_header: Option<rocket::http::Header<'_>>) -> Result<status::Accepted<String>, status::Custom<String>> {
    // JWT validation
    let token = auth_header.and_then(|h| h.value().strip_prefix("Bearer ")).ok_or(status::Custom(Status::Unauthorized, "Missing token".into()))?;
    let claims = validate_jwt(token).map_err(|_| status::Custom(Status::Unauthorized, "Invalid token".into()))?;
    
    // Ensure upload directories exist
    ensure_upload_dirs().map_err(|e| status::Custom(Status::InternalServerError, e))?;
    
    let now = Utc::now().naive_utc();
    let package_filename = format!("{}.tau", Uuid::new_v4());
    let package_path = save_uploaded_file(&[], &package_filename).map_err(|e| status::Custom(Status::InternalServerError, e))?;
    
    let icon_path = if let Some(icon_data) = &upload.icon_data {
        save_icon(icon_data, 0).ok() // We'll update this after getting the app ID
    } else {
        None
    };
    
    let new_app = App {
        id: 0,
        name: upload.name.clone(),
        version: upload.version.clone(),
        description: upload.description.clone(),
        icon: icon_path,
        package_path: Some(package_path),
        author_id: claims.user_id,
        category: upload.category.clone(),
        downloads: 0,
        rating: 0.0,
        status: "pending".to_string(),
        created_at: now,
        updated_at: now,
    };
    
    let app_id = db.run(move |c| {
        diesel::insert_into(apps::table).values(&new_app).execute(c)?;
        diesel::select(diesel::dsl::last_insert_rowid).execute(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    // Update icon path with actual app ID
    if let Some(icon_data) = &upload.icon_data {
        let _ = save_icon(icon_data, app_id as i32);
    }
    
    Ok(status::Accepted(Some("App uploaded successfully".into())))
}

#[post("/apps/<id>/download")]
async fn download_app(db: DbConn, id: i32, auth_header: Option<rocket::http::Header<'_>>) -> Result<Json<serde_json::Value>, status::Custom<String>> {
    // JWT validation
    let token = auth_header.and_then(|h| h.value().strip_prefix("Bearer ")).ok_or(status::Custom(Status::Unauthorized, "Missing token".into()))?;
    let claims = validate_jwt(token).map_err(|_| status::Custom(Status::Unauthorized, "Invalid token".into()))?;
    
    // Get app
    let app = db.run(move |c| apps::table.find(id).first::<App>(c))
        .await.map_err(|_| status::Custom(Status::NotFound, "App not found".into()))?;
    
    if app.status != "approved" {
        return Err(status::Custom(Status::Forbidden, "App not available for download".into()));
    }
    
    // Record download
    let now = Utc::now().naive_utc();
    let download = Download {
        id: 0,
        app_id: id,
        user_id: claims.user_id,
        downloaded_at: now,
    };
    
    db.run(move |c| {
        diesel::insert_into(downloads::table).values(&download).execute(c)?;
        diesel::update(apps::table.find(id))
            .set(apps::downloads.eq(apps::downloads + 1))
            .execute(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    Ok(Json(json!({
        "success": true,
        "download_url": app.package_path,
        "message": "Download started"
    })))
}

#[post("/apps/<id>/reviews", data = "<review>")]
async fn post_review(db: DbConn, id: i32, review: Json<Review>, auth_header: Option<rocket::http::Header<'_>>) -> Result<status::Accepted<String>, status::Custom<String>> {
    // JWT validation
    let token = auth_header.and_then(|h| h.value().strip_prefix("Bearer ")).ok_or(status::Custom(Status::Unauthorized, "Missing token".into()))?;
    let claims = validate_jwt(token).map_err(|_| status::Custom(Status::Unauthorized, "Invalid token".into()))?;
    
    let now = Utc::now().naive_utc();
    let new_review = Review {
        id: 0,
        app_id: id,
        user_id: claims.user_id,
        rating: review.rating,
        comment: review.comment.clone(),
        created_at: now,
    };
    
    db.run(move |c| diesel::insert_into(reviews::table).values(&new_review).execute(c))
        .await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    // Update app rating
    let avg_rating = db.run(move |c| {
        reviews::table
            .filter(reviews::app_id.eq(id))
            .select(diesel::dsl::avg(reviews::rating))
            .first::<Option<f64>>(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    if let Some(rating) = avg_rating {
        db.run(move |c| {
            diesel::update(apps::table.find(id))
                .set(apps::rating.eq(rating))
                .execute(c)
        }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    }
    
    Ok(status::Accepted(Some("Review posted successfully".into())))
}

// Moderation endpoints (admin only)
#[post("/admin/moderate", data = "<moderation>")]
async fn moderate_app(db: DbConn, moderation: Json<ModerationRequest>, auth_header: Option<rocket::http::Header<'_>>) -> Result<status::Accepted<String>, status::Custom<String>> {
    // JWT validation
    let token = auth_header.and_then(|h| h.value().strip_prefix("Bearer ")).ok_or(status::Custom(Status::Unauthorized, "Missing token".into()))?;
    let claims = validate_jwt(token).map_err(|_| status::Custom(Status::Unauthorized, "Invalid token".into()))?;
    
    if !claims.is_admin {
        return Err(status::Custom(Status::Forbidden, "Admin access required".into()));
    }
    
    let now = Utc::now().naive_utc();
    db.run(move |c| {
        diesel::update(apps::table.find(moderation.app_id))
            .set((
                apps::status.eq(&moderation.status),
                apps::updated_at.eq(now)
            ))
            .execute(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    Ok(status::Accepted(Some("App moderation completed".into())))
}

#[get("/admin/pending")]
async fn get_pending_apps(db: DbConn, auth_header: Option<rocket::http::Header<'_>>) -> Result<Json<Vec<App>>, status::Custom<String>> {
    // JWT validation
    let token = auth_header.and_then(|h| h.value().strip_prefix("Bearer ")).ok_or(status::Custom(Status::Unauthorized, "Missing token".into()))?;
    let claims = validate_jwt(token).map_err(|_| status::Custom(Status::Unauthorized, "Invalid token".into()))?;
    
    if !claims.is_admin {
        return Err(status::Custom(Status::Forbidden, "Admin access required".into()));
    }
    
    let apps = db.run(|c| {
        apps::table
            .filter(apps::status.eq("pending"))
            .order(apps::created_at.desc())
            .load::<App>(c)
    }).await.map_err(|_| status::Custom(Status::InternalServerError, "DB error".into()))?;
    
    Ok(Json(apps))
}

#[launch]
fn rocket() -> _ {
    rocket::build()
        .attach(DbConn::fairing())
        .mount("/", routes![
            register, auth, list_apps, get_app, get_reviews, 
            upload, download_app, post_review, moderate_app, get_pending_apps
        ])
} 