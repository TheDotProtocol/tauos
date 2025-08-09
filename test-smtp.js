
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mailserver.tauos.org",
  port: 25,
  secure: false,
  auth: {
    user: "noreply@tauos.org",
    pass: ""
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify(function(error, success) {
  if (error) {
    console.log("❌ SMTP Error:", error.message);
  } else {
    console.log("✅ SMTP Server ready");
  }
  process.exit(0);
});

