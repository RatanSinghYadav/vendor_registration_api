const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
	const token = req.header('token');
	// console.log("token:", token);
	try {
		if (!token) {
			res.status(401).json({ success: false, message: "Please give valid token" })
		};

		const verified = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(verified.role);

		req.userId = verified.userId;
		req.role = verified.role;
		next();
	} catch (error) {
		res.status(401).json({ message: "Please authenticate using a valid token" }, error)
	}
}

module.exports = verifyToken; 