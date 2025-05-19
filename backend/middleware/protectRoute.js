const jwt =require( "jsonwebtoken")
const users =require( "../model/userSchema")

exports. protectRoute = async (req, res, next) => {
  
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res 
        .status(401) 
        .json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    const user = await users.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
 