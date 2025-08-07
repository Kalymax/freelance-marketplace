import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/context";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [myGigs, setMyGigs] = useState([]);
  const [myOrders, setMyOrders] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user) return;

    axios.get(`http://localhost:5000/api/gigs/user/${user._id}`)
      .then(res => setMyGigs(res.data))
      .catch(err => console.error("Failed to fetch gigs", err));

    axios.get(`http://localhost:5000/api/orders/user/${user._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMyOrders(res.data))
      .catch(err => console.error("Failed to fetch orders", err));
  }, [user]);

  if (!user) return <p className="text-center mt-10">Loading user info...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}</h1>
      <p className="text-gray-600 mb-8">Email: {user.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 📦 Gigs Created */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Created Gigs</h2>
          {myGigs.length === 0 ? (
            <p className="text-gray-500">You haven’t created any gigs yet.</p>
          ) : (
            <ul className="space-y-2">
              {myGigs.map((gig) => (
                <li key={gig._id} className="p-3 border rounded hover:bg-gray-50">
                  <Link to={`/gigs/${gig._id}`} className="font-semibold text-indigo-600">
                    {gig.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 📥 Orders Placed */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Your Purchased Gigs</h2>
          {myOrders.length === 0 ? (
            <p className="text-gray-500">You haven’t purchased any gigs yet.</p>
          ) : (
            <ul className="space-y-2">
              {myOrders.map((order) => (
                <li key={order._id} className="p-3 border rounded hover:bg-gray-50">
                  <p className="font-semibold text-green-700">{order.gig?.title}</p>
                  <p className="text-sm text-gray-600">From: {order.freelancer?.username}</p>
                  <Link
                    to={`/chat/${order.freelancer?._id}`}
                    className="text-sm text-indigo-600 underline"
                  >
                    Message Freelancer
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
