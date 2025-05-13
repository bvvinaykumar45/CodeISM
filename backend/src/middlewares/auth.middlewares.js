import jwt from "jsonwebtoken";

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided.",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unathorized - Invalid token.",
      });
    }
    const user = await db.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.staus(500).json({
      success: false,
      message: "Internal server error. User authentication check failed.",
    });
  }
};

export { isLoggedIn };
