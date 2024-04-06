const { WebSocketServer } = require("ws");
const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

let wss;
const clients = new Map();

function verifyJwtAndGetUserId(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded && decoded.id;
  } catch (error) {
    return null;
  }
}

function init(server) {
  wss = new WebSocketServer({ server, path: "/wss" });

  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    if (token) {
      const userId = verifyJwtAndGetUserId(token);
      if (userId) {
        clients.set(userId, ws);
        ws.on("close", () => {
          clients.delete(userId);
        });
      } else {
        ws.close(1008, "Invalid token");
      }
    } else {
      ws.close(1008, "No token provided");
    }
  });

  wss.on("error", (error) => {
    console.log(error.message);
  });

  return wss;
}

function getSocketByUserId(userId) {
  return clients.get(userId);
}

function destroy() {
  wss.close();
}

module.exports = {
  init,
  getSocketByUserId,
  destroy,
};
