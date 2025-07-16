// controllers/checkout.controller.js
import { PrismaClient } from '../generated/prisma/index.js';
const prisma = new PrismaClient();

export const handleCheckout = async (req, res) => {
  const userId = req.user.id; // dari JWT
  const { productId, quantity } = req.body;

  try {
    // Ambil detail produk
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Jumlah melebihi stok yang tersedia' });
    }

    // Hitung total harga
    const totalPrice = product.price * quantity;

    // Buat order baru
    const order = await prisma.order.create({
      data: {
        buyer_id: userId,
        total_price: totalPrice,
        status: 'pending', // atau sesuai enum kamu
        items: {
          create: [{
            product_id: productId,
            quantity,
            price: product.price
          }]
        },
        status_logs: {
          create: {
            status: 'pending' // status awal
          }
        }
      },
      include: {
        items: true,
        status_logs: true
      }
    });

    // Kurangi stok produk
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: product.stock - quantity
      }
    });

    res.status(201).json({ message: 'Checkout berhasil', order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Checkout gagal' });
  }
};
