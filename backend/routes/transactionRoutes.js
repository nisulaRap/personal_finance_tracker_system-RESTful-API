const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { addTransaction, getTransaction, updateTransaction, deleteTransaction } = require("../controllers/transactionController");

router.post("/", verifyToken, authorizeRoles("admin", "user"), addTransaction);

router.get("/", verifyToken, authorizeRoles("admin", "user"), getTransaction);

router.put("/:id", verifyToken, authorizeRoles("admin", "user"), updateTransaction);

router.delete("/:id", verifyToken, authorizeRoles("adomin", "user"), deleteTransaction);

module.exports = router;