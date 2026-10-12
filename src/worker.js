
// THE ROCK | Phase 7 | Secure API response helper
function rockJsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff"
    }
  });
}


export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Financial API is disabled until authentication
    // and administrator authorisation are implemented.
    if (url.pathname.startsWith("/api/")) {
      return new Response(
        JSON.stringify({
          error: "Financial API not yet enabled"
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store"
          }
        }
      );
    }

    // Serve THE ROCK's existing static website.
    return env.ASSETS.fetch(request);
  }
};
