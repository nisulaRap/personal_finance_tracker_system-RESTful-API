const User = require("../models/userModel"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async(req, res) => {
    try {
        const { username, email, password, role, currency } = req.body;

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, role, currency: currency || "LKR" });
        await newUser.save();
        res.status(201).json({ message: `User registered with username ${username}`});
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }    
};

const login = async(req, res) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if(!user) {
            return res.status(404).json({ message: `User with username ${username} not found.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role, currency: user.currency }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }

};

module.exports = {register, login};