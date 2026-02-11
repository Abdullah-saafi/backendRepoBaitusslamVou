import express from "express";
import {
  createLabTech,
  getLabTechs,
  deleteLabTech,
} from "../controller/LabTecController.js";
import { verifyToken, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role
router.post("/create-lab-tech", verifyToken, isAdmin, createLabTech);
router.get("/lab-techs", verifyToken, isAdmin, getLabTechs);
router.delete("/lab-tech/:id", verifyToken, isAdmin, deleteLabTech);


export default router;
