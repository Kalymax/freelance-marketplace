import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GigDetail = () => {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`import.meta.env.VITE_API_URL/api/gigs/${id}`)
      .then(res => setGig(res.data))
      .catch(err => {
        console.error(err);
        setError("Gig not found or failed to load.");
      });

    axios.get(`import.meta.env.VITE_API_URL/api/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error("Review fetch error", err));
  }, [id]);
  
  const startChat = async () => {
  if (!token) return alert("Login required");

  try {
    const res = await axios.post(
      "import.meta.env.VITE_API_URL/api/chat/send",
      {
        recipientId: gig.user, // gig owner
        text: "Hi! I'm interested in your gig.",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    navigate(`/chat/${res.data.chatId}`); // Redirect to chat page
    } catch (err) {
      console.error("Failed to start chat", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) return alert("Login required");

    try {
      await axios.post("import.meta.env.VITE_API_URL/api/reviews", {
        gig: id,
        rating: newReview.rating,
        comment: newReview.comment,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNewReview({ rating: 0, comment: "" });

      // Reload reviews
      const res = await axios.get(`import.meta.env.VITE_API_URL/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Submit review failed", err);
    }
  };

  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;
  if (!gig) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white mt-10 shadow rounded-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={gig.images?.[0] || "https://via.placeholder.com/500x300"}
          alt={gig.title}
          className="w-full md:w-1/2 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{gig.title}</h1>
          <p className="text-gray-600 mb-4">{gig.description}</p>
          <div className="text-sm text-gray-500 mb-2">Category: {gig.category}</div>
          <div className="text-lg font-semibold text-green-600 mb-6">${gig.price}</div>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
            Purchase
          </button>
          <button
              onClick={startChat}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
            >
              Message
            </button>
        </div>
      </div>

      <hr className="my-8" />
      <h3 className="text-xl font-bold mb-3">⭐ Reviews</h3>

      {/* Review Form */}
      <form onSubmit={submitReview} className="mb-6 space-y-3">
        <label className="block">
          <span className="block mb-1 font-medium">Rating (1–5)</span>
          <input
            type="number"
            min="1"
            max="5"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
            className="p-2 border rounded w-24"
            required
          />
        </label>
        <textarea
          placeholder="Write a review..."
          value={newReview.comment}
          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          className="w-full p-2 border rounded"
          rows="3"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Submit Review
        </button>
      </form>

      {/* Show existing reviews */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review, i) => (
            <div key={i} className="bg-gray-100 p-4 rounded">
              <p className="text-yellow-600 font-bold">Rating: {review.rating} ⭐</p>
              <p className="text-sm italic text-gray-600">By {review.user?.username}</p>
              <p>{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GigDetail;
