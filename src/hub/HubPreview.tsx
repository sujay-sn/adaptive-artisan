import { useState } from 'react';
import { profile } from '@/content/profile';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { Chip, FilterChip } from '@/ui/Chip';
import { Fab } from '@/ui/Fab';
import { Switch } from '@/ui/Switch';
import { TextField } from '@/ui/TextField';

/** The real components on the live theme, so every change shows up somewhere concrete. */
export function HubPreview() {
  const [selected, setSelected] = useState(true);
  const [notifications, setNotifications] = useState(true);
  return (
    <div className="space-y-5">
      <p className="text-title-medium text-on-surface">Live preview</p>
      <Card variant="filled" tone="primary" className="rounded-xl p-5">
        <p className="font-display text-headline-small">{profile.name}</p>
        <p className="mt-1 text-body-medium">{profile.role}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button icon="description">Resume</Button>
          <Button variant="outlined">GitHub</Button>
        </div>
      </Card>
      <Card variant="outlined" className="rounded-lg-plus p-5">
        <p className="text-title-medium">Burrow Housing</p>
        <p className="mt-1 text-body-medium text-on-surface-variant">Sublease marketplace with geospatial search.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterChip label="React" selected={selected} onSelectedChange={setSelected} />
          <Chip label="MongoDB" />
        </div>
      </Card>
      <TextField label="Email" type="email" variant="outlined" autoComplete="off" />
      <div className="flex items-center justify-between gap-4">
        <Switch label="Notifications" checked={notifications} onChange={(event) => setNotifications(event.currentTarget.checked)} />
        <Fab icon="add" label="Add" />
      </div>
    </div>
  );
}