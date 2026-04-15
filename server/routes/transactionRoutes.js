import express from 'express';

const router = express.Router();
import { addTransaction, getTransaction, deleteTransaction } from '../controllers/transactionController.js';

router.post('/', addTransaction);
router.get('/', getTransaction);
router.delete('/:id', deleteTransaction);

router.route("/")
    .post(addTransaction)
    .get((req, res) => res.send("GET request received! Route is working."))
    .delete(deleteTransaction);

export default router;