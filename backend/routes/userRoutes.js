const express = require("express");
const router = express.Router(); 
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

//Only admin can access this route
router.get("/admins", verifyToken, authorizeRoles("admin"), (req, res) => {
    res.json({ message: "Welcome Admin"});
});

//All can access this router
router.get("/users", verifyToken, authorizeRoles("admin", "user"), (req, res) => {
    res.json({ message: "Welcome User"});
});

router.get("/", verifyToken, authorizeRoles("admin"), getAllUsers);

router.get("/:id", verifyToken, authorizeRoles("admin", "user"), getUserById);

router.put("/:id", verifyToken, authorizeRoles("admin", "user"), updateUser);

router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteUser);

module.exports = router;