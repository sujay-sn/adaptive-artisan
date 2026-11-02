interface SeedSwatchProps {
  hex: string;
  /** Accessible name, such as "Lagoon color theme". */
  label: string;
  selected: boolean;
  onSelect: (element: HTMLElement) => void;
}

/** A round color button for choosing a theme seed. */
export function SeedSwatch({ hex, label, selected, onSelect }: SeedSwatchProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      onClick={(event) => onSelect(event.currentTarget)}
      className="state-layer grid size-12 cursor-pointer place-items-center rounded-full text-on-surface"
    >
      <span className={`block size-8 rounded-full ${selected ? 'outline-2 outline-offset-2 outline-on-surface' : ''}`} style={{ backgroundColor: hex }} />
    </button>
  );
}