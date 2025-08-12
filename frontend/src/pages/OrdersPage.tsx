import  { useEffect, useState } from "react";
import axios from "axios";

interface Route {
  id: number;
  routeId: string;
  distanceKm: number;
  traffic: string;
  baseTime: number;
}

interface Order {
  id: number;
  orderId: string;
  valueRs: number;
  routeId: number;
  deliveryTimestamp: string;
  route?: Route;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [newOrder, setNewOrder] = useState<Partial<Order>>({});
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const API_URL = "https://greencart-logistics-1plr.onrender.com/api/orders";

  const fetchOrders = async () => {
    try {
      const res = await axios.get<Order[]>(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreate = async () => {
    try {
      await axios.post(API_URL, newOrder);
      setNewOrder({});
      fetchOrders();
    } catch (err) {
      console.error("Error creating order:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingOrder) return;
    try {
      await axios.put(`${API_URL}/${editingOrder.id}`, editingOrder);
      setEditingOrder(null);
      fetchOrders();
    } catch (err) {
      console.error("Error updating order:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders Management</h1>

      {/* Create Form */}
      <div className="mb-6 border p-4 rounded">
        <h2 className="font-semibold mb-2">Add New Order</h2>
        <input
          type="text"
          placeholder="Order ID"
          className="border p-2 mr-2"
          value={newOrder.orderId || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, orderId: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Value (Rs)"
          className="border p-2 mr-2"
          value={newOrder.valueRs || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, valueRs: Number(e.target.value) })
          }
        />
        <input
          type="number"
          placeholder="Route ID"
          className="border p-2 mr-2"
          value={newOrder.routeId || ""}
          onChange={(e) =>
            setNewOrder({ ...newOrder, routeId: Number(e.target.value) })
          }
        />
        <input
          type="datetime-local"
          className="border p-2 mr-2"
          value={
            newOrder.deliveryTimestamp
              ? newOrder.deliveryTimestamp.slice(0, 16)
              : ""
          }
          onChange={(e) =>
            setNewOrder({ ...newOrder, deliveryTimestamp: e.target.value })
          }
        />
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* Orders Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Value (Rs)</th>
            <th className="border p-2">Route ID</th>
            <th className="border p-2">Delivery Time</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) =>
            editingOrder?.id === order.id ? (
              <tr key={order.id}>
                <td className="border p-2">
                  <input
                    type="text"
                    value={editingOrder.orderId}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        orderId: e.target.value,
                      })
                    }
                    className="border p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={editingOrder.valueRs}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        valueRs: Number(e.target.value),
                      })
                    }
                    className="border p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={editingOrder.routeId}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        routeId: Number(e.target.value),
                      })
                    }
                    className="border p-1"
                  />
                </td>
                <td className="border p-2">
                  <input
                    type="datetime-local"
                    value={editingOrder.deliveryTimestamp.slice(0, 16)}
                    onChange={(e) =>
                      setEditingOrder({
                        ...editingOrder,
                        deliveryTimestamp: e.target.value,
                      })
                    }
                    className="border p-1"
                  />
                </td>
                <td className="border p-2">
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingOrder(null)}
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={order.id}>
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.valueRs}</td>
                <td className="border p-2">{order.routeId}</td>
                <td className="border p-2">
                  {new Date(order.deliveryTimestamp).toLocaleString()}
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => setEditingOrder(order)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
