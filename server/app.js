import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

connectDB();

const rootPath = path.join(__dirname, "..");

app.use(express.static(rootPath));

app.get("/", (req, res) => {
  // Use path.resolve to ensure the system finds the exact file
  const indexPath = path.resolve(rootPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error("Error sending index.html:", err);
      res
        .status(403)
        .send("Server cannot find or access index.html. Path: " + indexPath);
    }
  });
});

app.get("/add-transaction", async (req, res) => {
  try {
    const transaction = await mongoose.connection
      .collection("transactions")
      .insertOne({
        account: "Axis Bank",
        amount: -250,
        category: "Groceries",
        date: "2000-08-14",
        description: "Quae odit quia aute ",
        time: "01:18 PM",
        createdAt: new Date(),
      });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
