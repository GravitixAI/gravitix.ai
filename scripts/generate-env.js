const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");

if (fs.existsSync(envPath)) {
  console.log(".env already exists; not overwriting.");
  process.exit(0);
}

const pg = crypto.randomBytes(24).toString("hex");
const redis = crypto.randomBytes(24).toString("hex");
const sess = crypto.randomBytes(32).toString("hex");
const admin = crypto.randomBytes(18).toString("base64url");

const env = [
  "SITE_ADDRESS=gravitix.ai",
  "ACME_EMAIL=admin@gravitix.ai",
  "",
  "POSTGRES_USER=ccad",
  `POSTGRES_PASSWORD=${pg}`,
  "POSTGRES_DB=ccad",
  `DATABASE_URL=postgresql://ccad:${pg}@postgres:5432/ccad`,
  "",
  `REDIS_PASSWORD=${redis}`,
  `REDIS_URL=redis://:${redis}@redis:6379`,
  "",
  `SESSION_SECRET=${sess}`,
  "",
  "ADMIN_EMAIL=admin@gravitix.ai",
  `ADMIN_PASSWORD=${admin}`,
  "ADMIN_NAME=Site Admin",
  "",
  "NODE_ENV=production",
  "",
].join("\n");

fs.writeFileSync(envPath, env);
console.log("Wrote .env");
console.log("ADMIN_EMAIL=admin@gravitix.ai");
console.log(`ADMIN_PASSWORD=${admin}`);
