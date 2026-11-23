import type { CSSProperties } from 'react';
import { awards, certifications } from '@/content/profile';
import type { YearMonth } from '@/lib/degreeProgress';
import { Section } from '@/layout/Section';
import { useHydrated } from '@/lib/useHydrated';
import { shapeClipPath, type ShapeName } from '@/shape/shapes';
import { Button } from '@/ui/Button';
import { Icon } from '@/ui/Icon';

// Award seals rest in a lobed shape and turn and morph on hover, like the
// Education medallions; neighbors get different shapes.
const SEALS: readonly ShapeName[] = ['verySunny', 'softBurst', 'sunny'];
const SEAL_HOVER = shapeClipPath('cookie12', Math.PI / 12);

const monthYear = (month: YearMonth) => {
  const [year = 0, number = 1] = month.split('-').map(Number);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(new Date(year, number - 1, 1));
};
const yearOf = (month: YearMonth) => month.slice(0, 4);

/** On placeholder entries, so they can't be mistaken for real ones. */
function ExampleLabel() {
  return <p className="mb-2 inline-flex rounded-full bg-error-container px-3 py-0.5 text-label-medium text-on-error-container">Example entry</p>;
}

/**
 * Awards and certifications. Each part shows only when it has entries, and
 * the whole section (and its place in the navigation) only when either does.
 */
export function Recognition() {
  // Whether a certification has expired, as of the build until hydration, then as of today.
  const hydrated = useHydrated();
  const today = (hydrated ? new Date().toISOString() : __BUILD_DATE__).slice(0, 7);
  if (awards.length + certifications.length === 0) return null;

  return (
    <Section id="recognition">
      {awards.length > 0 && (
        <section aria-labelledby="awards-title" className="md-reveal" style={{ '--i': 1 } as CSSProperties}>
          <h3 id="awards-title" className="text-title-large text-on-surface">
            Awards
          </h3>
          <ul className="mt-6 grid gap-6 expanded:grid-cols-2">
            {awards.map((award, index) => (
              <li
                key={award.id}
                id={`award-${award.id}`}
                className="md-award grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-5 rounded-2xl bg-surface-container-low p-6 expanded:grid-cols-[7rem_minmax(0,1fr)] expanded:gap-6"
                style={{ '--seal': shapeClipPath(SEALS[index % SEALS.length] ?? 'verySunny'), '--seal-hover': SEAL_HOVER } as CSSProperties}
              >
                <div className="relative grid aspect-square place-content-center text-on-primary-container" aria-hidden="true">
                  <span className="md-award-seal absolute inset-0 bg-primary-container" />
                  <span className="relative font-display text-title-large tabular-nums expanded:text-headline-small">{yearOf(award.date)}</span>
                </div>
                <div className="min-w-0">
                  {award.example && <ExampleLabel />}
                  <h4 className="text-title-large text-on-surface">{award.title}</h4>
                  <p className="mt-1 text-body-medium text-on-surface-variant">
                    {award.from}, {monthYear(award.date)}
                  </p>
                  <p className="mt-3 text-body-medium text-on-surface">{award.reason}</p>
                  {award.url && (
                    <a href={award.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-1 text-label-large text-primary underline-offset-4 hover:underline">
                      Read more <Icon name="open_in_new" size={18} />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {certifications.length > 0 && (
        <section aria-labelledby="certifications-title" className={`md-reveal ${awards.length > 0 ? 'mt-16' : ''}`} style={{ '--i': 2 } as CSSProperties}>
          <h3 id="certifications-title" className="text-title-large text-on-surface">
            Certifications
          </h3>
          <ul className="mt-6 grid gap-6 medium:grid-cols-2 large:grid-cols-3">
            {certifications.map((certification) => {
              const expired = certification.expires !== undefined && certification.expires < today;
              return (
                <li key={certification.id} className="flex flex-col rounded-2xl bg-surface-container-highest p-6">
                  <div className="flex items-start gap-4">
                    {certification.badge ? (
                      <img src={certification.badge} alt="" loading="lazy" decoding="async" className="size-16 shrink-0 object-contain" />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="grid size-14 shrink-0 place-items-center bg-secondary-container text-on-secondary-container"
                        style={{ clipPath: shapeClipPath('cookie9') }}
                      >
                        <Icon name="verified" />
                      </span>
                    )}
                    <div className="min-w-0">
                      {certification.example && <ExampleLabel />}
                      <h4 className="text-title-medium text-on-surface">{certification.name}</h4>
                      <p className="mt-1 text-body-medium text-on-surface-variant">{certification.issuer}</p>
                      {expired && <p className="mt-2 inline-flex rounded-full px-3 py-0.5 text-label-medium text-on-surface-variant shadow-[inset_0_0_0_1px_var(--md-sys-color-outline)]">Expired</p>}
                    </div>
                  </div>
                  <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-body-medium">
                    <dt className="text-on-surface-variant">Issued</dt>
                    <dd className="text-on-surface tabular-nums">{monthYear(certification.issued)}</dd>
                    {certification.expires && (
                      <>
                        <dt className="text-on-surface-variant">{expired ? 'Expired' : 'Expires'}</dt>
                        <dd className="text-on-surface tabular-nums">{monthYear(certification.expires)}</dd>
                      </>
                    )}
                    {certification.credentialId && (
                      <>
                        <dt className="text-on-surface-variant">Credential ID</dt>
                        <dd className="break-all text-on-surface">{certification.credentialId}</dd>
                      </>
                    )}
                  </dl>
                  <div className="mt-auto pt-6">
                    <Button href={certification.verifyUrl} variant="outlined" icon="verified" target="_blank" rel="noopener noreferrer" aria-label={`Verify ${certification.name} (opens in a new tab)`}>
                      Verify
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </Section>
  );
}
