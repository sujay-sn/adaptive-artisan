import { Fragment } from 'react';

/**
 * A headline value such as "85% → 34%". The arrow is drawn but read as "to",
 * since screen readers otherwise say "right arrow".
 */
export function MetricValue({ value }: { value: string }) {
  return value.split('→').map((part, index) => (
    <Fragment key={index}>
      {index > 0 && (
        <>
          <span aria-hidden="true">→</span>
          <span className="sr-only">to</span>
        </>
      )}
      {part}
    </Fragment>
  ));
}
