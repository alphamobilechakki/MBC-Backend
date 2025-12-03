import userModel from "../../models/userModel.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            data: users,
            count: users.length
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};
