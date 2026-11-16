import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { BookingSummary } from "../types/calendly";

export type IdempotencyStatus = "in_progress" | "completed" | "uncertain";

export interface IdempotencyRecord {
  status: IdempotencyStatus;
  payloadHash: string;
  createdAt: number;
  updatedAt: number;
  booking?: BookingSummary;
}

export interface IdempotencyStore {
  hashPayload(payload: unknown): string;
  get(key: string): IdempotencyRecord | undefined;
  acquireLock(
    key: string,
    payloadHash: string
  ):
    | { ok: true }
    | {
        ok: false;
        reason:
          | "DIFFERENT_PAYLOAD"
          | "IN_PROGRESS"
          | "ALREADY_COMPLETED"
          | "UNCERTAIN";
        record: IdempotencyRecord;
      };
  markCompleted(key: string, payloadHash: string, booking: BookingSummary): void;
  markUncertain(key: string, payloadHash: string): void;
  releaseOnDefiniteError(key: string): void;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000; // 24 horas

export function createIdempotencyStore(options?: {
  filePath?: string;
  ttlMs?: number;
}): IdempotencyStore {
  const ttlMs = options?.ttlMs ?? DEFAULT_TTL_MS;
  const filePath = options?.filePath;
  const records = new Map<string, IdempotencyRecord>();
  const inFlightKeys = new Set<string>();

  const loadFromDisk = () => {
    if (!filePath || !fs.existsSync(filePath)) return;
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw) as Record<string, IdempotencyRecord>;
      const now = Date.now();
      for (const [k, v] of Object.entries(parsed)) {
        if (now - v.createdAt <= ttlMs) {
          // Se o servidor reiniciou durante uma chamada em andamento, o estado é incerto
          records.set(k, {
            ...v,
            status: v.status === "in_progress" ? "uncertain" : v.status,
          });
        }
      }
    } catch {
      // Arquivo corrompido ou ilegível não derruba o servidor
    }
  };

  const persistToDisk = () => {
    if (!filePath) return;
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    const serialized = JSON.stringify(Object.fromEntries(records.entries()));
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpPath, serialized, "utf-8");
    fs.renameSync(tmpPath, filePath);
  };

  const pruneExpired = () => {
    const now = Date.now();
    let changed = false;
    for (const [key, rec] of records.entries()) {
      if (now - rec.createdAt > ttlMs && !inFlightKeys.has(key)) {
        records.delete(key);
        changed = true;
      }
    }
    if (changed) {
      persistToDisk();
    }
  };

  loadFromDisk();

  return {
    hashPayload(payload: unknown): string {
      return crypto
        .createHash("sha256")
        .update(JSON.stringify(payload))
        .digest("hex");
    },

    get(key: string): IdempotencyRecord | undefined {
      pruneExpired();
      return records.get(key);
    },

    acquireLock(key: string, payloadHash: string) {
      pruneExpired();
      const existing = records.get(key);

      if (existing) {
        if (existing.payloadHash !== payloadHash) {
          return { ok: false, reason: "DIFFERENT_PAYLOAD", record: existing };
        }
        if (inFlightKeys.has(key) || existing.status === "in_progress") {
          return { ok: false, reason: "IN_PROGRESS", record: existing };
        }
        if (existing.status === "completed") {
          return { ok: false, reason: "ALREADY_COMPLETED", record: existing };
        }
        if (existing.status === "uncertain") {
          return { ok: false, reason: "UNCERTAIN", record: existing };
        }
      }

      if (inFlightKeys.has(key)) {
        const fallbackRecord: IdempotencyRecord = {
          status: "in_progress",
          payloadHash,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        return { ok: false, reason: "IN_PROGRESS", record: fallbackRecord };
      }

      inFlightKeys.add(key);
      const now = Date.now();
      records.set(key, {
        status: "in_progress",
        payloadHash,
        createdAt: now,
        updatedAt: now,
      });
      persistToDisk();

      return { ok: true };
    },

    markCompleted(
      key: string,
      payloadHash: string,
      booking: BookingSummary
    ): void {
      inFlightKeys.delete(key);
      const existing = records.get(key);
      const now = Date.now();
      records.set(key, {
        status: "completed",
        payloadHash,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        booking,
      });
      persistToDisk();
    },

    markUncertain(key: string, payloadHash: string): void {
      inFlightKeys.delete(key);
      const existing = records.get(key);
      const now = Date.now();
      records.set(key, {
        status: "uncertain",
        payloadHash,
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      });
      persistToDisk();
    },

    releaseOnDefiniteError(key: string): void {
      inFlightKeys.delete(key);
      records.delete(key);
      persistToDisk();
    },
  };
}
