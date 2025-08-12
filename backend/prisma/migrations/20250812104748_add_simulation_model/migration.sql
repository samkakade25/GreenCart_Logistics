-- CreateTable
CREATE TABLE "public"."Simulation" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "availableDrivers" INTEGER NOT NULL,
    "routeStartTime" TEXT NOT NULL,
    "maxHoursPerDriver" INTEGER NOT NULL,
    "totalProfit" DOUBLE PRECISION NOT NULL,
    "efficiency" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Simulation_pkey" PRIMARY KEY ("id")
);
