import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./socket.service";
import { parse } from "url";
import prisma from "../../../shared/prisma";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const connectedUsers = new Map<string, CustomWebSocket>();
const connectedEvents = new Map<string, Set<string>>();
const connectedStreams = new Map<string, Set<string>>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const { query } = parse(req.url!, true);
    let authToken = req.headers["x-token"] as string;
    if (!authToken && query["x-token"]) {
      authToken = Array.isArray(query["x-token"])
        ? query["x-token"][0]
        : query["x-token"];
    }
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
        const { type, receiverId, coHostLink, streamId, eventId, comment } =
          JSON.parse(message.toString());

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

            const senderInfo = await prisma.user.findUnique({
              where: { id: ws.userId },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                profession: true,
              },
            });
            if (!senderInfo)
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Sender not found",
                })
              );

            // send ONLY to receiver
            receiverSocket.send(
              JSON.stringify({
                type: "contribution-request",
                from: senderInfo,
                link: coHostLink,
                streamId: streamId,
              })
            );

            break;
          }

          case "join-streaming": {
            if (!eventId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event ID is required",
                })
              );
            }

            const eventInfo = await prisma.event.findUnique({
              where: { id: eventId },
              select: { id: true },
            });
            if (!eventInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event not found",
                })
              );
            }

            if (!connectedEvents.has(eventId)) {
              connectedEvents.set(eventId, new Set<string>());
            }
            connectedEvents.get(eventId)!.add(userId);

            ws.send(
              JSON.stringify({
                type: "joined-streaming",
                eventId,
              })
            );

            break;
          }

          case "chat-streaming": {
            if (!eventId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event ID is required",
                })
              );
            }

            const eventInfo = await prisma.event.findUnique({
              where: { id: eventId },
              select: { id: true },
            });
            if (!eventInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Event not found",
                })
              );
            }

            await prisma.eventComment.create({
              data: {
                eventId,
                comment,
                userId,
              },
            });

            const comments = await prisma.event.findUnique({
              where: { id: eventId },
              select: {
                id: true,
                EventComment: {
                  orderBy: { createdAt: "desc" },
                  take: 20,
                  select: {
                    id: true,
                    comment: true,
                    createdAt: true,
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                      },
                    },
                    ReplyComment: {
                      orderBy: { createdAt: "desc" },
                      take: 20,
                      select: {
                        id: true,
                        replyComment: true,
                        createdAt: true,
                        user: {
                          select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            profileImage: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            });

            // Broadcast comment only to users connected to the event
            connectedEvents.get(eventId)!.forEach((clientWs) => {
              const clientSocket = connectedUsers.get(clientWs);

              if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(
                  JSON.stringify({
                    type: "chat-streaming-comment",
                    message: comments,
                  })
                );
              }
            });
            break;
          }

          case "join-streaming-free": {
            if (!streamId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream ID is required",
                })
              );
            }

            const streamInfo = await prisma.liveStreaming.findUnique({
              where: { id: streamId },
              select: { id: true },
            });
            if (!streamInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream not found",
                })
              );
            }

            if (!connectedStreams.has(streamId)) {
              connectedStreams.set(streamId, new Set<string>());
            }
            connectedStreams.get(streamId)!.add(userId);

            ws.send(
              JSON.stringify({
                type: "joined-streaming-free",
                streamId,
              })
            );

            break;
          }

          case "chat-streaming-free": {
            if (!streamId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream ID is required",
                })
              );
            }

            const streamInfo = await prisma.liveStreaming.findUnique({
              where: { id: streamId },
              select: { id: true },
            });
            if (!streamInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Stream not found",
                })
              );
            }

            const userInfo = await prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
              },
            });
            if (!userInfo) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "User not found",
                })
              );
            }

            const commentInfo = {
              userId,
              firstName: userInfo.firstName,
              lastName: userInfo.lastName,
              profileImage: userInfo.profileImage,
              comment,
              createdAt: new Date(),
            };

            // Broadcast comment only to users connected to the event
            connectedStreams.get(streamId)!.forEach((clientWs) => {
              const clientSocket = connectedUsers.get(clientWs);

              if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
                clientSocket.send(
                  JSON.stringify({
                    type: "chat-streaming-free-comment",
                    message: commentInfo,
                  })
                );
              }
            });
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
