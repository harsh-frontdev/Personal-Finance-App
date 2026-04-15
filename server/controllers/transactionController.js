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

export const getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.find().sort({ date: -1 });
        console.log(transaction);

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch(error) {
            console.error("Error retrieving documents:", error);
    }
}

export const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await Transaction.findByIdAndDelete(id);
        res.status(200).json({
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