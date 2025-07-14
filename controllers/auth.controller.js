// controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js'; // atau sesuaikan path relatifnya

const prisma = new PrismaClient();


const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Email tidak ditemukan' });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Password salah' });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.json({ message: 'Login berhasil', token });
};

const register = async (req, res) => {
  const { username, email, password, role, addres } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
        addres
      },
    });

    res.status(201).json({ message: 'Registrasi berhasil', user: { id: newUser.id, email: newUser.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi' });
  }
};

const getProfile = async (req, res) => {
  const userId = req.user.id; // Dapat dari JWT
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

  res.json({ user });
};

export { login, register, getProfile };