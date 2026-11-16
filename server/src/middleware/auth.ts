import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { AuthenticatedUser } from "../types/calendly";

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface GoogleTokenVerifier {
  verify(idToken: string): Promise<AuthenticatedUser>;
}

const VALID_ISSUERS = new Set([
  "accounts.google.com",
  "https://accounts.google.com",
]);

export function createGoogleTokenVerifier(
  allowedClientIds: string[]
): GoogleTokenVerifier {
  const client = new OAuth2Client();

  return {
    async verify(idToken: string): Promise<AuthenticatedUser> {
      if (allowedClientIds.length === 0) {
        throw new Error("GOOGLE_CLIENT_IDS_NOT_CONFIGURED");
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: allowedClientIds,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error("INVALID_TOKEN_PAYLOAD");
      }

      if (!payload.iss || !VALID_ISSUERS.has(payload.iss)) {
        throw new Error("INVALID_TOKEN_ISSUER");
      }

      const audience = Array.isArray(payload.aud)
        ? payload.aud
        : [payload.aud];
      const hasAllowedAudience = audience.some(
        (aud) => typeof aud === "string" && allowedClientIds.includes(aud)
      );
      if (!hasAllowedAudience) {
        throw new Error("INVALID_TOKEN_AUDIENCE");
      }

      if (!payload.exp || payload.exp * 1000 <= Date.now()) {
        throw new Error("TOKEN_EXPIRED");
      }

      if (!payload.email || !payload.email_verified) {
        throw new Error("EMAIL_NOT_VERIFIED");
      }

      return {
        sub: payload.sub,
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email,
        emailVerified: Boolean(payload.email_verified),
      };
    },
  };
}

export function createAuthMiddleware(verifier: GoogleTokenVerifier) {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Token de autenticação ausente ou malformado.",
      });
      return;
    }

    const idToken = authHeader.slice("Bearer ".length).trim();
    if (!idToken) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Token de autenticação vazio.",
      });
      return;
    }

    try {
      const user = await verifier.verify(idToken);
      req.user = user;
      next();
    } catch (error: any) {
      res.status(401).json({
        code: "UNAUTHORIZED",
        error: "Google ID Token inválido, expirado ou não autorizado.",
      });
    }
  };
}
