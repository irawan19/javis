import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let hexagons = [];
    let time = 0;
    let mouse = { x: undefined, y: undefined };

    const HEX_RADIUS = 40;
    const HEX_GAP = 5;
    const PULSE_SPEED = 0.002;
    const MOUSE_RADIUS = 250;
    const HEX_BASE_COLOR_RGB = "134, 239, 172";

    const drawHexagon = (x, y, radius, color, lineWidth) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const createHexGrid = () => {
      hexagons = [];
      const hexWidth = Math.sqrt(3) * HEX_RADIUS;
      const hexHeight = 2 * HEX_RADIUS;
      const horizSpacing = hexWidth + HEX_GAP;
      const vertSpacing = hexHeight * 0.75 + HEX_GAP;
      const cols = Math.ceil(canvas.width / horizSpacing) + 1;
      const rows = Math.ceil(canvas.height / vertSpacing) + 1;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * horizSpacing + (row % 2 !== 0 ? horizSpacing / 2 : 0);
          const y = row * vertSpacing;
          hexagons.push({
            x,
            y,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    };

    const animate = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#e0f2fe"); // biru muda
      gradient.addColorStop(1, "#dcfce7"); // hijau muda
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time++;

      hexagons.forEach((hex) => {
        const distToMouse =
          mouse.x !== undefined && mouse.y !== undefined
            ? Math.sqrt((hex.x - mouse.x) ** 2 + (hex.y - mouse.y) ** 2)
            : Infinity;

        const mouseEffect = Math.max(0, 1 - distToMouse / MOUSE_RADIUS);
        const basePulse = (Math.sin(time * PULSE_SPEED + hex.pulseOffset) + 1) / 2;
        const finalIntensity = Math.min(1, basePulse * 0.5 + mouseEffect * 0.8);

        const alpha = 0.1 + finalIntensity * 0.6;
        const lineWidth = 0.5 + finalIntensity * 1.5;
        const color = `rgba(${HEX_BASE_COLOR_RGB}, ${alpha})`;
        drawHexagon(hex.x, hex.y, HEX_RADIUS, color, lineWidth);
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/login",
        { identifier, password },
        { withCredentials: true }
      );
      if (res.data.message?.toLowerCase().includes("berhasil")) {
        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setError(res.data.message || "Login gagal");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full -z-10"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/90 backdrop-blur-md shadow-2xl border border-emerald-200 rounded-2xl p-8 w-full max-w-sm flex flex-col space-y-4 transition-transform hover:scale-[1.02] duration-300"
      >
        <h1 className="text-3xl font-bold text-center text-emerald-700">
          Login
        </h1>
        <p className="text-center text-sm text-gray-500 mb-2">
          Masuk ke sistem internal
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-700">Email / Username</label>
          <input
            type="text"
            placeholder="admin"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="border border-emerald-200 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-emerald-400 bg-white/70"
            required
          />
        </div>

        <div className="relative">
          <label className="text-sm text-gray-700">Password</label>
          <input
            type={showPass ? "text" : "password"}
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-emerald-200 p-2 rounded w-full mt-1 focus:ring-2 focus:ring-emerald-400 bg-white/70"
            required
          />
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-2 top-[35px] text-sm text-emerald-600 hover:underline"
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`${
            loading
              ? "bg-emerald-400 cursor-not-allowed"
              : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
          } text-white py-2 rounded-lg font-semibold shadow-md transition duration-300`}
        >
          {loading ? "Memproses..." : "Login"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          © {new Date().getFullYear()} PT. Javis Teknologi Albarokah
        </p>
      </form>
    </div>
  );
}
