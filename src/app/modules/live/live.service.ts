import { generateZegoToken } from "../../../helpers/zegoToken";

const generateToken = async (userId: string, roomId: string) => {
  console.log(userId);
  const token = generateZegoToken(
    Number(process.env.ZEGO_APP_ID),
    userId,
    process.env.ZEGO_SERVER_SECRET!,
    3600, // 1 hour validity
    { room_id: roomId }
  );

  return {
    token,
  };
};

export const liveServices = {
  generateToken,
};
