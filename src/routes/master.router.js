import express from "express";
import  * as masterController  from "../controller/master.controller.js";

const masterRouter = express.Router();

/**
 * @swagger
 * /master/{table}:
 *   post:
 *     summary: Create a new master record
 *     tags: [Master]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Record created successfully
 *       400:
 *         description: Bad request
 */
masterRouter.post("/:table", masterController.createMaster);

/**
 * @swagger
 * /master/{table}:
 *   get:
 *     summary: Get all master records from a table
 *     tags: [Master]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
masterRouter.get("/:table", masterController.getAllMaster);

/**
 * @swagger
 * /master/{table}/{id}:
 *   get:
 *     summary: Get master record by ID
 *     tags: [Master]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record details
 *       404:
 *         description: Record not found
 */
masterRouter.get("/:table/:id", masterController.getMasterById);

/**
 * @swagger
 * /master/{table}/{id}:
 *   put:
 *     summary: Update master record
 *     tags: [Master]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Record updated
 *       404:
 *         description: Record not found
 */
masterRouter.put("/:table/:id", masterController.updateMaster);

/**
 * @swagger
 * /master/{table}/{id}:
 *   delete:
 *     summary: Delete master record
 *     tags: [Master]
 *     parameters:
 *       - in: path
 *         name: table
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Record deleted
 *       404:
 *         description: Record not found
 */
masterRouter.delete("/:table/:id", masterController.deleteMaster);

export default masterRouter;