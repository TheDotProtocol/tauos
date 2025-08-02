# 🚀 **Local Development Guide - TauMail & TauCloud**

## 📋 **Overview**

This guide helps you set up and test TauMail and TauCloud applications locally before deploying to production. Both applications now feature:

- ✅ **Professional UI**: Gmail-style (TauMail) and iCloud-style (TauCloud) interfaces
- ✅ **Database Integration**: SQLite databases with proper user management
- ✅ **Custom Domain**: Username + @tauos.org email addresses
- ✅ **Recovery Email**: Password reset functionality
- ✅ **File Storage**: Complete file upload/download system (TauCloud)
- ✅ **Email System**: Send/receive emails with proper threading (TauMail)

## 🛠️ **Setup Instructions**

### **Prerequisites**
- Node.js 18+ installed
- Git repository cloned
- Terminal/Command Prompt access

### **1. Start TauMail (Port 3001)**
```bash
cd local-development/taumail-local
npm install
npm start
```

**Access**: http://localhost:3001

### **2. Start TauCloud (Port 3002)**
```bash
cd local-development/taucloud-local
npm install
npm start
```

**Access**: http://localhost:3002

## 🧪 **Testing Scenarios**

### **TauMail Testing**

#### **1. User Registration**
- Visit http://localhost:3001
- Click "Create Account" (if available)
- Enter username: `testuser`
- Password: `password123`
- Recovery email: `your-email@example.com` (optional)
- Verify email shows as `testuser@tauos.org`

#### **2. User Login**
- Enter username: `testuser`
- Enter password: `password123`
- Should redirect to email interface

#### **3. Email Functionality**
- Send emails between users
- Test inbox, sent, starred folders
- Test email composition
- Test email reading/marking as read

### **TauCloud Testing**

#### **1. User Registration**
- Visit http://localhost:3002
- Create account with same credentials
- Verify email shows as `testuser@tauos.org`

#### **2. File Upload**
- Login to TauCloud
- Upload various file types (images, documents, videos)
- Test file organization in folders
- Test file download

#### **3. Storage Management**
- Check storage usage statistics
- Test storage limits
- Test file deletion

## 📊 **Database Files**

### **TauMail Database**
- **File**: `taumail-local/taumail.db`
- **Tables**: `users`, `emails`, `email_attachments`
- **Reset**: Delete the `.db` file to start fresh

### **TauCloud Database**
- **File**: `taucloud-local/taucloud.db`
- **Tables**: `users`, `files`, `folders`
- **Uploads**: `taucloud-local/uploads/`
- **Reset**: Delete the `.db` file and `uploads/` folder

## 🔧 **Development Features**

### **TauMail Features**
- ✅ User registration with @tauos.org domain
- ✅ JWT authentication
- ✅ Email composition and sending
- ✅ Inbox, Sent, Starred, Trash folders
- ✅ Email threading and organization
- ✅ Recovery email for password reset
- ✅ Gmail-style interface

### **TauCloud Features**
- ✅ User registration with @tauos.org domain
- ✅ JWT authentication
- ✅ File upload/download
- ✅ Folder creation and organization
- ✅ Storage usage tracking
- ✅ File type detection
- ✅ iCloud-style interface

## 🐛 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Check what's using the port
lsof -i :3001
lsof -i :3002

# Kill the process
kill -9 <PID>
```

#### **Database Locked**
```bash
# Stop the server (Ctrl+C)
# Delete the database file
rm taumail.db
rm taucloud.db
# Restart the server
npm start
```

#### **Upload Directory Issues**
```bash
# Ensure upload directory exists
mkdir -p uploads
# Set proper permissions
chmod 755 uploads
```

### **Logs**
- Check terminal output for error messages
- Database errors will show in console
- File upload errors will be logged

## 📝 **API Endpoints**

### **TauMail API**
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - User profile
- `POST /api/emails/send` - Send email
- `GET /api/emails/inbox` - Get inbox
- `GET /api/emails/sent` - Get sent emails
- `GET /api/emails/:id` - Get specific email
- `PATCH /api/emails/:id/read` - Mark as read
- `PATCH /api/emails/:id/star` - Star/unstar email
- `DELETE /api/emails/:id` - Delete email

### **TauCloud API**
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/profile` - User profile
- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get user files
- `GET /api/files/:id/download` - Download file
- `DELETE /api/files/:id` - Delete file
- `POST /api/folders` - Create folder
- `GET /api/storage/stats` - Storage statistics

## 🚀 **Next Steps**

### **1. UI Enhancement**
- Complete Gmail-style interface for TauMail
- Complete iCloud-style interface for TauCloud
- Add responsive design
- Add dark mode support

### **2. Feature Enhancement**
- Add email attachments
- Add file sharing
- Add real-time notifications
- Add search functionality

### **3. Production Deployment**
- Replace SQLite with PostgreSQL
- Add Redis for caching
- Add proper email sending (SMTP)
- Add file encryption
- Deploy to Vercel with custom domains

## 📞 **Support**

If you encounter issues:
1. Check the terminal logs for error messages
2. Verify database files exist and are not corrupted
3. Ensure all dependencies are installed
4. Check port availability
5. Verify file permissions

## 🎯 **Success Criteria**

✅ **TauMail Working**: Users can register, login, send/receive emails
✅ **TauCloud Working**: Users can register, login, upload/download files
✅ **Custom Domains**: Username@tauos.org email addresses
✅ **Database**: SQLite databases storing user data
✅ **Recovery Email**: Password reset functionality
✅ **Professional UI**: Gmail/iCloud-style interfaces

**Ready for production deployment!** 🚀 