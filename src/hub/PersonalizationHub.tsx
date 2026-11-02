import { Tabs } from '@base-ui/react/tabs';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { IconButton } from '@/ui/IconButton';
import { ColorPanel } from './ColorPanel';
import { HubPreview } from './HubPreview';
import { IconPanel } from './IconPanel';
import { hubMounted, type HubProps } from './launcher';
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

/**
 * The Personalization Hub: a native modal dialog with controls on one side
 * and a live preview on the other. Opening and closing are animated by the
 * launcher's container transform, not by the dialog itself.
 */
export function PersonalizationHub({ open, onRequestClose }: HubProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [tab, setTab] = useState<TabValue>('color');

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

  return (
    <dialog
      ref={ref}
      closedby="any"
      aria-labelledby="hub-title"
      className="md-dialog md-hub"
      onCancel={(event) => {
        // Esc and clicks outside close through the launcher, so the hub morphs back into its FAB.
        event.preventDefault();
        onRequestClose();
      }}
    >
      <header className="flex shrink-0 items-center gap-2 ps-6 pe-3 pt-4 pb-2">
        <h2 id="hub-title" className="font-display text-headline-small text-on-surface">
          Personalize
        </h2>
        <IconButton className="ms-auto" icon="close" label="Close" onClick={onRequestClose} />
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
        <aside aria-label="Live preview" className="border-t border-outline-variant px-6 py-8 expanded:min-h-0 expanded:overflow-y-auto expanded:border-t-0 expanded:border-s">
          <HubPreview />
        </aside>
      </div>
    </dialog>
  );
}