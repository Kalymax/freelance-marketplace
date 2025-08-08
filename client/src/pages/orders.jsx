import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/context";

const Orders = () => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("import.meta.env.VITE_API_URL/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        `import.meta.env.VITE_API_URL/api/orders/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === id ? res.data : order))
      );
    } catch (err) {
      console.error("Failed to update order status", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-6">📦 Your Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold">{order.gig?.title}</h2>
                <p className="text-sm text-gray-600">
                  Buyer: {order.buyer?.username} | Freelancer:{" "}
                  {order.freelancer?.username}
                </p>
                <p className="text-sm">Status: {order.status}</p>
              </div>

              {/* Allow freelancer to mark complete */}
              {user?.id === order.freelancer?._id && order.status !== "completed" && (
                <button
                  onClick={() => updateStatus(order._id, "completed")}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Mark Complete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
