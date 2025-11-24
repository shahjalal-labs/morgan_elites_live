import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";

export function verifyWebSocketToken(
  ws: any,
  token: string | undefined | null
) {
  // No token provided
  if (!token) {
    sendWsError(ws, "You are not authenticated");
    return null;
  }

  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as string
    );
    return decoded;
  } catch (error: any) {
    let message = "Invalid token!";

    if (error?.name === "TokenExpiredError") {
      message = "Token has expired!";
    }

    sendWsError(ws, message);
    return null;
  }
}

/**
 * Safely sends a standardized error structure to the client
 */
function sendWsError(ws: any, message: string) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type: "error", message }));
  }
}
