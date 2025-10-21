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

  useEffect(() => {
    const canvas = document.getElementById("hex-canvas");
    const ctx = canvas.getContext("2d");
    let hexagons = [];
    let time = 0;
    let mouse = { x: undefined, y: undefined };

    const HEX_RADIUS = 40;
    const HEX_GAP = 5;
    const PULSE_SPEED = 0.002;
    const MOUSE_RADIUS = 250;
    const HEX_BASE_COLOR_RGB = "16, 185, 129";

    function drawHexagon(x, y, radius, color, lineWidth) {
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
    }

    function createHexGrid() {
      hexagons = [];
      const hexWidth = Math.sqrt(3) * HEX_RADIUS;
      const hexHeight = 2 * HEX_RADIUS;
      const horizSpacing = hexWidth + HEX_GAP;
      const vertSpacing = hexHeight * 0.75 + HEX_GAP;
      const cols = Math.ceil(canvas.width / horizSpacing) + 1;
      const rows = Math.ceil(canvas.height / vertSpacing) + 1;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x =
            col * horizSpacing + (row % 2 !== 0 ? horizSpacing / 2 : 0);
          const y = row * vertSpacing;
          hexagons.push({
            x,
            y,
            pulseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function animate() {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#f0fdf4");
      gradient.addColorStop(1, "#dcfce7");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time++;

      hexagons.forEach((hex) => {
        const distToMouse =
          mouse.x && mouse.y
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

      requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      createHexGrid();
    }

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener("mouseleave", () => {
      mouse.x = undefined;
      mouse.y = undefined;
    });
    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", () => {});
      window.removeEventListener("mouseleave", () => {});
    };
  }, []);

  return (
    <div className="relative flex h-screen overflow-hidden font-sans text-gray-700">
      <canvas id="hex-canvas" className="absolute inset-0 w-full h-full -z-10" />

      <aside className="relative z-10 w-64 bg-white/80 backdrop-blur-md border-r border-emerald-200 shadow-sm flex flex-col p-6">
        <div className="mb-10 text-center">
          <h1 className="text-lg font-bold text-emerald-700">
            PT. Javis Teknologi
            <br />
            <span className="text-emerald-600">Albarokah</span>
          </h1>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow hover:bg-emerald-700 transition">
                Dashboard
              </button>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="relative z-10 flex-1 flex flex-col bg-white/70 backdrop-blur-sm">
        <header className="flex justify-between items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-md shadow-sm">
          <h2 className="text-lg font-semibold text-emerald-700">
            Dashboard Utama
          </h2>
          <div className="text-gray-600 text-sm">👤 Admin</div>
        </header>

        <section className="flex-1 p-8 overflow-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">
              Selamat Datang
            </h3>
            <p className="text-gray-600">
              {data ||
                "Anda berhasil masuk ke sistem internal PT. Javis Teknologi Albarokah."}
            </p>
          </div>
        </section>

        <footer className="text-center py-3 text-xs text-gray-500 border-t bg-white/80 backdrop-blur-md">
          © {new Date().getFullYear()} PT. Javis Teknologi Albarokah
        </footer>
      </main>
    </div>
  );
}
