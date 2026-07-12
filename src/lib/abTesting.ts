import { handleAction } from "@/utils/actionHandler";

/**
 * Lightweight, dependency-free A/B testing harness.
 *
 * Responsibilities:
 *  - Assign each visitor a stable, anonymous id (persisted in localStorage).
 *  - Deterministically bucket that visitor into a variant for a given
 *    experiment using a weighted hash, so assignments are stable across
 *    reloads and never require a server round-trip.
 *  - Emit exposure / conversion events through the existing action tracking
 *    pipeline (`handleAction`) so results land in the same analytics stream.
 */

export interface ExperimentVariant {
  /** Stable identifier for the variant, e.g. "control" or "treatment". */
  id: string;
  /**
   * Relative traffic weight. Defaults to 1 when omitted, i.e. an even split
   * across all variants. Weights do not need to sum to any particular value.
   */
  weight?: number;
}

export interface Experiment {
  /** Unique experiment key, e.g. "hero_cta_copy". */
  id: string;
  /** Two or more candidate variants. */
  variants: ExperimentVariant[];
}

const VISITOR_STORAGE_KEY = "ab.visitorId";
const ASSIGNMENT_STORAGE_PREFIX = "ab.assign.";

/** True when a usable browser storage / crypto environment is available. */
const hasWindow = (): boolean =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const safeGet = (key: string): string | null => {
  if (!hasWindow()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key: string, value: string): void => {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable (private mode, quota) — assignment stays in-memory */
  }
};

/** Generate a reasonably unique, opaque visitor id. */
const generateVisitorId = (): string => {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through to manual generation */
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

/**
 * Return the persistent visitor id, creating and storing one on first call.
 */
export const getVisitorId = (): string => {
  const existing = safeGet(VISITOR_STORAGE_KEY);
  if (existing) return existing;
  const fresh = generateVisitorId();
  safeSet(VISITOR_STORAGE_KEY, fresh);
  return fresh;
};

/**
 * Deterministic 32-bit FNV-1a hash → [0, 1). Same input always yields the
 * same fraction, which is what makes bucketing stable without a backend.
 */
const hashToUnitInterval = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // 32-bit FNV prime multiply, kept unsigned via >>> 0.
    hash = (hash + ((hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24))) >>> 0;
  }
  return (hash >>> 0) / 0x100000000;
};

/**
 * Resolve the variant for an experiment. Assignment is deterministic per
 * (visitor, experiment) pair and cached in localStorage so a visitor sees a
 * consistent experience even if variant weights are later re-tuned.
 */
export const getVariant = (experiment: Experiment): string => {
  const { id: experimentId, variants } = experiment;

  if (!variants || variants.length === 0) {
    throw new Error(`Experiment "${experimentId}" has no variants.`);
  }
  if (variants.length === 1) {
    return variants[0].id;
  }

  const cacheKey = `${ASSIGNMENT_STORAGE_PREFIX}${experimentId}`;
  const cached = safeGet(cacheKey);
  if (cached && variants.some((v) => v.id === cached)) {
    return cached;
  }

  const visitorId = getVisitorId();
  const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  const point = hashToUnitInterval(`${experimentId}:${visitorId}`) * totalWeight;

  let cursor = 0;
  let assigned = variants[variants.length - 1].id;
  for (const variant of variants) {
    cursor += variant.weight ?? 1;
    if (point < cursor) {
      assigned = variant.id;
      break;
    }
  }

  safeSet(cacheKey, assigned);
  return assigned;
};

/**
 * Record that a visitor was exposed to a given experiment variant. Wired into
 * the existing `handleAction` pipeline; safe to call on every render because
 * the calling hook de-duplicates.
 */
export const trackExposure = (experimentId: string, variant: string): void => {
  void handleAction("ab_exposure", {
    element: experimentId,
    context: variant,
  });
};

/**
 * Record a conversion attributed to an experiment variant (e.g. a click or a
 * completed purchase). `goal` names the conversion event.
 */
export const trackConversion = (
  experimentId: string,
  variant: string,
  goal = "conversion"
): void => {
  void handleAction("ab_conversion", {
    element: experimentId,
    context: variant,
    key: goal,
  });
};
