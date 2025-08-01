const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { adminDashboard, userDashboard } = require("../controllers/dashboardController");

router.get("/admins", verifyToken, authorizeRoles("admin"), adminDashboard);

router.get("/users", verifyToken, authorizeRoles("user"), userDashboard);

module.exports = router;