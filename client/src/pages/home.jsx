import React, { useEffect, useState , useContext} from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../context/context";


const Home = () => {
  const { user } = useContext(UserContext);
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [userOrders, setUserOrders] = useState([]);

  const categories = [
    "Graphics & Design",
    "Programming & Tech",
    "Writing & Translation",
    "Music & Audio",
    "Digital Marketing"
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/api/gigs")
      .then(res => {
        setGigs(res.data);
        setFilteredGigs(res.data);
      })
      .catch(err => console.error("Error fetching gigs:", err));
  }, []);

  // 🔍 Search & Filter Function
  useEffect(() => {
    const filtered = gigs.filter(gig => {
      const matchesSearch =
        gig.title.toLowerCase().includes(search.toLowerCase()) ||
        gig.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "" || gig.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
    setFilteredGigs(filtered);
  }, [search, activeCategory, gigs]);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    if (token && userId) {
      axios.get(`http://localhost:5000/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setUserOrders(res.data))
      .catch(err => console.error("Error fetching user orders", err));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white py-16 text-center shadow">
        <h1 className="text-4xl font-bold mb-4">Find the perfect freelance service</h1>
        <input
          type="text"
          placeholder="e.g. logo design"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-3/4 sm:w-1/2 p-3 border border-gray-300 rounded-md"
        />
      </div>

      {user && (
        <div className="text-center bg-indigo-50 py-4 my-6 mx-4 rounded-md shadow">
          <p className="text-lg font-semibold text-indigo-800">
            You’ve taken <span className="text-indigo-600">{userOrders.length}</span> gigs so far 🎯
          </p>
        </div>
      )}

      <section className="px-10 mt-10">
        <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            className={`px-4 py-2 rounded-full ${activeCategory === "" ? "bg-indigo-600 text-white" : "bg-white border"}`}
            onClick={() => setActiveCategory("")}
          >
            All
          </button>
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-full ${activeCategory === cat ? "bg-indigo-600 text-white" : "bg-white border"}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="px-10 mt-10">
        <h2 className="text-xl font-semibold mb-4">Available Gigs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGigs.length === 0 ? (
            <p>No gigs found.</p>
          ) : (
            filteredGigs.map((gig) => (
              <Link to={`/gigs/${gig._id}`} key={gig._id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                  <img
                    src={gig.images?.[0] || "https://via.placeholder.com/400x200"}
                    alt={gig.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold">{gig.title}</h3>
                    <p className="text-sm text-gray-500">{gig.category}</p>
                    <p className="text-green-600 font-semibold mt-2">${gig.price}</p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
