import { useEffect, useState } from "react";
import { Box, Heading, Text, Spinner, Button, Menu } from "grommet";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface Simulation {
  id: number;
  timestamp: string;
  availableDrivers: number;
  routeStartTime: string;
  maxHoursPerDriver: number;
  totalProfit: number;
  efficiency: number;
}

export default function DashboardPage() {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const navigateSimulation = () => {
    navigate("/simulation");
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/simulation/latest`)
      .then((res) => res.json())
      .then((data) => {
        setSimulation(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch simulation data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box
        fill
        align="center"
        justify="center"
        background="light-1"
        height={{ min: "100vh" }}
      >
        <Spinner size="large" color="brand" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        fill
        align="center"
        justify="center"
        background="light-1"
        height={{ min: "100vh" }}
      >
        <Text color="status-critical" size="large" weight="bold">
          {error}
        </Text>
      </Box>
    );
  }

  if (!simulation) return null;

  // Data for charts
  const onTimeDeliveries = (simulation.efficiency / 100) * 100;
  const lateDeliveries = 100 - onTimeDeliveries;

  const deliveryData = {
    labels: ["On-Time Deliveries", "Late Deliveries"],
    datasets: [
      {
        label: "Deliveries",
        data: [onTimeDeliveries, lateDeliveries],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderRadius: 4,
      },
    ],
  };

  const fuelCostData = {
    labels: ["Base Fuel Cost", "Traffic Surcharge"],
    datasets: [
      {
        label: "Fuel Cost Breakdown",
        data: [70, 30],
        backgroundColor: ["#3b82f6", "#fbbf24"],
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Percentage (%)",
        },
        ticks: {
          stepSize: 20,
        },
      },
      x: {
        title: {
          display: true,
          text: "Categories",
        },
      },
    },
  };

  return (
    <Box
      pad={{ vertical: "large", horizontal: "medium" }}
      background="light-1"
      height={{ min: "100vh" }}
      overflow="auto"
    >
      {/* Header */}
      <Box
        direction="row-responsive"
        justify="between"
        align="center"
        margin={{ bottom: "large" }}
        pad={{ horizontal: "medium" }}
      >
        <Heading level={2} margin={{ vertical: "small" }} color="dark-1">
          Dashboard - Latest Simulation
        </Heading>
        <Box direction="row" gap="small">
        <Menu
            label="Management"
            items={[
              { label: "Drivers", onClick: () => navigate("/drivers") },
              { label: "Routes", onClick: () => navigate("/routes") },
              { label: "Orders", onClick: () => navigate("/orders") },
            ]}
            primary
          />
          <Button
            label="Run Simulation"
            onClick={navigateSimulation}
            primary
            size="medium"
            color="brand"
            hoverIndicator
          />
          <Button
            label="Logout"
            onClick={handleLogout}
            secondary
            size="medium"
            color="neutral-3"
            hoverIndicator
          />
        </Box>
      </Box>

      {/* KPI Cards */}
      <Box
        direction="row-responsive"
        gap="medium"
        wrap
        margin={{ bottom: "large" }}
        pad={{ horizontal: "medium" }}
      >
        {[
          {
            label: "Total Profit",
            value: `₹ ${simulation.totalProfit.toFixed(2)}`,
          },
          {
            label: "Efficiency Score",
            value: `${simulation.efficiency.toFixed(2)}%`,
          },
          {
            label: "Available Drivers",
            value: simulation.availableDrivers,
          },
        ].map((item, index) => (
          <Box
            key={index}
            background="white"
            pad="medium"
            round="medium"
            elevation="small"
            flex={{ grow: 1, shrink: 1 }}
            width={{ min: "250px", max: "33.33%" }}
            margin={{ bottom: "small" }}
          >
            <Text size="small" color="dark-3" weight="bold">
              {item.label}
            </Text>
            <Heading
              level={3}
              margin={{ top: "xsmall", bottom: "none" }}
              color="dark-1"
            >
              {item.value}
            </Heading>
          </Box>
        ))}
      </Box>

      {/* Charts */}
      <Box
        direction="row-responsive"
        gap="medium"
        wrap
        margin={{ bottom: "large" }}
        pad={{ horizontal: "medium" }}
      >
        <Box
          background="white"
          pad="medium"
          round="medium"
          elevation="small"
          flex={{ grow: 1, shrink: 1 }}
          width={{ min: "300px", max: "50%" }}
          height={{ height: "400px" }} // Fixed height for chart container
          overflow="hidden"
        >
          <Heading
            level={4}
            margin={{ top: "none", bottom: "medium" }}
            color="dark-1"
          >
            On-Time vs Late Deliveries
          </Heading>
          <Box height="100%" width="100%">
            <Bar data={deliveryData} options={chartOptions} />
          </Box>
        </Box>

        <Box
          background="white"
          pad="medium"
          round="medium"
          elevation="small"
          flex={{ grow: 1, shrink: 1 }}
          width={{ min: "300px", max: "50%" }}
          height={{ height: "400px" }} // Fixed height for chart container
          overflow="hidden"
        >
          <Heading
            level={4}
            margin={{ top: "none", bottom: "medium" }}
            color="dark-1"
          >
            Fuel Cost Breakdown
          </Heading>
          <Box height="100%" width="100%">
            <Bar data={fuelCostData} options={chartOptions} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}