import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [data, setData] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/protected", { withCredentials: true })
      .then((res) => setData(res.data.message))
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = async () => {
    await axios.post(
      "http://localhost:4000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    navigate("/");
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden bg-gray-900">
      {/* Background hexagonal animated pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#1e293b_1px,_transparent_1px)] bg-[length:40px_40px] before:absolute before:inset-0 before:bg-gradient-to-b before:from-emerald-500/10 before:to-emerald-900/40 animate-[pulse_10s_infinite_alternate]" />

      {/* Efek hover berkilau */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),_#10b981_0%,_transparent_70%)]" />
      </div>

      {/* Card Dashboard */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full max-w-sm text-center border border-emerald-100">
        <h1 className="text-2xl font-bold text-emerald-700 mb-2">
          PT. Javis Teknologi Albarokah
        </h1>
        <p className="text-sm text-gray-500 mb-6">Sistem internal dashboard</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 border">
          <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
          <p className="mt-2 text-gray-600">
            {data || "Selamat datang di sistem internal"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition duration-300"
        >
          Logout
        </button>

        <p className="text-xs text-gray-500 mt-4">
          © {new Date().getFullYear()} PT. Javis Teknologi Albarokah
        </p>
      </div>
    </div>
  );
}
