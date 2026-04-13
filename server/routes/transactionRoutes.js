import express from 'express';

const router = express.Router();
import { addTransaction } from '../controllers/transactionController.js';

router.post('/', addTransaction);

router.route("/")
    .post(addTransaction)
    .get((req, res) => res.send("GET request received! Route is working."));

export default router;