import { config } from "dotenv";
config({ path: ".env" });

export const { PORT, IDOSELL_PANEL, IDOSELL_API_KEY } = process.env;
