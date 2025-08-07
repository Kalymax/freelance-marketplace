import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/context";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/" className="text-2xl font-bold text-indigo-600">
        FreelanceX
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-indigo-600 hover:underline">
              Dashboard
            </Link>
            <div className="relative group">
              <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full cursor-pointer">
                {user.username}
              </div>
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50">
                <div className="p-3">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
