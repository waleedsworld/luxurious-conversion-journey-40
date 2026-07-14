// Payment provider (Ziina) API key.
//
// IMPORTANT: never commit real secrets. Provide the key at build/run time via
// a Vite environment variable in an untracked `.env.local`:
//
//   VITE_ZIINA_API_KEY=your_real_key_here
//
// See `.env.example` for the template.
export const API_KEY: string = import.meta.env.VITE_ZIINA_API_KEY ?? "";

// Helper to read the API key, warning loudly if it hasn't been configured.
export const getApiKey = (): string => {
  if (!API_KEY) {
    console.warn(
      "VITE_ZIINA_API_KEY is not set — payment requests will fail. " +
        "Copy .env.example to .env.local and add your key."
    );
  }
  return API_KEY;
};
