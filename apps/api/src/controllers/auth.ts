import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import User from "../models/user";

const register = async (req, res, next) => {
  const users = await User.find();

  const username: string = req.body.username;
  const password: string = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  const duplicate = users.find((u) => u.username === username);
  if (duplicate) {
    return res.status(409).json({ msg: "User already exists" });
  }

  try {
    const hashedPassword: string = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    await User.create(req.body);

    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const users = await User.find();
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ msg: "Username and password are required" });
    }

    const user = users.find((u) => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    const refreshToken = jwt.sign(
      { username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: accessToken });
  } catch (e) {
    next(e);
  }
};

const refresh = (req, res) => {
  // Get refresh token from cookies
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, { username }) => {
      if (err) {
        // Invalid token
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessToken = jwt.sign(
        { username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
};

const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export default {
  register,
  login,
  refresh,
  logout,
};
