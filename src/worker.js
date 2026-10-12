
/**
 * THE ROCK
 * Town Planning & Land Use Management
 *
 * Phase 7 — Step 85.54
 * Supabase authentication verification
 */

const ROCK_SUPABASE_URL =
  "https://iuwnsrvlmicgdilmrftl.supabase.co";

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

// Extract an access token from the Authorization header
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

// Verify an access token using Supabase Auth.
// Returns the authenticated user or null.
//
// This function does not grant administrator access.
async function rockVerifySupabaseUser(token, env) {
  if (!token || !env.SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${ROCK_SUPABASE_URL}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          "apikey": env.SUPABASE_PUBLISHABLE_KEY,
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        redirect: "error",
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) {
      return null;
    }

    const user = await response.json();

    if (!user || typeof user.id !== "string") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // All financial API routes remain disabled.
    // Authentication and administrator authorisation
    // must be integrated and tested before enabling them.
    if (url.pathname.startsWith("/api/")) {
      return rockJsonResponse(
        { error: "Financial API not yet enabled" },
        503
      );
    }

    // Serve the existing website and professional portal
    return env.ASSETS.fetch(request);
  }
};
