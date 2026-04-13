import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/check-analysis-limit", async (req, res) => {
    // No limits now
    res.json({ allowed: true, remaining: -1 });
  });

  app.post("/api/increment-analysis-count", async (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/user-subscription/:userId", async (req, res) => {
    // Everyone is PRO
    res.json({ plan: "PRO" });
  });

  app.post("/api/deep-analysis", async (req, res) => {
    res.json({ allowed: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
