type LogLevel = "info" | "warn" | "error";

const pretty =
  process.env.NODE_ENV === "development" ? 2 : 0;

function log(
  level: LogLevel,
  message: string,
  meta?: Record<string, unknown>
) {
  const entry = {
    level,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };

  const output = JSON.stringify(entry, null, pretty);

  if (level === "error") {
    console.error(output);
  } else if (level === "warn") {
    console.warn(output);
  } else {
    console.log(output);
  }
}

export const logger = {
  info: (message: string, meta?: Record<string, unknown>) =>
    log("info", message, meta),

  warn: (message: string, meta?: Record<string, unknown>) =>
    log("warn", message, meta),

  error: (message: string, meta?: Record<string, unknown>) =>
    log("error", message, meta),
};
