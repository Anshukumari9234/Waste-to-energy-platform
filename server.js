import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// ================== MongoDB Connection ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ================== Schemas ==================
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
});

const wasteSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  amountTons: Number,
  type: String,
  kwh: Number,
  reportedBy: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Waste = mongoose.model("Waste", wasteSchema);

// ================== Auth Middleware ==================
function authMiddleware(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
}

// ================== Auth Routes ==================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 8);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: "User already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ token, name: user.name });
});

// ================== Waste Routes ==================
app.post("/api/waste", authMiddleware, async (req, res) => {
  const { lat, lng, amountTons, type } = req.body;
  if (!amountTons || amountTons < 0)
    return res.status(400).json({ error: "amountTons required" });

  const kwh = (type === "ad" || type === "organic") ? amountTons * 450 : amountTons * 650;

  const waste = new Waste({
    lat, lng, amountTons, type, kwh, reportedBy: req.user.email
  });

  await waste.save();

  io.emit("newWaste", waste);

  res.json({ ok: true, waste });
});

app.get("/api/stats", async (req, res) => {
  const wastes = await Waste.find();
  const totalWasteTons = wastes.reduce((s, w) => s + w.amountTons, 0);
  const totalEnergyKWh = wastes.reduce((s, w) => s + w.kwh, 0);
  const totalCO2SavedTons = totalEnergyKWh * 0.0007;

  res.json({ wasteTons: totalWasteTons, energyKWh: totalEnergyKWh, co2SavedTons: totalCO2SavedTons });
});

app.get("/api/series", async (req, res) => {
  const wastes = await Waste.find().sort({ createdAt: 1 });
  const byType = ["organic", "msw", "agri"].map(type => ({
    name: type,
    value: wastes.filter(w => w.type === type).reduce((s, w) => s + w.amountTons, 0)
  }));

  const series = wastes.map(w => ({ t: w.createdAt.toISOString().slice(11, 19), tons: w.amountTons, kwh: w.kwh }));

  res.json({ series, byType });
});

// ================== Socket.io ==================
io.on("connection", (socket) => {
  console.log("🔌 Client connected");
});

// ================== Server ==================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log("API listening on http://localhost:" + PORT)
);
