import prisma from '../prismaClient.js';


export const createRoute = async (req, res) => {
  try {
    const { distance_km, traffic_level, base_time_min } = req.body;
    const route = await prisma.route.create({
      data: { distance_km, traffic_level, base_time_min },
    });
    res.status(201).json(route);
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Failed to create route" });
  }
};

export const getAllRoutes = async (req, res) => {
  try {
    const routes = await prisma.route.findMany();
    res.json(routes);
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
};

export const getRouteById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const route = await prisma.route.findUnique({
      where: { id },
    });
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }
    res.json(route);
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Failed to fetch route" });
  }
};

export const updateRoute = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { distance_km, traffic_level, base_time_min } = req.body;
    const updatedRoute = await prisma.route.update({
      where: { id },
      data: { distance_km, traffic_level, base_time_min },
    });
    res.json(updatedRoute);
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Failed to update route" });
  }
};

export const deleteRoute = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.route.delete({
      where: { id },
    });
    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Failed to delete route" });
  }
};
