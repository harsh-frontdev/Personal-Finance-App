import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    description: String,
    amount: Number,
    category: String,
    account: String,
    date: Date,
    time: String
});

export default mongoose.model("Transaction", transactionSchema);
