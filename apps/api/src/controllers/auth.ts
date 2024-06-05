import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user";

const users: User[] = [];

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  const duplicate = users.find((u) => u.username === username);
  if (duplicate) {
    return res.status(409).json({ msg: "User already exists" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({ username, password: hashedPassword });

    res.status(201).json({ msg: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ msg: "Username and password are required" });
  }

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ msg: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });

  const refreshToken = jwt.sign(
    { username },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "1m",
    }
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });

  res.json({ accessToken: accessToken });
};

export default {
  register,
  login,
};
