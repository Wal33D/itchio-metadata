import * as dotenv from "dotenv";
import { fetchItchGameData } from "./fetchItchGameData";

dotenv.config({ path: ".env.local" });

async function exampleUsage() {
  try {
    const latestVersionInfoResult = await fetchItchGameData({
      author: "baraklava",
      gameTitle: "manic-miners",
    });
    console.log(latestVersionInfoResult);
    console.log(`[INFO] Successfully fetched game metadata from Itch.io`);
  } catch (error) {
    console.error(
      `[ERROR] An error occurred while fetching game metadata:`,
      error
    );
  }
}

exampleUsage().catch((err) =>
  console.error(`[ERROR] Failed to execute example usage:`, err)
);
