const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { addGoal, getGoal, updateGoal, deleteGoal } = require("../controllers/goalController");

router.post("/", verifyToken, authorizeRoles("admin", "user"), addGoal);

router.get("/", verifyToken, authorizeRoles("admin", "user"), getGoal);

router.put("/:id", verifyToken, authorizeRoles("admin", "user"), updateGoal);

router.delete("/:id", verifyToken, authorizeRoles("admin", "user"), deleteGoal);

module.exports = router;