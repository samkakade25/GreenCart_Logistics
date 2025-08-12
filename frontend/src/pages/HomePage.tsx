import { Box, Button, Heading, Text, Card, CardBody } from "grommet";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    { title: "Run Simulations", desc: "Test driver allocations & route times." },
    { title: "Track KPIs", desc: "Profit, efficiency, delivery performance." },
    { title: "Manage Operations", desc: "Drivers, routes, and orders in one place." }
  ];

  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box direction="row" justify="between" pad="medium" background="white" className="shadow-sm">
        <Heading level={3} margin="none">GreenCart Logistics</Heading>
        <Box direction="row" gap="small">
          <Link to="/login"><Button label="Login" primary /></Link>
          <Link to="/register"><Button label="Register" /></Link>
        </Box>
      </Box>

      {/* Hero */}
      <Box align="center" pad="xlarge" className="text-center">
        <Heading level={1}>Optimize Your Logistics, Maximize Your Profit</Heading>
        <Text size="large" className="mt-4 max-w-xl">
          Run real-time delivery simulations, track KPIs, and make data-driven decisions.
        </Text>
        <Box direction="row" gap="medium" margin={{ top: "medium" }}>
          <Link to="/register"><Button label="Get Started" primary /></Link>
          <Link to="/login"><Button label="Login" /></Link>
        </Box>
      </Box>

      {/* Features */}
      <Box direction="row" wrap justify="center" gap="large" pad="large">
        {features.map((f, i) => (
          <Card key={i} className="w-72 shadow-md">
            <CardBody pad="medium">
              <Heading level={3} margin="none">{f.title}</Heading>
              <Text>{f.desc}</Text>
            </CardBody>
          </Card>
        ))}
      </Box>

      {/* Footer */}
      <Box align="center" pad="medium" background="white" className="shadow-inner">
        <Text>© 2025 GreenCart Logistics</Text>
      </Box>
    </Box>
  );
}
