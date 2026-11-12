import { lazy, Suspense, useRef, useState, type CSSProperties } from "react";
import { Section } from "@/layout/Section";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { useNearViewport } from "@/lib/useNearViewport";
import { ChoiceChips } from "@/ui/ChoiceChips";
import { SkillDetail } from "./SkillDetail";
import { SkillList } from "./SkillList";

// d3-force and the constellation load only as the section nears the viewport.
const Constellation = lazy(() => import("./Constellation"));

type View = "graph" | "list";

const VIEWS: ReadonlyArray<{ value: View; label: string }> = [
  { value: "graph", label: "Constellation" },
  { value: "list", label: "List" },
];

function Placeholder() {
  return (
    <div
      className="aspect-[3/2] w-full rounded-xl bg-surface-container-low"
      aria-hidden="true"
    />
  );
}

export function SkillsSection() {
  // The constellation needs room; small screens start on the list and can switch.
  const roomy = useMediaQuery("(width >= 52.5rem)");
  const [choice, setChoice] = useState<View | null>(null);
  const view = choice ?? (roomy ? "graph" : "list");
  const holder = useRef<HTMLDivElement>(null);
  const near = useNearViewport(holder, "800px");

  return (
    <Section id="skills">
      <div
        className="md-reveal flex flex-wrap items-end justify-between gap-x-10 gap-y-6"
        style={{ "--i": 1 } as CSSProperties}
      >
        <p className="max-w-[60ch] text-body-large text-on-surface-variant">
          Each line joins two skills I have shipped together, drawn from the
          roles and projects on this page. Select a skill to see where I used
          it.
        </p>
        <ChoiceChips
          legend="View"
          name="skills-view"
          value={view}
          options={VIEWS}
          onChange={(value) => setChoice(value)}
        />
      </div>
      <div
        className="md-reveal mt-8 grid items-start gap-6 xlarge:grid-cols-[minmax(0,1fr)_20rem]"
        style={{ "--i": 2 } as CSSProperties}
      >
        <div ref={holder} className="min-w-0">
          {view === "list" ? (
            <SkillList />
          ) : near ? (
            <Suspense fallback={<Placeholder />}>
              <Constellation />
            </Suspense>
          ) : (
            <Placeholder />
          )}
        </div>
        {/* Beside the graph only on extra-large screens; above it elsewhere, so the graph gets the full width. */}
        <SkillDetail className="z-10 max-expanded:sticky max-expanded:top-[4.75rem] max-xlarge:order-first xlarge:sticky xlarge:top-6" />
      </div>
    </Section>
  );
}
