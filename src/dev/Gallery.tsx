import { useState, type ReactNode } from 'react';
import { container } from '@/layout/container';
import { SHAPE_NAMES, shapeClipPath } from '@/shape/shapes';
import { ThemeControls } from '@/theme/ThemeControls';
import { Button, type ButtonVariant } from '@/ui/Button';
import { Card, type CardVariant } from '@/ui/Card';
import { AssistChip, Chip, FilterChip } from '@/ui/Chip';
import { Dialog } from '@/ui/Dialog';
import { Fab } from '@/ui/Fab';
import { IconButton, type IconButtonVariant } from '@/ui/IconButton';
import { Switch } from '@/ui/Switch';
import { TextArea, TextField } from '@/ui/TextField';

// Development only: every component in its states, on the live theme.

const BUTTON_VARIANTS: ButtonVariant[] = ['filled', 'tonal', 'elevated', 'outlined', 'text'];
const ICON_VARIANTS: IconButtonVariant[] = ['standard', 'filled', 'tonal', 'outlined'];
const CARD_VARIANTS: CardVariant[] = ['elevated', 'filled', 'outlined'];

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="font-display text-headline-small text-on-surface">{title}</h2>
      {children}
    </section>
  );
}

export default function Gallery() {
  const [filters, setFilters] = useState<Record<string, boolean>>({ React: true, 'Node.js': false, Python: false });
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [notifications, setNotifications] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shapeIndex, setShapeIndex] = useState(0);
  const morphShape = SHAPE_NAMES[shapeIndex % SHAPE_NAMES.length] ?? 'circle';

  return (
    <main className={`${container} space-y-14 py-12 text-on-surface`}>
      <header className="space-y-4">
        <h1 className="font-display text-display-small">Component gallery</h1>
        <p className="text-body-large text-on-surface-variant">Development only. Every component, on the live theme.</p>
        <ThemeControls />
      </header>

      <Group title="Buttons">
        {(['small', 'medium'] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.map((variant) => (
              <Button key={variant} variant={variant} size={size} icon="add">
                {variant}
              </Button>
            ))}
            <Button size={size} disabled>
              disabled
            </Button>
          </div>
        ))}
      </Group>

      <Group title="Icon buttons">
        <div className="flex flex-wrap items-center gap-2">
          {ICON_VARIANTS.map((variant) => (
            <IconButton key={variant} variant={variant} icon="edit" label={`Edit (${variant})`} />
          ))}
          <span className="mx-2 h-8 w-px bg-outline-variant" />
          {ICON_VARIANTS.map((variant) => (
            <IconButton
              key={`toggle-${variant}`}
              variant={variant}
              icon="favorite"
              label={`Favorite (${variant} toggle)`}
              selected={toggles[variant] ?? false}
              onClick={() => setToggles((current) => ({ ...current, [variant]: !current[variant] }))}
            />
          ))}
        </div>
      </Group>

      <Group title="Floating action buttons">
        <div className="flex flex-wrap items-end gap-4">
          <Fab icon="add" label="Create" />
          <Fab icon="add" label="Create" size="medium" color="secondary" />
          <Fab icon="add" label="Create" size="large" color="tertiary" />
          <Fab icon="palette" label="Personalize" text="Personalize" />
        </div>
      </Group>

      <Group title="Chips">
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([name, selected]) => (
            <FilterChip key={name} label={name} selected={selected} onSelectedChange={(next) => setFilters((current) => ({ ...current, [name]: next }))} />
          ))}
          <AssistChip label="Open dialog" icon="send" onClick={() => setDialogOpen(true)} />
          <Chip label="Static tag" />
        </div>
      </Group>

      <Group title="Cards">
        <div className="grid gap-4 medium:grid-cols-3">
          {CARD_VARIANTS.map((variant) => (
            <Card key={variant} variant={variant} interactive className="p-6">
              <h3 className="text-title-large">{variant}</h3>
              <p className="mt-2 text-body-medium text-on-surface-variant">Hover and press it.</p>
            </Card>
          ))}
        </div>
      </Group>

      <Group title="Switch">
        <Switch label="Notifications" checked={notifications} onChange={(event) => setNotifications(event.currentTarget.checked)} />
      </Group>

      <Group title="Text fields">
        <form className="grid gap-6 medium:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
          <TextField label="Name" required supportingText="As it should appear in a reply" errorText="Enter your name" autoComplete="name" />
          <TextField label="Email" type="email" variant="outlined" required errorText="Enter a valid email address" autoComplete="email" />
          <TextArea label="Message" required errorText="Write a message" className="medium:col-span-2" />
          <TextArea label="Notes" variant="outlined" supportingText="Optional" className="medium:col-span-2" />
          <div>
            <Button type="submit" icon="send">
              Validate
            </Button>
          </div>
        </form>
      </Group>

      <Group title="Dialog">
        <Button variant="tonal" onClick={() => setDialogOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Dialog title"
          description="Native dialog: focus moves in, Esc or a click outside closes it, and focus returns to the button that opened it."
          lightDismiss
          actions={
            <>
              <Button variant="text" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="text" onClick={() => setDialogOpen(false)}>
                Confirm
              </Button>
            </>
          }
        />
      </Group>

      <Group title="Shapes">
        <div className="grid grid-cols-4 gap-4 medium:grid-cols-7">
          {SHAPE_NAMES.map((name) => (
            <figure key={name} className="space-y-2">
              <div className="aspect-square bg-primary-container" style={{ clipPath: shapeClipPath(name) }} />
              <figcaption className="text-label-medium text-on-surface-variant">{name}</figcaption>
            </figure>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShapeIndex((index) => index + 1)}
          aria-label={`Morph to the next shape, currently ${morphShape}`}
          className="block size-40 cursor-pointer rounded-full"
        >
          <span className="md-shape-morph block size-full bg-tertiary" style={{ clipPath: shapeClipPath(morphShape) }} />
        </button>
      </Group>
    </main>
  );
}