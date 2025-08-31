import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const APP_URL = process.env.PUBLIC_APP_URL || "http://localhost:5173";

function signSession(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}
function auth(req: any, res: any, next: any) {
  const h = req.headers.authorization;
  if (!h) return res.status(401).json({ error: "No auth" });
  try { req.user = jwt.verify(h.replace("Bearer ", ""), JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: "Invalid session" }); }
}
const randomToken = () => crypto.randomBytes(16).toString("hex");

// 1) Crear familia + token de propietario
app.post("/api/family", async (req, res) => {
  const ownerToken = randomToken();
  const initialFishCount = Number(req.body?.initialFishCount ?? 0);
  const family = await prisma.family.create({
    data: {
      label: req.body?.label ?? null,
      rootSymbol: req.body?.rootSymbol ?? "root-1",
      claimTokens: { create: [{ token: ownerToken, kind: "owner" }] },
      fishes: { create: Array.from({ length: initialFishCount }, () => ({})) }
    }
  });
  const claimUrl = `${APP_URL}/claim?token=${ownerToken}`;
  const publicUrl = `${APP_URL}/v/${family.publicId}`; 
  res.json({ familyId: family.id, claimUrl, publicUrl });
});

// 2) Consumir token -> sesión
app.post("/api/auth/consume", async (req, res) => {
  const token = req.body?.token;
  if (!token) return res.status(400).json({ error: "Missing token" });
  const ct = await prisma.claimToken.findUnique({ where: { token } });
  if (!ct) return res.status(401).json({ error: "Invalid token" });
  res.json({ session: signSession({ familyId: ct.familyId, role: ct.kind }), familyId: ct.familyId });
});

// 3) Ver datos de una familia (protegido)
app.get("/api/family/:id", auth, async (req, res) => {
  const fam = await prisma.family.findUnique({ where: { id: req.params.id }, include: { fishes: true } });
  if (!fam) return res.status(404).json({ error: "Not found" });
  res.json(fam);
});

// Crear pez en una familia
app.post("/api/family/:id/fish", auth, async (req, res) => {
  const { id } = req.params;
  const { name, role } = req.body ?? {};
  const fish = await prisma.fish.create({
    data: { familyId: id, name: name ?? null, role: role ?? null }
  });
  res.json(fish);
});

// Renombrar / actualizar pez
app.patch("/api/fish/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, role, angle, radius } = req.body ?? {};
  const fish = await prisma.fish.update({
    where: { id },
    data: { name, role, angle, radius }
  });
  res.json(fish);
});

// Crear enlace de invitación para esta familia
app.post("/api/family/:id/invite", auth, async (req, res) => {
  // (Opcional) solo propietario puede invitar:
  // if ((req as any).user?.role !== "owner") return res.status(403).json({ error: "Solo el propietario puede invitar" });

  const inviteToken = crypto.randomBytes(16).toString("hex");
  await prisma.claimToken.create({
    data: { familyId: req.params.id, token: inviteToken, kind: "invite" }
  });
  const APP_URL = process.env.PUBLIC_APP_URL || "http://localhost:5173";
  res.json({ inviteUrl: `${APP_URL}/claim?token=${inviteToken}` });
});

// Vista pública: devuelve familia por publicId, sin auth
app.get("/api/public/:publicId", async (req, res) => {
  const fam = await prisma.family.findUnique({
    where: { publicId: req.params.publicId },
    include: { fishes: true }
  });
  if (!fam) return res.status(404).json({ error: "Not found" });
  // No devolvemos tokens ni nada sensible
  res.json({ publicId: fam.publicId, label: fam.label, fishes: fam.fishes });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
