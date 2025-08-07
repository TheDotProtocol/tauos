from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import json
import hashlib
import shutil
from datetime import datetime, timedelta
import uvicorn
from pathlib import Path

app = FastAPI(
    title="TauOS OTA Server",
    description="Over-the-Air update server for TauOS Mobile",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Data models
class DeviceInfo(BaseModel):
    device_id: str
    platform: str  # "ios" or "android"
    current_version: str
    build_number: int
    device_model: str
    os_version: str

class UpdateInfo(BaseModel):
    version: str
    build_number: int
    platform: str
    download_url: str
    file_size: int
    checksum: str
    changelog: str
    is_mandatory: bool = False
    min_required_version: Optional[str] = None
    release_date: datetime
    is_active: bool = True

# Storage paths
UPLOADS_DIR = Path("uploads")
BUILDS_DIR = Path("builds")
CONFIG_FILE = Path("config/ota_config.json")

# Ensure directories exist
UPLOADS_DIR.mkdir(exist_ok=True)
BUILDS_DIR.mkdir(exist_ok=True)
CONFIG_FILE.parent.mkdir(exist_ok=True)

# In-memory storage (replace with database in production)
updates_db: Dict[str, UpdateInfo] = {}

# Admin credentials
ADMIN_TOKEN = "tauos-admin-2025"

def verify_admin_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify admin authentication"""
    if credentials.credentials != ADMIN_TOKEN:
        raise HTTPException(status_code=401, detail="Invalid admin token")
    return credentials.credentials

def calculate_checksum(file_path: Path) -> str:
    """Calculate SHA256 checksum of file"""
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            sha256_hash.update(chunk)
    return sha256_hash.hexdigest()

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "TauOS OTA Server",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "updates_count": len(updates_db)
    }

@app.post("/api/v1/updates/check")
async def check_for_updates(device: DeviceInfo):
    """Check for available updates for a device"""
    platform = device.platform.lower()
    current_build = device.build_number
    
    # Find latest update for this platform
    latest_update = None
    for update_id, update in updates_db.items():
        if (update.platform == platform and 
            update.is_active and 
            update.build_number > current_build):
            if latest_update is None or update.build_number > latest_update.build_number:
                latest_update = update
    
    if latest_update:
        return {
            "has_update": True,
            "update_info": {
                "version": latest_update.version,
                "build_number": latest_update.build_number,
                "download_url": latest_update.download_url,
                "file_size": latest_update.file_size,
                "checksum": latest_update.checksum,
                "changelog": latest_update.changelog,
                "is_mandatory": latest_update.is_mandatory,
                "release_date": latest_update.release_date.isoformat()
            }
        }
    
    return {"has_update": False}

@app.post("/api/v1/updates/download/{update_id}")
async def download_update(update_id: str, device: DeviceInfo):
    """Download a specific update"""
    if update_id not in updates_db:
        raise HTTPException(status_code=404, detail="Update not found")
    
    update = updates_db[update_id]
    file_path = BUILDS_DIR / f"{update_id}.{update.platform}"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Update file not found")
    
    return FileResponse(
        path=file_path,
        filename=f"tauos-{update.version}-{update.platform}.{update.platform}",
        media_type="application/octet-stream"
    )

# Admin endpoints
@app.post("/admin/updates/upload")
async def upload_update(
    file: UploadFile = File(...),
    version: str = Form(...),
    build_number: int = Form(...),
    platform: str = Form(...),
    changelog: str = Form(...),
    is_mandatory: bool = Form(False),
    token: str = Depends(verify_admin_token)
):
    """Upload a new update"""
    # Save file
    update_id = f"tauos-{version}-{platform}-{build_number}"
    file_path = BUILDS_DIR / f"{update_id}.{platform}"
    
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)
    
    # Calculate checksum
    checksum = calculate_checksum(file_path)
    
    # Create update info
    update_info = UpdateInfo(
        version=version,
        build_number=build_number,
        platform=platform,
        download_url=f"/api/v1/updates/download/{update_id}",
        file_size=file_path.stat().st_size,
        checksum=checksum,
        changelog=changelog,
        is_mandatory=is_mandatory,
        release_date=datetime.now(),
        is_active=True
    )
    
    updates_db[update_id] = update_info
    
    return {
        "update_id": update_id,
        "message": "Update uploaded successfully",
        "checksum": checksum,
        "file_size": update_info.file_size
    }

@app.get("/admin/updates")
async def list_updates(token: str = Depends(verify_admin_token)):
    """List all updates (admin only)"""
    updates = []
    for update_id, update in updates_db.items():
        updates.append({
            "update_id": update_id,
            "version": update.version,
            "build_number": update.build_number,
            "platform": update.platform,
            "is_mandatory": update.is_mandatory,
            "is_active": update.is_active,
            "release_date": update.release_date.isoformat(),
            "file_size": update.file_size
        })
    
    return {"updates": updates}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 