import { createCipheriv } from "node:crypto";
import { Buffer } from "node:buffer";

function RndNum(a: number, b: number) {
  return Math.ceil((a + (b - a)) * Math.random());
}

function makeNonce() {
  return RndNum(-2147483648, 2147483647);
}

function makeRandomIv(): Buffer {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const ivStr = Array.from(
    { length: 16 },
    () => chars[Math.floor(Math.random() * chars.length)],
  ).join("");
  return Buffer.from(ivStr, "utf8");
}

function getAlgorithm(key: Buffer): string {
  switch (key.length) {
    case 16:
      return "aes-128-cbc";
    case 24:
      return "aes-192-cbc";
    case 32:
      return "aes-256-cbc";
  }
  throw new Error("Invalid key length for AES: " + key.length);
}

function aesEncrypt(plainText: string, key: Buffer, iv: Buffer): Buffer {
  const cipher: any = createCipheriv(
    getAlgorithm(key) as any,
    key as any,
    iv as any,
  );
  cipher.setAutoPadding(true);
  return Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
}

export function generateZegoToken(
  appId: number,
  userId: string,
  secret: string,
  effectiveTimeInSeconds: number,
  payload?: Record<string, any>,
): string {
  if (!secret) throw new Error("ZEGOCLOUD Server Secret missing");

  // ✅ Convert 64-char hex → 32-byte binary key automatically
  let key: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    key = Buffer.from(secret, "hex");
  } else {
    key = Buffer.from(secret, "utf8");
  }

  if (key.length !== 32) {
    throw new Error(
      `ZEGOCLOUD Server Secret must be 32 bytes (got ${key.length})`,
    );
  }

  const createTime = Math.floor(Date.now() / 1000);
  const tokenBody = {
    app_id: appId,
    user_id: userId,
    nonce: makeNonce(),
    ctime: createTime,
    expire: createTime + effectiveTimeInSeconds,
    payload: payload ? JSON.stringify(payload) : "",
  };

  const iv = makeRandomIv();
  const encrypted = aesEncrypt(JSON.stringify(tokenBody), key, iv);

  const expireBuf: any = Buffer.alloc(8);
  expireBuf.writeBigInt64BE(BigInt(tokenBody.expire));

  const ivLenBuf = Buffer.alloc(2);
  ivLenBuf.writeUInt16BE(iv.length);

  const dataLenBuf = Buffer.alloc(2);
  dataLenBuf.writeUInt16BE(encrypted.length);

  const finalBuffer = Buffer.concat([
    expireBuf,
    ivLenBuf,
    iv,
    dataLenBuf,
    encrypted,
  ]);

  return "04" + finalBuffer.toString("base64");
}
