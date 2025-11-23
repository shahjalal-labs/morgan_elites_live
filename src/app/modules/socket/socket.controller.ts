import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./socket.service";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const connectedUsers = new Map<string, CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const authToken = req.headers["x-token"] as string;
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) return;

    const userId = decoded.id;
    ws.userId = userId;

    // Store user websocket
    connectedUsers.set(userId, ws);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.on("message", async (message: any) => {
      try {
        const { type, receiverId, coHostLink } = JSON.parse(message.toString());

        switch (type) {
          case "add-contributor": {
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                })
              );
            }

            // get receiver socket from Map
            const receiverSocket = connectedUsers.get(receiverId);

            if (
              !receiverSocket ||
              receiverSocket.readyState !== WebSocket.OPEN
            ) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Receiver is not online",
                })
              );
            }

            // send ONLY to receiver
            receiverSocket.send(
              JSON.stringify({
                type: "contribution-request",
                from: ws.userId,
                messages: coHostLink,
              })
            );

            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message type",
              })
            );
        }
      } catch (err) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON format" })
        );
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss };
