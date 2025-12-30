import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { generalMails } from "../config/email.js";




export const registerSchool = async (req, res) => {
  try {
    const {
      email,
      password,
      confirmpassword,
      name,
      description,
      phone,
      address,
    } = req.body;

    for (const [key, val] of Object.entries(req.body)) {
      if (!val) {
        return res.status(400).json({ message: `${key} is required!` });
      }
    }

    const passwordRegex = /^[A-Z](?=.*[\W_])/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must start with a capital letter and contain at least one special character.",
      });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(
        req.file.buffer,
        "image",
        "school_images"
      );
    }

    const existingSchool = await prisma.school.findUnique({
      where: { email },
    });

    if (existingSchool) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const school = await prisma.school.create({
      data: {
        email,
        password: hashedPassword,
        name,
        image: imageUrl,
        description,
        phone,
        address,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        description: true,
        phone: true,
        address: true,
      },
    });

    const token = jwt.sign(
      { id: school.id, email: school.email },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verifyemail/${token}`;

    const message = `
      <p>Hi <b>${name}</b>,</p>
      <p>Welcome to CBT.</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await generalMails(email, message);

    res.status(201).json({
      success: true,
      message: "School registered successfully.",
      data: school,
    });
  } catch (err) {
    console.error("Register school error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.school.findUnique({
      where: { email },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.verified) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "10m" }
      );

      const verificationLink = `${process.env.FRONTEND_URL}/verifyemail/${token}`;

      await generalMails(
        email,
        `<p>Email not verified</p><a href="${verificationLink}">Verify</a>`
      );

      return res.status(400).json({
        success: false,
        message: "Email not verified. Verification email sent.",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.school.findUnique({
      where: { id: Number(id) },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.school.findMany();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.school.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const recoverAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.school.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(200).json({
        message: "If this email exists, a recovery link has been sent",
      });
    }

    const recoveryToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    const recoverLink = `${process.env.FRONTEND_URL}/resetpassword/${recoveryToken}`;

    await generalMails(
      email,
      `<p>Reset password</p><a href="${recoverLink}">Reset</a>`
    );

    res.status(200).json({
      message: "If this email exists, a recovery link has been sent",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.school.update({
      where: { id: payload.id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.school.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    await prisma.school.update({
      where: { id: user.id },
      data: { verified: true },
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
