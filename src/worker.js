
/**
 * THE ROCK
 * Town Planning & Land Use Management
 *
 * Phase 7 — Step 85.50
 * Financial API authentication preparation
 */

// Standard JSON response helper
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

// Extract a Bearer token from the Authorization header.
// This function only extracts the token.
// It does NOT verify or authorise the user.
function rockGetBearerToken(request) {
  const authorization = request.headers.get("Authorization");

  if (!authorization) {
    return null;
  }

  const match = /^Bearer\s+(\S+)$/i.exec(
    authorization.trim()
  );

  return match ? match[1] : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Financial API remains disabled until
    // token verification and administrator
    // authorisation have been implemented.
    if (url.pathname.startsWith("/api/")) {
      return rockJsonResponse(
        { error: "Financial API not yet enabled" },
        503
      );
    }

    // Serve the existing website and professional portal.
    return env.ASSETS.fetch(request);
  }
};
