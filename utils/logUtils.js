import fs from "fs";
import path from "path";

export function logToFile(ip, data, ua = "") {
  const date = new Date().toISOString().split("T")[0];
  const logLine = `[${new Date().toISOString()}] [${ip}] [${ua}] ${JSON.stringify(data)}\n`;
  const logPath = path.join("logs", `${date}.txt`);

  if (!fs.existsSync("logs")) fs.mkdirSync("logs");
  fs.appendFileSync(logPath, logLine);
}
