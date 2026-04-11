
import {getCartByIdUser} from "../models/cart.models.js";
import * as transactionModels from "../models/transaction.models.js"; 
import { json } from "stream/consumers";


/**
 * @desc  Create a new transaction
 * @route POST /transactions
 */

export async function createTansaction(req, res) {
    try{
        let data = req.body;
        const items = await getCartByIdUser(data.user_id);
        if (!items || items.length <= 0){
            res.status(400).json({
                success: false,
                message: "cart is empty"
            });
            return ;
        }

        data = {...data, items};

        const transactionId = await transactionModels.createTransaction(data);
        if(!transactionId){
            res.status(400).json({
                success: false,
                message: "cart is empty"
            });
            return ;
        } 
        
        return res.status(201).json({
            success: true,
            message: "Transaction created successfully",
            transaction_id: transactionId,
          });

    }catch(err){
        res.status(500),json({
            success : false,
            message: err.message
        });
    }
}


/**
 * @desc  Get all transactions
 * @route GET /transactions
 */
export async function getAllTransactions(req, res) {
  try {
    const transactions = await transactionModels.getAllTransactions();
    return res.status(200).json({
      success: true,
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * @desc  Get transaction by ID
 * @route GET /transactions/:id
 */
export async function getTransactionById(req, res) {
  try {
    const { id } = req.params;
    const transaction = await transactionModels.getTransactionById(id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * @desc  Update transaction status
 * @route PATCH /transactions/:id
 */
export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await transactionModels.updateTransaction(id, status);

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * @desc  Delete transaction
 * @route DELETE /transactions/:id
 */
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    await transactionModels.deleteTransaction(id);

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

/**
 * @desc  Get transactions by user ID
 * @route GET /users/:userId/transactions
 */
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await transactionModels.getTransactionsByUserId(userId);

    return res.status(200).json({
      success: true,
      message: "User transactions retrieved successfully",
      data: transactions,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}