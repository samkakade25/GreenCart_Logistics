import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DataTable,
  Layer,
  Form,
  FormField,
  TextInput,
  Heading,
  Text,
  Select,
} from "grommet";
import { Add, Edit, Trash } from "grommet-icons";

interface Route {
  id: number;
  routeId: string;
  distanceKm: number;
  traffic: string;
  baseTime: number;
}

const API_URL = "https://greencart-logistics-1plr.onrender.com/api/routes";

const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);

  const fetchRoutes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRoutes(data);
    } catch (err) {
      console.error("Error fetching routes:", err);
    } finally {
    }
  };

  const createRoute = async (route: Partial<Route>) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route),
    });
    fetchRoutes();
  };

  const updateRoute = async (id: number, route: Partial<Route>) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(route),
    });
    fetchRoutes();
  };

  const deleteRoute = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchRoutes();
  };

  const handleSubmit = (values: any) => {
    if (editingRoute) {
      updateRoute(editingRoute.id, values);
    } else {
      createRoute(values);
    }
    setShowForm(false);
    setEditingRoute(null);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  return (
    <Box pad="medium" className="bg-gray-50 min-h-screen">
      <Box direction="row" justify="between" align="center" margin={{ bottom: "medium" }}>
        <Heading level={2} margin="none">Routes</Heading>
        <Button
          icon={<Add />}
          label="Add Route"
          primary
          onClick={() => {
            setEditingRoute(null);
            setShowForm(true);
          }}
        />
      </Box>

      <DataTable
        columns={[
          { property: "id", header: <Text>ID</Text>, primary: true },
          { property: "routeId", header: <Text>Route ID</Text> },
          { property: "distanceKm", header: <Text>Distance (km)</Text> },
          { property: "traffic", header: <Text>Traffic</Text> },
          { property: "baseTime", header: <Text>Base Time (min)</Text> },
          {
            property: "actions",
            header: <Text>Actions</Text>,
            render: (r) => (
              <Box direction="row" gap="small">
                <Button
                  icon={<Edit />}
                  onClick={() => {
                    setEditingRoute(r);
                    setShowForm(true);
                  }}
                />
                <Button
                  icon={<Trash />}
                  onClick={() => deleteRoute(r.id)}
                  color="status-critical"
                />
              </Box>
            ),
          },
        ]}
        data={routes}
        sortable
      />

      {showForm && (
        <Layer
          onEsc={() => setShowForm(false)}
          onClickOutside={() => setShowForm(false)}
          position="center"
          modal
        >
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} margin="none">
              {editingRoute ? "Edit Route" : "Add Route"}
            </Heading>
            <Form
              onSubmit={({ value }) => handleSubmit(value)}
              value={
                editingRoute || {
                  routeId: "",
                  distanceKm: 0,
                  traffic: "Low",
                  baseTime: 0,
                }
              }
            >
              <FormField name="routeId" label="Route ID" required>
                <TextInput name="routeId" />
              </FormField>
              <FormField name="distanceKm" label="Distance (km)" required>
                <TextInput name="distanceKm" type="number" />
              </FormField>
              <FormField name="traffic" label="Traffic" required>
                <Select
                  name="traffic"
                  options={["Low", "Medium", "High"]}
                />
              </FormField>
              <FormField name="baseTime" label="Base Time (minutes)" required>
                <TextInput name="baseTime" type="number" />
              </FormField>
              <Box direction="row" justify="between" margin={{ top: "medium" }}>
                <Button label="Cancel" onClick={() => setShowForm(false)} />
                <Button type="submit" label="Save" primary />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </Box>
  );
};

export default RoutesPage;
