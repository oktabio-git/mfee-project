import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ msg: "Unauthorized" });
  }

  const [, token] = authHeader.split(" ");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(403).json({ msg: "Forbidden" });
    }

    req.user = user;
    next();
  });
};

export default {
  verifyToken,
};
