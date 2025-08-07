import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGig = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    deliveryTime: "",
    category: "",
    image: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🛡️ Basic validation
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.deliveryTime ||
      !form.category
    ) {
      return setError("All fields are required.");
    }

    const token = localStorage.getItem("token"); // make sure you're storing token here
    if (!token) return setError("You must be logged in to create a gig.");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/gigs",
        {
          ...form,
          price: Number(form.price),
          deliveryTime: Number(form.deliveryTime),
          images: [form.image],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/gigs/${response.data._id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create gig.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create a New Gig</h2>

      {error && <p className="text-red-600 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Gig Title"
          className="w-full p-3 border rounded"
          value={form.title}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Gig Description"
          rows="4"
          className="w-full p-3 border rounded"
          value={form.description}
          onChange={handleChange}
        ></textarea>
        <input
          type="number"
          name="price"
          placeholder="Price ($)"
          className="w-full p-3 border rounded"
          value={form.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="deliveryTime"
          placeholder="Delivery Time (days)"
          className="w-full p-3 border rounded"
          value={form.deliveryTime}
          onChange={handleChange}
        />
        <select
          name="category"
          className="w-full p-3 border rounded"
          value={form.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Graphics & Design">Graphics & Design</option>
          <option value="Programming & Tech">Programming & Tech</option>
          <option value="Writing & Translation">Writing & Translation</option>
          <option value="Music & Audio">Music & Audio</option>
          <option value="Digital Marketing">Digital Marketing</option>
        </select>
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          className="w-full p-3 border rounded"
          value={form.image}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
        >
          Create Gig
        </button>
      </form>
    </div>
  );
};

export default CreateGig;
