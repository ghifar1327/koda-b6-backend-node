import express from "express";
import  * as masterController  from "../controller/master.controller.js";

const masterRouter = express.Router();

masterRouter.post("/:table", masterController.createMaster);
masterRouter.get("/:table", masterController.getAllMaster);
masterRouter.get("/:table/:id", masterController.getMasterById);
masterRouter.put("/:table/:id", masterController.updateMaster);
masterRouter.delete("/:table/:id", masterController.deleteMaster);

export default masterRouter;