import { buildCompetitionPackage } from "./services/packageBuilder";

export default {
  async fetch(request: Request): Promise<Response> {
    try {

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
        });
      }

      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
        });
      }

      const { apiKey, words } = await request.json();

      if (typeof apiKey !== "string") {
        return new Response("Invalid API key.", {
          status: 400,
        });
      }

      if (
        !Array.isArray(words) ||
        !words.every((word): word is string => typeof word === "string")
      ) {
        return new Response("Invalid word list.", {
          status: 400,
        });
      }

      const zip = await buildCompetitionPackage(words, apiKey);

      return new Response(new Uint8Array(zip), {
        status: 200,
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": 'attachment; filename="competition.zip"',
        },
      });
    } catch (error) {
      console.error(error);

      return new Response("Failed to generate package.", {
        status: 500,
      });
    }
  },
};
