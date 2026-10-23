
/**
 * THE ROCK
 * Town Planning & Land Use Management
 *
 * Phase 7 — Step 85.38
 * Independent Financial API Worker
 *
 * Security:
 * - Supabase authentication verification
 * - Financial operations disabled by default
 * - No static website dependency
 * - No invoice issuance
 */

const ROCK_SUPABASE_URL =
  "https://iuwnsrvlmicgdilmrftl.supabase.co";

// JSON response helper
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer"
    }
  });
}

// Extract Bearer token
function getBearerToken(request) {
  const authorization =
    request.headers.get("Authorization");

  if (!authorization) return null;

  const match = /^Bearer\s+(\S+)$/i.exec(
    authorization.trim()
  );

  return match ? match[1] : null;
}

// Verify Supabase authenticated user
async function verifySupabaseUser(token, env) {
  if (!token || !env.SUPABASE_PUBLISHABLE_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${ROCK_SUPABASE_URL}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          apikey: env.SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${token}`,
          Accept: "application/json"
        },
        redirect: "error",
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!response.ok) return null;

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
    const path = url.pathname;

    // Health check
    if (
      path === "/health" &&
      request.method === "GET"
    ) {
      return jsonResponse({
        service: "THE ROCK Financial API",
        status: "online",
        version: "85.38",
        financial_operations: "disabled"
      });
    }

    // API routes
    if (path.startsWith("/api/")) {
      // Financial operations remain disabled
      if (env.FINANCIAL_API_ENABLED !== "true") {
        return jsonResponse(
          {
            error: "Financial API not yet enabled",
            status: "disabled"
          },
          503
        );
      }

      // Verify authentication
      const token = getBearerToken(request);

      if (!token) {
        return jsonResponse(
          { error: "Authentication required" },
          401
        );
      }

      const user = await verifySupabaseUser(
        token,
        env
      );

      if (!user) {
        return jsonResponse(
          { error: "Invalid or expired session" },
          401
        );
      }

      // Administrator authorisation and
      // financial endpoints are not yet implemented.
      return jsonResponse(
        {
          error: "Financial endpoints not implemented",
          status: "unavailable"
        },
        501
      );
    }

    // API-only Worker: no static website assets
    return jsonResponse(
      { error: "Route not found" },
      404
    );
  }
};
