import type { CSSProperties } from "react";
import { profile } from "@/content/profile";
import { Section } from "@/layout/Section";
import { Button } from "@/ui/Button";
import { Avatar } from "./Avatar";

/** Stagger index for the reveal (.md-reveal in index.css); the title is 0. */
const reveal = (i: number) => ({ "--i": i }) as CSSProperties;

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-10 expanded:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] expanded:gap-16">
        {/* Wrapped, so the reveal's rise doesn't compete with the avatar's own motion. */}
        <div
          className="md-reveal w-full max-w-[18rem] expanded:max-w-[24rem] expanded:justify-self-center"
          style={reveal(1)}
        >
          <Avatar className="w-full" />
        </div>
        <div className="max-w-[65ch] space-y-5 text-body-large text-on-surface">
          {profile.about.map((paragraph, index) => (
            <p key={paragraph} className="md-reveal" style={reveal(2 + index)}>
              {paragraph}
            </p>
          ))}
          {profile.resumeUrl && (
            <div
              className="md-reveal pt-3"
              style={reveal(2 + profile.about.length)}
            >
              <Button
                href={profile.resumeUrl}
                variant="tonal"
                icon="description"
              >
                Read my resume
              </Button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
