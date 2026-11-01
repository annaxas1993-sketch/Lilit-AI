const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (new URL(request.url).pathname !== "/generate") {
      return Response.json({ error: "Not found" }, { status: 404, headers: cors });
    }

    if (request.method !== "POST") {
      return Response.json({ error: "POST required" }, { status: 405, headers: cors });
    }

    try {
      const { prompt } = await request.json();

      if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 2048) {
        return Response.json({ error: "Prompt must be 1–2048 characters" }, { status: 400, headers: cors });
      }

      const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
        prompt: prompt.trim(),
        steps: 4
      });

      return Response.json({
        success: true,
        image: `data:image/jpeg;base64,${result.image}`
      }, { headers: cors });
    } catch (error) {
      return Response.json({ error: "Image generation failed" }, { status: 500, headers: cors });
    }
  }
};
