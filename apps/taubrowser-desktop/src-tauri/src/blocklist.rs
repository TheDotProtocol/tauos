use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct BlocklistResponse {
    pub version: u32,
    pub domains: Vec<String>,
    pub count: usize,
}

pub struct Blocklist {
    domains: Vec<String>,
}

impl Blocklist {
    pub fn embedded() -> Self {
        let raw = include_str!("blocklist.json");
        let domains: Vec<String> = serde_json::from_str(raw).unwrap_or_default();
        Self { domains }
    }

    pub fn is_blocked(&self, url: &str) -> bool {
        let host = match url::Url::parse(url) {
            Ok(u) => u.host_str().unwrap_or("").to_lowercase(),
            Err(_) => return false,
        };
        self.domains.iter().any(|d| {
            let d = d.to_lowercase();
            host == d || host.ends_with(&format!(".{d}"))
        })
    }

    pub fn to_response(&self) -> BlocklistResponse {
        BlocklistResponse {
            version: 1,
            count: self.domains.len(),
            domains: self.domains.clone(),
        }
    }
}
