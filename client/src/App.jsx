import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import GigDetail from "./pages/gigdetail";
import CreateGig from "./pages/creategig";
import Orders from "./pages/orders";
import Chat from "./pages/chat";
import ChatWrapper from "./pages/chatwrapper";
import Navbar from "./components/navbar";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/gigs/:id" element={<GigDetail />} />

      <Route path="/create-gig" element={<CreateGig />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/chat" element={<ChatWrapper />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </>
  );
}

export default App;
