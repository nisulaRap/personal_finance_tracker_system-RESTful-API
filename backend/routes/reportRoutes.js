const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { generateReport, getReports } = require("../controllers/reportController");

router.post("/generate-reports", verifyToken, authorizeRoles("admin", "user"), generateReport);

router.get("/get-reports", verifyToken, authorizeRoles("admin", "user"), getReports);

module.exports = router;