import prisma from '../prismaClient.js';


export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: { route: true }, 
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { route: true },
    });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const createOrder = async (req, res) => {
  try {
    const { value_rs, route_id, delivery_time } = req.body;
    const newOrder = await prisma.order.create({
      data: { value_rs, route_id, delivery_time },
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateOrder = async (req, res) => {
  try {
    const { value_rs, route_id, delivery_time } = req.body;
    const updatedOrder = await prisma.order.update({
      where: { order_id: parseInt(req.params.id) },
      data: { value_rs, route_id, delivery_time },
    });
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    await prisma.order.delete({
      where: { order_id: parseInt(req.params.id) },
    });
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
