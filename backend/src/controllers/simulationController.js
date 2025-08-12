import prisma from "../prismaClient.js";

export const runSimulation = async (req, res) => {
  try {
    const { availableDrivers, routeStartTime, maxHoursPerDriver } = req.body;

    // Validate inputs
    if (
      typeof availableDrivers !== "number" ||
      availableDrivers <= 0 ||
      !/^([01]\d|2[0-3]):([0-5]\d)$/.test(routeStartTime) ||
      typeof maxHoursPerDriver !== "number" ||
      maxHoursPerDriver <= 0
    ) {
      return res.status(400).json({ error: "Invalid input parameters" });
    }

    // Fetch all drivers and orders with their routes
    const drivers = await prisma.driver.findMany();
    const orders = await prisma.order.findMany({
      include: { route: true },
      orderBy: { deliveryTimestamp: "asc" },
    });

    if (availableDrivers > drivers.length) {
      return res.status(400).json({ error: "Not enough drivers available" });
    }

    // Prepare the driver workloads - slice for available drivers
    const availableDriversList = drivers.slice(0, availableDrivers).map((driver) => ({
      driver,
      assignedOrders: [],
      totalHours: 0,
      fatiguedNextDay: Array.isArray(driver.pastWeekHours)
        ? driver.pastWeekHours[driver.pastWeekHours.length - 1] > 8
        : false,
    }));

    // Assign orders to drivers considering maxHoursPerDriver and fatigue penalty
    for (const order of orders) {
      const route = order.route;
      if (!route) continue;

      const baseTime = route.baseTime; // in minutes

      // Find a driver who can take this order without exceeding max hours
      const assignedDriver = availableDriversList
        .sort((a, b) => a.totalHours - b.totalHours)
        .find((workload) => {
          // Fatigued drivers deliver 30% slower → time increases
          const adjustedTime = workload.fatiguedNextDay ? baseTime / 0.7 : baseTime;
          const orderHours = adjustedTime / 60; // convert minutes to hours
          if (workload.totalHours + orderHours <= maxHoursPerDriver) {
            workload.assignedOrders.push({ order, deliveryTime: adjustedTime });
            workload.totalHours += orderHours;
            return true;
          }
          return false;
        });

      // If no driver can take this order, it remains unassigned
    }

    // Calculate KPIs
    let totalProfit = 0;
    let onTimeCount = 0;
    let totalDeliveries = 0;

    for (const workload of availableDriversList) {
      for (const { order, deliveryTime } of workload.assignedOrders) {
        totalDeliveries++;

        const route = order.route;
        if (!route) continue;

        const isLate = deliveryTime > route.baseTime + 10; // baseTime + 10 minutes late penalty threshold
        const penalty = isLate ? 50 : 0;
        const bonus = order.valueRs > 1000 && !isLate ? order.valueRs * 0.1 : 0;

        let fuelCost = 5 * route.distanceKm;
        if (route.traffic === "High") {
          fuelCost += 2 * route.distanceKm;
        }

        totalProfit += order.valueRs + bonus - penalty - fuelCost;

        if (!isLate) onTimeCount++;
      }
    }

    const efficiency = totalDeliveries > 0 ? (onTimeCount / totalDeliveries) * 100 : 0;

    // Persist simulation results
    const simulation = await prisma.simulation.create({
      data: {
        timestamp: new Date(),
        availableDrivers,
        routeStartTime,
        maxHoursPerDriver,
        totalProfit,
        efficiency,
      },
    });

    // Respond with simulation data and driver stats
    return res.json({
      simulation,
      driverStats: availableDriversList.map((w) => ({
        driverId: w.driver.id,
        assignedOrders: w.assignedOrders.length,
        totalHours: w.totalHours,
      })),
      totalDeliveries,
      onTimeDeliveries: onTimeCount,
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
