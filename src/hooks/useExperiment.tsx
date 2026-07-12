import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Experiment,
  ExperimentVariant,
  getVariant,
  trackConversion,
  trackExposure,
} from "@/lib/abTesting";

export interface UseExperimentResult {
  /** The variant id this visitor is assigned to. */
  variant: string;
  /** True once the assignment has resolved on the client. */
  isReady: boolean;
  /** Convenience helper: `isVariant("treatment")`. */
  isVariant: (id: string) => boolean;
  /** Report a conversion for this experiment/variant. */
  convert: (goal?: string) => void;
}

type ExperimentInput =
  | Experiment
  | { id: string; variants: Array<string | ExperimentVariant> };

const normalize = (input: ExperimentInput): Experiment => ({
  id: input.id,
  variants: input.variants.map((v) =>
    typeof v === "string" ? { id: v } : v
  ),
});

/**
 * React hook for the A/B testing harness.
 *
 * Resolves a stable variant for the current visitor, fires a single exposure
 * event when the component first mounts, and hands back a `convert` helper for
 * attributing goals to the assigned variant.
 *
 * @example
 *   const { variant, convert } = useExperiment({
 *     id: "hero_cta",
 *     variants: ["control", "treatment"],
 *   });
 *   // ...
 *   <Button onClick={() => convert("cta_click")}>
 *     {variant === "treatment" ? "Get started free" : "Sign up"}
 *   </Button>
 */
export const useExperiment = (input: ExperimentInput): UseExperimentResult => {
  // Re-normalize only when the identity or the variant shape changes.
  const experimentId = input.id;
  const variantsKey = JSON.stringify(input.variants);
  const experiment = useMemo(
    () => normalize({ id: experimentId, variants: input.variants }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [experimentId, variantsKey]
  );

  // Resolve during first render so consumers avoid a control→variant flash.
  const [variant] = useState<string>(() => getVariant(experiment));
  const exposedRef = useRef(false);

  useEffect(() => {
    if (exposedRef.current) return;
    exposedRef.current = true;
    trackExposure(experiment.id, variant);
  }, [experiment.id, variant]);

  const convert = useCallback(
    (goal?: string) => {
      trackConversion(experiment.id, variant, goal);
    },
    [experiment.id, variant]
  );

  const isVariant = useCallback((id: string) => id === variant, [variant]);

  return { variant, isReady: true, isVariant, convert };
};

export default useExperiment;
