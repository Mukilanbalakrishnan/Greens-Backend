import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin } from '../models/admin.model';

const JWT_SECRET =process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDc4MGZlZjg0ZjRiMGM3NTc3YWM0ZSIsImlhdCI6MTc2NjY3MjYwOCwiZXhwIjoxNzY2NzU5MDA4fQ.zaD1jX5s0n0CeUGxNBEvA1onhfH980yqFXQ5_CKOqxw";

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // 1. Manual Email Format Validation (Regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // 2. Check for existing Admin
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Email is already registered.' });
    }

    // 3. Hash Password and Create
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ 
      message: 'Admin created successfully', 
      admin: { id: admin.id, email: admin.email } 
    });

  }catch (error: any) {
  console.error("DETAILED ERROR:", error); // Check your terminal for this output!
  
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation error', details: error.errors });
  }
  // Return the actual error message to Postman for debugging
  res.status(500).json({ error: error.message || 'Internal Server Error' });
}
};

// In your backend login controller
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT - include username from database
    const token = jwt.sign({ 
      id: admin.id, 
      email: admin.email,
      username: admin.username || 'Admin' // Get from DB
    }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: 'Login successful', token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};