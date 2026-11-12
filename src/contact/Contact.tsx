import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type CSSProperties,
} from "react";
import { profile } from "@/content/profile";
import { Section } from "@/layout/Section";
import { shapeClipPath } from "@/shape/shapes";
import { playCue } from "@/sound/cues";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Icon } from "@/ui/Icon";
import { LoadingIndicator } from "@/ui/LoadingIndicator";
import { TextArea, TextField } from "@/ui/TextField";
import {
  CONTACT_FIELDS,
  contactProblems,
  mailtoLink,
  type ContactValues,
} from "./validate";

// Where messages are posted, once a host is chosen. Until then, the form hands
// the message to the visitor's email app instead.
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT as string | undefined;
const MESSAGE_LIMIT = 2000;

type Status = "idle" | "sending" | "sent" | "drafted" | "error";

const BADGE = { clipPath: shapeClipPath("cookie9") };

function Sent({ onReset }: { onReset: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return (
    <div className="grid justify-items-start gap-4">
      <span
        className="md-sent-badge grid size-16 place-items-center bg-primary text-on-primary"
        style={BADGE}
      >
        <Icon name="check" size={32} />
      </span>
      <h3
        ref={heading}
        tabIndex={-1}
        className="font-display text-headline-small text-on-surface"
      >
        Message sent
      </h3>
      <p className="max-w-[45ch] text-body-large text-on-surface-variant">
        Thanks for reaching out. I'll reply within a couple of days.
      </p>
      <Button variant="text" onClick={onReset}>
        Send another message
      </Button>
    </div>
  );
}

export function Contact() {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    message: "",
  });
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const name = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const message = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const problems = contactProblems(values);
  const update = (field: keyof ContactValues) => (value: string) =>
    setValues((current) => ({ ...current, [field]: value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    // Inline errors replace the browser's bubbles; focus goes to the first field to fix.
    const first = CONTACT_FIELDS.find((field) => problems[field]);
    if (first) {
      ({ name, email, message })[first].current?.focus();
      return;
    }
    // Bots fill hidden fields and submit within moments; people do neither. Accept quietly, send nothing.
    if (honeypot.current?.value || Date.now() - startedAt.current < 3000) {
      setStatus("sent");
      return;
    }
    if (!ENDPOINT) {
      window.location.href = mailtoLink(profile.email, values);
      setStatus("drafted");
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`Status ${response.status}`);
      setStatus("sent");
      playCue("success");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues({ name: "", email: "", message: "" });
    setAttempted(false);
    setStatus("idle");
  };

  return (
    <Section id="contact">
      <div className="grid gap-10 large:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] large:gap-16">
        <div className="md-reveal" style={{ "--i": 1 } as CSSProperties}>
          <p className="max-w-[45ch] text-body-large text-on-surface">
            I graduate in December 2026 and I'm looking for full-time software
            engineering roles. Send a message here, or reach me directly.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={`mailto:${profile.email}`} icon="mail">
              {profile.email}
            </Button>
            <Button href={profile.linkedin} variant="outlined" icon="person">
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Wrapped: Card carries its own transition utility, which would override the reveal's. */}
        <div className="md-reveal" style={{ "--i": 2 } as CSSProperties}>
          <Card variant="filled" className="rounded-xl p-6 expanded:p-8">
            {status === "sent" ? (
              <Sent onReset={reset} />
            ) : (
              <form
                noValidate
                onSubmit={(event) => void submit(event)}
                className="relative grid gap-5"
                aria-label="Send me a message"
              >
                <TextField
                  ref={name}
                  label="Name"
                  name="name"
                  variant="outlined"
                  autoComplete="name"
                  required
                  value={values.name}
                  onChange={(event) =>
                    update("name")(event.currentTarget.value)
                  }
                  invalid={attempted && problems.name}
                  errorText="Enter your name"
                />
                <TextField
                  ref={email}
                  label="Email"
                  name="email"
                  type="email"
                  variant="outlined"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={(event) =>
                    update("email")(event.currentTarget.value)
                  }
                  invalid={attempted && problems.email}
                  errorText="Enter an email address I can reply to"
                />
                <TextArea
                  ref={message}
                  label="Message"
                  name="message"
                  variant="outlined"
                  rows={5}
                  maxLength={MESSAGE_LIMIT}
                  required
                  value={values.message}
                  onChange={(event) =>
                    update("message")(event.currentTarget.value)
                  }
                  invalid={attempted && problems.message}
                  supportingText={`${values.message.length} / ${MESSAGE_LIMIT}`}
                  errorText="Write at least a sentence"
                />
                {/* A trap for bots: hidden from people and assistive tech, tempting to scripts. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -start-[100vw] size-px overflow-hidden opacity-0"
                >
                  <label>
                    Company
                    <input
                      ref={honeypot}
                      type="text"
                      name="company"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <Button
                    type="submit"
                    icon={status === "sending" ? undefined : "send"}
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? (
                      <span className="inline-flex items-center gap-2">
                        <LoadingIndicator size={18} />
                        Sending
                      </span>
                    ) : (
                      "Send message"
                    )}
                  </Button>
                  <p
                    role="status"
                    className="text-body-medium text-on-surface-variant"
                  >
                    {status === "drafted" &&
                      "Your email app should open with the message ready to send."}
                    {status === "error" &&
                      `It didn't send. Email me directly at ${profile.email}.`}
                  </p>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </Section>
  );
}
