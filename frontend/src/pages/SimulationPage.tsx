import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import {
  Box,
  Heading,
  Text,
  Button,
  TextInput,
  Spinner,
  Form,
  FormField,
} from "grommet";

interface SimulationResult {
  simulation: {
    totalProfit: number;
    efficiency: number;
  };
  totalDeliveries: number;
  onTimeDeliveries: number;
}

export default function SimulationPage() {
  const [availableDrivers, setAvailableDrivers] = useState(3);
  const [routeStartTime, setRouteStartTime] = useState("08:00");
  const [maxHoursPerDriver, setMaxHoursPerDriver] = useState(8);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/simulation/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          availableDrivers,
          routeStartTime,
          maxHoursPerDriver,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
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
          Run Simulation
        </Heading>
        <Button
          label="Back to Dashboard"
          onClick={() => navigate("/dashboard")}
          secondary
          size="medium"
          color="neutral-3"
          icon={<svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              d="M15 18l-6-6 6-6"
            />
          </svg>}
          reverse
          hoverIndicator
        />
      </Box>

      {/* Form */}
      <Box
        background="white"
        pad="medium"
        round="medium"
        elevation="small"
        margin={{ bottom: "large", horizontal: "medium" }}
        width={{ max: "600px" }}
      >
        <Form onSubmit={runSimulation}>
          <FormField
            label="Available Drivers"
            htmlFor="availableDrivers"
            margin={{ bottom: "medium" }}
          >
            <TextInput
              id="availableDrivers"
              type="number"
              value={availableDrivers}
              onChange={(e) => setAvailableDrivers(Number(e.target.value))}
              min={1}
              step={1}
              placeholder="Enter number of drivers"
            />
          </FormField>
          <FormField
            label="Route Start Time"
            htmlFor="routeStartTime"
            margin={{ bottom: "medium" }}
          >
            <TextInput
              id="routeStartTime"
              type="time"
              value={routeStartTime}
              onChange={(e) => setRouteStartTime(e.target.value)}
              placeholder="Select start time"
            />
          </FormField>
          <FormField
            label="Max Hours per Driver"
            htmlFor="maxHoursPerDriver"
            margin={{ bottom: "medium" }}
          >
            <TextInput
              id="maxHoursPerDriver"
              type="number"
              value={maxHoursPerDriver}
              onChange={(e) => setMaxHoursPerDriver(Number(e.target.value))}
              min={1}
              step={1}
              placeholder="Enter max hours"
            />
          </FormField>
          <Box direction="row" justify="end" margin={{ top: "medium" }}>
            <Button
              type="submit"
              label={loading ? "Running..." : "Run Simulation"}
              primary
              size="medium"
              color="brand"
              disabled={loading}
              icon={loading ? <Spinner size="xsmall" /> : undefined}
              hoverIndicator
            />
          </Box>
        </Form>
      </Box>

      {/* Results */}
      {result && (
        <Box
          background="white"
          pad="medium"
          round="medium"
          elevation="small"
          margin={{ horizontal: "medium" }}
          width={{ max: "600px" }}
        >
          <Heading level={3} margin={{ top: "none", bottom: "medium" }} color="dark-1">
            Simulation Results
          </Heading>
          <Box gap="small">
            <Text size="medium" color="dark-2">
              <strong>Total Profit:</strong> ₹ {result.simulation.totalProfit.toFixed(2)}
            </Text>
            <Text size="medium" color="dark-2">
              <strong>Efficiency:</strong> {result.simulation.efficiency}%
            </Text>
            <Text size="medium" color="dark-2">
              <strong>Total Deliveries:</strong> {result.totalDeliveries}
            </Text>
            <Text size="medium" color="dark-2">
              <strong>On-time Deliveries:</strong> {result.onTimeDeliveries}
            </Text>
            <Text size="medium" color="dark-2">
              <strong>Late Deliveries:</strong>{" "}
              {result.totalDeliveries - result.onTimeDeliveries}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}