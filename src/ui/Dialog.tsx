import { useEffect, useId, useRef, type ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: ReactNode;
  /** A sheet slides in from the start edge, for navigation. */
  variant?: 'basic' | 'sheet';
  /** Also close on a click outside, not just Esc. Progressive: Safari supports Esc only. */
  lightDismiss?: boolean;
  className?: string;
}

/**
 * MD3 dialog on the native <dialog> element. The browser provides the inert
 * page, focus containment, top-layer stacking, Esc to close, and focus return
 * to the control that opened it, so none of that is reimplemented here.
 */
export function Dialog({ open, onClose, title, description, children, actions, variant = 'basic', lightDismiss = false, className = '' }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);


  return (
    <dialog
      ref={ref}
      closedby={lightDismiss ? 'any' : 'closerequest'}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      className={`md-dialog ${variant === 'sheet' ? 'md-dialog-sheet' : ''} ${className}`}
    >
      <div className="flex max-h-[inherit] flex-col">
        <div className="px-6 pt-6 pb-4">
          <h2 id={titleId} className="font-display text-headline-small text-on-surface">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-4 text-body-medium text-on-surface-variant">
              {description}
            </p>
          )}
        </div>
        {children && <div className="min-h-0 flex-1 overflow-y-auto px-6">{children}</div>}
        {actions && <div className="flex flex-wrap justify-end gap-2 px-6 pt-4 pb-6">{actions}</div>}
      </div>
    </dialog>
  );
}