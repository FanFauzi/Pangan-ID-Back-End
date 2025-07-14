import { PrismaClient } from '../generated/prisma/index.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: imagePath,
        user_id: req.user.id // asumsi kamu sudah punya middleware auth
      },
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan produk', error: err.message });
  }
}

const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: parseInt(id),
        user_id: req.user.id, // hanya jika pemiliknya sesuai
      },
    });

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan atau bukan milik Anda' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil produk', error: err.message });
  }
};

const putProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;
    const productId = parseInt(req.params.id);
    const userId = req.user.id; // user dari token
    // const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Ambil data produk
    const product = await prisma.product.findFirst({
      where: { id: productId, user_id: userId }
    });
    // console.log(req.file);

    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }
    let imagePath = product.image_url; // gambar lama
    console.log(3 ,'backend', req.body);
    console.log(1 ,'backend', imagePath);

    if (req.file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxZise = 2 * 1024 * 1024; // 2MB

      // Validasi tipe dan ukuran
      if(!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ message: 'Tipe file tidak diizinkan' });
      }

      if(req.file.size > maxZise) {
        return res.status(400).json({ message: 'Ukuran file terlalu besar' });
      }

      if(product.image_url) {
        const oldImageName = path.basename(product.image_url);
        const oldImagePath = path.join(process.cwd(), 'uploads', oldImageName);
        
        fs.unlink(oldImagePath, (err) => {
          if(err) console.warn('Gagal menghapus gambar lama:', err.message);
          else console.log('Gambar lama berhasil dihapus', oldImagePath);
        });
      }

      imagePath = `/uploads/${req.file.filename}`;
    }

    console.log(2 ,'backend', imagePath);
    // Update data
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        image_url: imagePath
      },
    });

    res.json({ message: 'Produk berhasil diubah', updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Terjadi kesalahan saat mengubah produk' });
  }
}

export { addProduct, getAllProducts, getProductById, putProduct };
