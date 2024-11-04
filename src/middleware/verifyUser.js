const User = require("../models/user.model");


const verifyUser = async (req, res) => {
    try {
        const userId = req.userId;
        const role = req.role;
        // console.log("userId:", userId);
        // console.log("role:", role);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'please authenticate using a valid token!' });

        }

        const user = await User.findById(userId);
        res.status(200).json({ success: true, message: 'verified', data: user });

    } catch (error) {
        res.status(401).json({ message: "Please authenticate using a valid token" }, error)
    }
}

module.exports = verifyUser;