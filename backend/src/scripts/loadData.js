import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function loadCSV(filePath, handler) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        try {
          await handler(rows);
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  });
}

async function main() {
  const dataDir = path.join(process.cwd(), "data");

  // Load Drivers
  await loadCSV(path.join(dataDir, "drivers.csv"), async (rows) => {
    for (const row of rows) {
      console.log("Processing driver row:", row);

      if (!row.name || !row.shift_hours || !row.past_week_hours) {
        console.warn(`⚠ Skipping invalid driver row: ${JSON.stringify(row)}`);
        continue;
      }

      await prisma.driver.create({
        data: {
          name: row.name.trim(),
          currentHours: parseFloat(row.shift_hours),
          pastWeekHours: row.past_week_hours
            .split("|")
            .map((h) => Number(h.trim()))
            .filter((n) => !isNaN(n)),
        },
      });
    }
    console.log("Drivers loaded");
  });

  // Load Routes
  await loadCSV(path.join(dataDir, "routes.csv"), async (rows) => {
    for (const row of rows) {
      console.log("Processing route row:", row);

      if (!row.route_id || !row.distance_km || !row.traffic_level || !row.base_time_min) {
        console.warn(`⚠ Skipping invalid route row: ${JSON.stringify(row)}`);
        continue;
      }

      await prisma.route.create({
        data: {
          routeId: String(row.route_id).trim(),
          distanceKm: parseFloat(row.distance_km),
          traffic: row.traffic_level.trim(),
          baseTime: parseInt(row.base_time_min),
        },
      });
    }
    console.log("Routes loaded");
  });

  // Load Orders
  await loadCSV(path.join(dataDir, "orders.csv"), async (rows) => {
    for (const row of rows) {
      console.log("Processing order row:", row);

      if (!row.order_id || !row.value_rs || !row.route_id || !row.delivery_time) {
        console.warn(`⚠ Skipping invalid order row: ${JSON.stringify(row)}`);
        continue;
      }

      const route = await prisma.route.findFirst({
        where: { routeId: String(row.route_id).trim() },
      });

      if (!route) {
        console.warn(`⚠ Route ${row.route_id} not found for order ${row.order_id}`);
        continue;
      }

      await prisma.order.create({
        data: {
          orderId: String(row.order_id).trim(),
          valueRs: parseFloat(row.value_rs),
          routeId: route.id,
          // Here we only have HH:MM — storing as today's date + time
          deliveryTimestamp: new Date(
            `${new Date().toISOString().split("T")[0]}T${row.delivery_time}:00Z`
          ),
        },
      });
    }
    console.log("Orders loaded");
  });

  console.log("All CSV data loaded successfully!");
}

main()
  .catch((err) => {
    console.error("Error loading CSV:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
