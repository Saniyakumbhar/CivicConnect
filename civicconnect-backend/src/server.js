import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import app from "./app.js";

try {
  await connectDB();
} catch (err) {
  console.error("Could not connect to MongoDB:", err.message);
  console.error("Check that MongoDB is running and MONGODB_URI in .env is correct.");
  process.exit(1);
}

app.listen(env.port, () => {
  console.log(`API running on http://localhost:${env.port}`);
});
