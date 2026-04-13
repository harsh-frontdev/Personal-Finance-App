import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./server/config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} request received at ${req.url}`);
    next();
});

app.use('/api/transactions', transactionRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});