import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

const getBuyerOrders = async (req, res) => {
  const buyerId = req.user.id;
  const orders = await prisma.order.findMany({
    where: { buyer_id: buyerId },
    include: {
      items: {
        include: { product: true }
      },
      status_logs: true,
    },
    orderBy: { created_at: 'desc' }
  });

  res.json(orders);
};


// hanya pesanan yang mengandung produk milik produsen
const getProducerOrders = async (req, res) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            user_id: userId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      buyer: {
        select: {
          username: true,
        },
      },
      status_logs: true,
    },
  });

  res.json({ orders });
};

const getOrderDetail = async (req, res) => {
  const userId = req.user.id;

  const orders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          product: {
            user_id: userId,
          },
        },
      },
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      buyer: {
        select: {
          username: true,
        },
      },
      status_logs: true,
    },
  });

  res.json({ orders });
}

const updateStatusProduk = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['shipped', 'delivered', 'done'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Status tidak valid' });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        status,
        status_logs: {
          create: {
            status,
            updated_at: new Date(),
          },
        },
      },
      include: {
        items: { include: { product: true } },
        status_logs: true,
        buyer: true,
      },
    });

    res.json({ order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal update status pesanan' });
  }
};

export { getBuyerOrders, getProducerOrders, getOrderDetail, updateStatusProduk };