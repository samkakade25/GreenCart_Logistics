import prisma from '../prismaClient.js';

export const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
};


export const getDriverById = async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
};


export const createDriver = async (req, res) => {
  const { name, shift_hours, past_week_hours } = req.body;
  try {
    const driver = await prisma.driver.create({
      data: { name, shift_hours, past_week_hours },
    });
    res.status(201).json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create driver' });
  }
};


export const updateDriver = async (req, res) => {
  const { name, shift_hours, past_week_hours } = req.body;
  try {
    const driver = await prisma.driver.update({
      where: { id: parseInt(req.params.id) },
      data: { name, shift_hours, past_week_hours },
    });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update driver' });
  }
};


export const deleteDriver = async (req, res) => {
  try {
    await prisma.driver.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete driver' });
  }
};
