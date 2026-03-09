import crypto from "crypto";

const algorithm = "aes-256-gcm";

const keyHex = process.env.ENCRYPTION_KEY;

if (!keyHex) {
  throw new Error("ENCRYPTION_KEY no está definida en el .env");
}

const key = Buffer.from(keyHex, "hex");

if (key.length !== 32) {
  throw new Error("ENCRYPTION_KEY debe tener 64 caracteres hex (32 bytes)");
}

export function encrypt(text: string) {
  const iv = crypto.randomBytes(12); // recomendado para GCM

  const cipher = crypto.createCipheriv(
    algorithm,
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return {
    content: encrypted.toString("hex"),
    iv: iv.toString("hex"),
    tag: tag.toString("hex"),
  };
}

export function decrypt(
  encrypted: string,
  iv: string,
  tag: string
) {
  try {
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(tag, "hex"));

    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(encrypted, "hex")),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");

  } catch (error) {
    throw new Error("Error al desencriptar el dato");
  }
}