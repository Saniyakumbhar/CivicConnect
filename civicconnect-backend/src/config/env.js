import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name} in .env. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  mongoUri: required("MONGODB_URI"),
  jwtSecret: required("JWT_SECRET"),
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  isProduction: process.env.NODE_ENV === "production",
};
