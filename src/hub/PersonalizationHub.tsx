import { Tabs } from '@base-ui/react/tabs';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { flushSync } from 'react-dom';
import { scopedAppearanceVars } from '@/preferences/appearance';
import { themeDeclarations } from '@/theme/engine';
import { originFromElement, withThemeReveal } from '@/theme/reveal';
import { Button } from '@/ui/Button';
import { Dialog } from '@/ui/Dialog';
import { IconButton } from '@/ui/IconButton';
import { ColorPanel } from './ColorPanel';
import { applyLook, changesAppearance, differsFromApplied, lookOf, resolveScheme, useDraft } from './draft';
import { HubPreview } from './HubPreview';
import { IconPanel } from './IconPanel';
import { hubMounted, hubOrigin, onBeforeHubOpens, type HubProps } from './launcher';
import { MotionPanel } from './MotionPanel';
import { loadPlaygroundFont } from './playgroundFont';
import { TypePanel } from './TypePanel';

const TABS = [
  { value: 'color', label: 'Color' },
  { value: 'type', label: 'Type' },
  { value: 'icons', label: 'Icons' },
  { value: 'motion', label: 'Motion and sound' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

onBeforeHubOpens(() => useDraft.getState().reset());

/**
 * The Personalization Hub: a native modal dialog with controls on one side
 * and a preview on the other. Opening and closing are animated by the
 * launcher's container transform, not by the dialog itself.
 *
 * Everything in it edits a draft (./draft.ts), and the page changes only on
 * Apply. The draft's colors, light or dark, and motion scheme cover the whole
 * hub. Its type and icon axes reach only the preview pane and each panel's
 * samples, so the controls stay readable however far an axis is pushed.
 */
export function PersonalizationHub({ open, onRequestClose }: HubProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<TabValue>('color');
  const [confirming, setConfirming] = useState(false);
  const draft = useDraft();
  const look = lookOf(draft);
  const dirty = differsFromApplied(look);
  const dark = resolveScheme(look.colorScheme) === 'dark';

  const themeCss = useMemo(() => `.md-hub {\n${themeDeclarations(draft.theme)}\n}`, [draft.theme]);

  useLayoutEffect(() => {
    hubMounted();
  }, []);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open) loadPlaygroundFont();
  }, [open]);

  /** Back into the FAB, with the hub showing the applied look again so the morph lands on it. */
  const close = async () => {
    flushSync(() => {
      setConfirming(false);
      useDraft.getState().reset();
    });
    await onRequestClose();
  };

  const requestClose = () => {
    if (differsFromApplied(lookOf(useDraft.getState()))) setConfirming(true);
    else void close();
  };

  const apply = async () => {
    const next = lookOf(useDraft.getState());
    if (!differsFromApplied(next)) {
      await close();
      return;
    }
    // Close first, then let the new look sweep across the page from the FAB
    // the hub went back into. A motion-only change has nothing to reveal.
    const visible = changesAppearance(next);
    const from = hubOrigin();
    flushSync(() => setConfirming(false));
    await onRequestClose();
    if (visible) withThemeReveal(originFromElement(from), () => applyLook(next));
    else applyLook(next);
  };

  return (
    <dialog
      ref={ref}
      closedby="any"
      aria-labelledby="hub-title"
      className="md-dialog md-hub"
      data-type-scope=""
      data-motion-scheme={draft.motionScheme}
      style={{ colorScheme: look.colorScheme === 'system' ? 'light dark' : look.colorScheme, '--md-text-weight': dark ? 380 : 400 } as CSSProperties}
      onCancel={(event) => {
        // Esc and clicks outside close through the launcher, so the hub morphs back into its FAB.
        event.preventDefault();
        requestClose();
      }}
    >
      <style>{themeCss}</style>
      <header className="flex shrink-0 items-center gap-2 ps-6 pe-3 pt-4 pb-2">
        <h2 id="hub-title" className="font-display text-headline-small text-on-surface">
          Personalize
        </h2>
        <IconButton className="ms-auto" icon="close" label="Close" onClick={requestClose} />
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto expanded:grid expanded:grid-cols-[minmax(0,1fr)_22rem] expanded:overflow-hidden">
        <Tabs.Root value={tab} onValueChange={(value) => setTab(value as TabValue)} className="expanded:min-h-0 expanded:overflow-y-auto">
          <Tabs.List className="md-tabs sticky top-0 z-10 flex gap-1 overflow-x-auto bg-surface-container-high px-3">
            {TABS.map(({ value, label }) => (
              <Tabs.Tab key={value} value={value} className="md-tab state-layer">
                {label}
              </Tabs.Tab>
            ))}
            <Tabs.Indicator className="md-tab-indicator" />
          </Tabs.List>
          <div className="px-6 py-8">
            <Tabs.Panel value="color">
              <ColorPanel />
            </Tabs.Panel>
            <Tabs.Panel value="type">
              <TypePanel />
            </Tabs.Panel>
            <Tabs.Panel value="icons">
              <IconPanel />
            </Tabs.Panel>
            <Tabs.Panel value="motion">
              <MotionPanel />
            </Tabs.Panel>
          </div>
        </Tabs.Root>
        <aside
          aria-label="Preview"
          data-type-scope=""
          style={scopedAppearanceVars(draft.typeAxes, draft.iconAxes) as CSSProperties}
          className="border-t border-outline-variant px-6 py-8 expanded:min-h-0 expanded:overflow-y-auto expanded:border-t-0 expanded:border-s"
        >
          <HubPreview />
        </aside>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-outline-variant px-6 py-3">
        <p className="me-auto text-body-medium text-on-surface-variant" aria-live="polite">
          {dirty ? 'Not applied yet. Apply to use it across the site.' : ''}
        </p>
        <Button variant="text" onClick={() => void close()}>
          Cancel
        </Button>
        <Button disabled={!dirty} onClick={() => void apply()}>
          Apply
        </Button>
      </footer>

      <Dialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Apply your changes?"
        description="You changed the look here, but the site still shows the old one."
        actions={
          <>
            <Button variant="text" onClick={() => setConfirming(false)}>
              Keep editing
            </Button>
            <Button variant="text" onClick={() => void close()}>
              Discard
            </Button>
            <Button variant="text" onClick={() => void apply()}>
              Apply
            </Button>
          </>
        }
      />
    </dialog>
  );
}
