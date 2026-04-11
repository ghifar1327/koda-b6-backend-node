import express from "express";
import * as transactionController from "../controller/transaction.controller.js";

const transactionRouter = express.Router();

transactionRouter.post("/", transactionController.createTansaction);
transactionRouter.get("/", transactionController.getAllTransactions);
transactionRouter.get("/:id", transactionController.getTransactionById);
transactionRouter.patch("/:id", transactionController.updateTransaction);
transactionRouter.delete("/:id", transactionController.deleteTransaction);
transactionRouter.get("/:userId", transactionController.getTransactionsByUserId);

export default transactionRouter;