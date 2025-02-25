const express = require("express");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const path = require("path");

const app = express();
const PORT = 3000;

const rootPath = path.resolve(__dirname, "../../"); // Two directories up
const modulesPath = path.resolve(__dirname, "../../modules/"); // Modules directory
const indexPath = path.join(rootPath, "index.html"); // Path to index.html

const liveReloadServer = livereload.createServer({
  extraExts: ["html", "js", "css"],
});
liveReloadServer.watch([rootPath, modulesPath]);

liveReloadServer.server.once("error", (err) => {
  console.error("Livereload server error:", err);
  process.exit(1);
});

app.use(connectLivereload());

app.get("/", (req, res) => {
  res.sendFile(indexPath);
});

app.use(express.static(rootPath));

app.listen(PORT, () => {
  console.log(
    `Wisp Module Kit running on port \x1b[32m${PORT}\x1b[0m\n\n\x1b[34mhttp://localhost:${PORT}\x1b[0m || \x1b[34mhttp://127.0.0.1:${PORT}\x1b[0m\n`
  );
});
