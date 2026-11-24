import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from 'react';
import type { GalleryItem } from '@/content/types';
import { Icon } from '@/ui/Icon';
import { IconButton } from '@/ui/IconButton';

/** What an item is, for labels: its alt text, or a video's title. */
const describe = (item: GalleryItem) => (item.type === 'embed' ? item.title : item.alt);

const embedThumbnail = (item: Extract<GalleryItem, { type: 'embed' }>) =>
  item.poster ?? (item.provider === 'youtube' ? `https://i.ytimg.com/vi/${item.id}/hqdefault.jpg` : undefined);

const embedSource = (item: Extract<GalleryItem, { type: 'embed' }>) =>
  item.provider === 'youtube' ? `https://www.youtube-nocookie.com/embed/${item.id}?autoplay=1&rel=0` : `https://www.loom.com/embed/${item.id}?autoplay=1`;

function Thumbnail({ item }: { item: GalleryItem }) {
  if (item.type === 'image') return <img src={item.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" />;
  const poster = item.type === 'video' ? item.poster : embedThumbnail(item);
  return (
    <>
      {poster ? (
        <img src={poster} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
      ) : item.type === 'video' ? (
        // Without a poster, the clip's first frame stands in.
        <video src={item.src} muted playsInline preload="metadata" aria-hidden="true" className="size-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center bg-surface-container-high" />
      )}
      <span aria-hidden="true" className="md-gallery-play absolute inset-0 m-auto grid size-14 place-items-center rounded-full bg-primary text-on-primary">
        <Icon name="play_arrow" fill size={28} />
      </span>
    </>
  );
}

function Viewed({ item }: { item: GalleryItem }) {
  if (item.type === 'image') return <img src={item.src} alt={item.alt} className="max-h-full max-w-full object-contain" />;
  if (item.type === 'video')
    return (
      // Short clips play muted and looping, like a GIF, with the browser's controls to pause.
      <video src={item.src} poster={item.poster} aria-label={item.alt} controls autoPlay muted loop playsInline className="max-h-full max-w-full" />
    );
  return (
    <iframe
      src={embedSource(item)}
      title={item.title}
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
      allowFullScreen
      className="aspect-video w-full max-w-[min(100%,calc((100dvh-10rem)*16/9))] rounded-xl"
    />
  );
}

/**
 * A full-screen viewer for one gallery item at a time. A native modal dialog,
 * so focus stays inside and Escape closes it. Arrow keys and swipes move
 * between items; an embed loads only while it is the one showing.
 */
function Lightbox({ items, index, onIndex, onClose }: { items: GalleryItem[]; index: number | null; onIndex: (index: number) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<number | null>(null);
  const open = index !== null;
  const item = open ? items[index] : undefined;
  // A dialog's label changing is not read out, so moving between items is announced here.
  const [announcement, setAnnouncement] = useState('');
  const step = (by: number) => {
    if (index === null) return;
    const next = (index + by + items.length) % items.length;
    const nextItem = items[next];
    onIndex(next);
    if (nextItem) setAnnouncement(`${describe(nextItem)}, ${next + 1} of ${items.length}`);
  };
  const close = () => {
    setAnnouncement('');
    onClose();
  };

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    else if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={dialog}
      aria-label={item ? `${describe(item)}, ${(index ?? 0) + 1} of ${items.length}` : 'Gallery'}
      className="md-lightbox"
      onClose={close}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') step(1);
        else if (event.key === 'ArrowLeft') step(-1);
      }}
      onPointerDown={(event: PointerEvent) => {
        swipe.current = event.clientX;
      }}
      onPointerUp={(event: PointerEvent) => {
        if (swipe.current === null) return;
        const dx = event.clientX - swipe.current;
        swipe.current = null;
        if (Math.abs(dx) > 60 && event.pointerType !== 'mouse') step(dx < 0 ? 1 : -1);
      }}
    >
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      {item && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-2 p-2">
            <p className="ps-3 text-label-large text-on-surface-variant tabular-nums">
              {(index ?? 0) + 1} / {items.length}
            </p>
            <IconButton icon="close" label="Close" onClick={close} />
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center gap-2 px-2">
            {items.length > 1 && <IconButton icon="chevron_left" label="Previous" variant="tonal" className="shrink-0" onClick={() => step(-1)} />}
            <div key={index} className="md-lightbox-item flex size-full min-w-0 items-center justify-center">
              <Viewed item={item} />
            </div>
            {items.length > 1 && <IconButton icon="chevron_right" label="Next" variant="tonal" className="shrink-0" onClick={() => step(1)} />}
          </div>
          <p className="min-h-12 px-6 py-3 text-center text-body-medium text-on-surface-variant">{item.caption}</p>
        </div>
      )}
    </dialog>
  );
}

/** A project's screenshots, clips, and demo videos, opening into the viewer. */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement[]>([]);
  const lastOpened = useRef<number | null>(null);

  // Closing returns focus to the thumbnail that was opened, even after moving through others.
  useEffect(() => {
    if (index === null && lastOpened.current !== null) opener.current[lastOpened.current]?.focus();
  }, [index]);

  return (
    <>
      <ul className="grid gap-4 medium:grid-cols-2 large:grid-cols-3">
        {items.map((item, i) => (
          <li key={`${i}-${describe(item)}`}>
            <button
              ref={(element) => {
                if (element) opener.current[i] = element;
              }}
              type="button"
              aria-label={`${item.type === 'image' ? 'View' : 'Play'} ${describe(item)}`}
              className="md-gallery-thumb state-layer relative block aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface-container"
              onClick={() => {
                lastOpened.current = i;
                setIndex(i);
              }}
            >
              <Thumbnail item={item} />
            </button>
            {item.caption && <p className="mt-2 text-body-medium text-on-surface-variant">{item.caption}</p>}
          </li>
        ))}
      </ul>
      <Lightbox
        items={items}
        index={index}
        onIndex={(next) => {
          lastOpened.current = next;
          setIndex(next);
        }}
        onClose={() => setIndex(null)}
      />
    </>
  );
}
