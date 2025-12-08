import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./.env",
});
console.log("🔹 ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("🔹 REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);
console.log("🔹 ACCESS_TOKEN_EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
console.log("🔹 REFRESH_TOKEN_EXPIRY:", process.env.REFRESH_TOKEN_EXPIRY);


connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  });
