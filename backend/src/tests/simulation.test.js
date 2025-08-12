import request from "supertest";
import express from "express";
import simulationRoutes from "../routes/simulationRoutes.js";

// Create an express app for testing
const app = express();
app.use(express.json());
app.use("/api/simulation", simulationRoutes);

describe("POST /api/simulation/simulate", () => {
  it("should return 400 if inputs are missing or invalid", async () => {
    const res = await request(app).post("/api/simulation/simulate").send({
      availableDrivers: -1,
      routeStartTime: "25:61",
      maxHoursPerDriver: 0,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("should return 400 if availableDrivers exceed total drivers", async () => {
    // Mock or seed your prisma.driver.findMany() to return fewer drivers
    // For this test, let's assume no drivers exist
    // You'd mock prisma or replace with a test db

    // In actual test environment, you should mock Prisma client to return empty array for drivers
  });

  it("should return simulation results with KPIs", async () => {
    // For integration test, use a test database seeded with sample data

    const validInput = {
      availableDrivers: 3,
      routeStartTime: "08:00",
      maxHoursPerDriver: 8,
    };

    const res = await request(app).post("/api/simulation/simulate").send(validInput);

    expect(res.statusCode).toBe(200);
    expect(res.body.simulation).toBeDefined();
    expect(typeof res.body.simulation.totalProfit).toBe("number");
    expect(typeof res.body.simulation.efficiency).toBe("number");
    expect(Array.isArray(res.body.driverStats)).toBe(true);
  });
});
