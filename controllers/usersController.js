const User = require ("../models/Users")


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json ({
            message: "All users fetched sucessfully",
            users
        })
    } catch (error) {
        res.status(500).json ({ message: "Server error", error: error.message})
        
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).lean().select('-password')
        if (!user) {
            return res.status(400).json ({ message: "User not found"});
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        })
    } catch (error) {
        res.status(500).json ({error: error.message})
        
    }
}