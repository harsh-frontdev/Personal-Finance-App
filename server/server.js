import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// 1. Initialize App and Config
dotenv.config();
const app = express();
connectDB();

// 2. Middleware
app.use(cors());
app.use(express.json());

// Log every request to terminal
app.use((req, res, next) => {
    console.log(`${req.method} request received at ${req.url}`);
    next();
});

// API Routes
app.use('/api/transactions', transactionRoutes);

// Static Files
const __dirname = import.meta.dirname;
const staticPath = path.join(__dirname, '../public');

app.use(express.static(staticPath))

app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});