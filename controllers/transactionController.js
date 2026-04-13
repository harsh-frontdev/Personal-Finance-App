import Transaction from "../models/Transaction.js";

export const addTransaction = async (req, res) => {
    try {
        const { account, amount, category, date, description, time } = req.body;

        const transaction = await Transaction.create({
            account,
            amount,
            category,
            date,
            description,
            time
        });

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}