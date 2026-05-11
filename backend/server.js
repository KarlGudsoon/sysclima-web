// backend/server.js
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const FRONTEND_DIR = path.join(__dirname, "../frontend");

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url.startsWith("/api")) {
    res.setHeader("Content-Type", "application/json");

    if (url === "/api/users" && method === "GET") {
      res.writeHead(200);
      res.end(JSON.stringify({ users: [] }));
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Ruta no encontrada" }));
    return;
  }

  const filePath = path.join(FRONTEND_DIR, url === "/" ? "index.html" : url);

  const ext = path.extname(filePath);
  const contentType = MIME_TYPES[ext] || "text/plain";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("<h1>404 - Página no encontrada</h1>");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
