const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { addBudget, getBudget, updateBudget, deleteBudget } = require("../controllers/budgetController");

router.post("/", verifyToken, authorizeRoles("admin", "user"), addBudget);

router.get("/", verifyToken, authorizeRoles("admin", "user"), getBudget);

router.put("/:id", verifyToken, authorizeRoles("admin", "user"), updateBudget);

router.delete("/:id", verifyToken, authorizeRoles("admin", "user"), deleteBudget);

module.exports = router;