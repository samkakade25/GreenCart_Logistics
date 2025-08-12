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
  Chart,
} from "grommet";
import { Add, Edit, Trash } from "grommet-icons";

interface Driver {
  id: number;
  name: string;
  currentHours: number;
  pastWeekHours: number[];
  createdAt: string;
}

const API_URL = "https://greencart-logistics-1plr.onrender.com/api/drivers";

const DriverPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const fetchDrivers = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setDrivers(data);
    } catch (err) {
      console.error("Error fetching drivers:", err);
    } finally {
    }
  };

  const createDriver = async (driver: Partial<Driver>) => {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
    fetchDrivers();
  };

  const updateDriver = async (id: number, driver: Partial<Driver>) => {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(driver),
    });
    fetchDrivers();
  };

  const deleteDriver = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchDrivers();
  };

  const handleSubmit = (values: any) => {
    if (editingDriver) {
      updateDriver(editingDriver.id, values);
    } else {
      createDriver(values);
    }
    setShowForm(false);
    setEditingDriver(null);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <Box pad="medium" className="bg-gray-50 min-h-screen">
      <Box direction="row" justify="between" align="center" margin={{ bottom: "medium" }}>
        <Heading level={2} margin="none">Drivers</Heading>
        <Button
          icon={<Add />}
          label="Add Driver"
          primary
          onClick={() => {
            setEditingDriver(null);
            setShowForm(true);
          }}
        />
      </Box>

      <DataTable
        columns={[
          { property: "id", header: <Text>ID</Text>, primary: true },
          { property: "name", header: <Text>Name</Text> },
          { property: "currentHours", header: <Text>Current Hours</Text> },
          {
            property: "pastWeekHours",
            header: <Text>Past Week Hours</Text>,
            render: (d) => (
              <Chart
                type="bar"
                values={d.pastWeekHours.map((val, i) => ({ value: [i, val] }))}
                bounds={[[0, 6], [0, Math.max(...d.pastWeekHours) + 2]]}
                size={{ width: "small", height: "xxsmall" }}
                thickness="xsmall"
                color="brand"
              />
            ),
          },
          {
            property: "createdAt",
            header: <Text>Created At</Text>,
            render: (d) => new Date(d.createdAt).toLocaleString(),
          },
          {
            property: "actions",
            header: <Text>Actions</Text>,
            render: (d) => (
              <Box direction="row" gap="small">
                <Button
                  icon={<Edit />}
                  onClick={() => {
                    setEditingDriver(d);
                    setShowForm(true);
                  }}
                />
                <Button
                  icon={<Trash />}
                  onClick={() => deleteDriver(d.id)}
                  color="status-critical"
                />
              </Box>
            ),
          },
        ]}
        data={drivers}
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
              {editingDriver ? "Edit Driver" : "Add Driver"}
            </Heading>
            <Form
              onSubmit={({ value }) => handleSubmit(value)}
              value={editingDriver || { name: "", currentHours: 0, pastWeekHours: [] }}
            >
              <FormField name="name" label="Name" required>
                <TextInput name="name" />
              </FormField>
              <FormField name="currentHours" label="Current Hours" required>
                <TextInput name="currentHours" type="number" />
              </FormField>
              <FormField name="pastWeekHours" label="Past Week Hours (comma separated)">
                <TextInput
                  name="pastWeekHours"
                  placeholder="e.g. 6,8,7,7,7,6,10"
                  onChange={(e) => {
                    const value = e.target.value
                      .split(",")
                      .map((num) => parseInt(num.trim()) || 0);
                    setEditingDriver((prev) => prev ? { ...prev, pastWeekHours: value } : null);
                  }}
                />
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

export default DriverPage;
