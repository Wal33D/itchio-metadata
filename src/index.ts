import * as dotenv from "dotenv";
export { fetchItchGameData } from "./fetchItchGameData";
export { FetchGameDataParams, GameMetadata } from "./types";

dotenv.config({ path: ".env.local" });
