import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export async function sendOtp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any old OTPs for this email to prevent multiple valid OTPs
    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
    });

    const emailTemplate = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verify your email address</h2>
        <p>Hi ${name},</p>
        <p>Your verification code for Cortexa is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px; color: #6366f1;">${otp}</h1>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this code, you can safely ignore this email.</p>
      </div>
    `;

    try {
      await sendEmail({
        email,
        subject: "Cortexa - Verification Code",
        html: emailTemplate,
      });

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (emailError) {
      console.error(emailError);
      await Otp.deleteMany({ email }); // Delete saved OTP if email failed to send
      return res.status(500).json({ message: "Error sending email. Please check your SMTP settings." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function register(req, res) {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({ message: "All fields, including OTP, are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ message: "OTP has expired or was not generated" });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP verified, now delete it
    await Otp.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
