import { useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { useMediaQuery } from '@/lib/useMediaQuery';
import { categoryLabel, neighborhood, SKILL_GRAPH, type GraphNode } from './graph';
import { canvasHeight, createConstellation, hasQuietLabel, nodeRadius, QUIET_LABELS_BELOW, type ConstellationController } from './simulation';
import { useSkillStore } from './store';

// The three accent palettes, rotated through the categories.
const TONES = ['primary', 'secondary', 'tertiary'] as const;
const CATEGORY_ORDER = [...new Set(SKILL_GRAPH.nodes.map((node) => node.category))];
const toneOf = (node: GraphNode) => TONES[CATEGORY_ORDER.indexOf(node.category) % TONES.length];

function describe(node: GraphNode): string {
  if (node.kind === 'category') return `${node.label}, category`;
  const uses = node.usage === 0 ? 'on the resume' : `used in ${node.usage} ${node.usage === 1 ? 'role or project' : 'roles and projects'}`;
  return `${node.label}, ${categoryLabel(node.category)}, ${uses}`;
}

interface Press {
  id: string;
  pointerId: number;
  x: number;
  y: number;
  moved: boolean;
}

/**
 * The skills constellation: a force-directed graph where categories anchor
 * their skills and lines join skills used together. Drag a node and it
 * springs back; select one and the graph reorganizes around it. Arrow keys
 * move between nodes, Enter selects, Escape clears.
 */
export default function Constellation() {
  const wrapper = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nodeElements = useRef(new Map<string, SVGGElement>());
  const linkElements = useRef<Array<SVGLineElement | null>>([]);
  const controller = useRef<ConstellationController | null>(null);
  const press = useRef<Press | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const hovered = useSkillStore((state) => state.hovered);
  const selected = useSkillStore((state) => state.selected);
  const hover = useSkillStore((state) => state.hover);
  const select = useSkillStore((state) => state.select);

  useLayoutEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const width = Math.round(entry.contentRect.width);
      setSize({ width, height: canvasHeight(width) });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const instance = createConstellation({
      node: (id) => nodeElements.current.get(id),
      link: (index) => linkElements.current[index],
      reducedMotion,
    });
    controller.current = instance;
    return () => {
      instance.dispose();
      controller.current = null;
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (size) controller.current?.resize(size.width, size.height);
  }, [size, reducedMotion]);

  useLayoutEffect(() => {
    controller.current?.setFocus(selected);
  }, [selected, reducedMotion]);

  const toSvg = (event: PointerEvent) => {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return null;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: point.x, y: point.y };
  };

  const onPointerDown = (event: PointerEvent<SVGGElement>, id: string) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    press.current = { id, pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
  };

  const onPointerMove = (event: PointerEvent<SVGGElement>, id: string) => {
    const current = press.current;
    if (!current || current.id !== id || current.pointerId !== event.pointerId) return;
    // A few pixels of slack, so a click is still a click.
    if (!current.moved && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 4) return;
    const point = toSvg(event);
    if (!point) return;
    if (!current.moved) {
      current.moved = true;
      controller.current?.dragStart(id, point.x, point.y);
    } else {
      controller.current?.dragMove(point.x, point.y);
    }
  };

  const onPointerUp = (id: string) => {
    const current = press.current;
    press.current = null;
    if (!current || current.id !== id) return;
    if (current.moved) controller.current?.dragEnd();
    else select(selected === id ? null : id);
  };

  const onLostPointerCapture = () => {
    if (press.current?.moved) controller.current?.dragEnd();
    press.current = null;
  };

  const moveFocus = (index: number) => {
    const id = SKILL_GRAPH.nodes[index]?.id;
    if (!id) return;
    setFocusIndex(index);
    nodeElements.current.get(id)?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<SVGGElement>, index: number, id: string) => {
    const last = SKILL_GRAPH.nodes.length - 1;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(Math.min(last, index + 1));
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(Math.max(0, index - 1));
        break;
      case 'Home':
        event.preventDefault();
        moveFocus(0);
        break;
      case 'End':
        event.preventDefault();
        moveFocus(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(selected === id ? null : id);
        break;
      case 'Escape':
        select(null);
        break;
    }
  };

  const active = hovered ?? selected;
  const lit = active ? neighborhood(active) : null;
  // On smaller canvases, rarely used skills keep their labels hidden until lit, so the rest stay readable.
  const quiet = size !== null && size.width < QUIET_LABELS_BELOW;

  return (
    <div ref={wrapper} className="w-full">
      {size && (
        <svg
          ref={svg}
          viewBox={`0 0 ${size.width} ${size.height}`}
          width={size.width}
          height={size.height}
          role="group"
          aria-label="Skills constellation"
          aria-describedby="constellation-help"
          className="block max-w-full overflow-visible"
        >
          <g aria-hidden="true">
            {SKILL_GRAPH.links.map((link, index) => {
              const on = active !== null && (link.source === active || link.target === active);
              return (
                <line
                  key={`${link.source}|${link.target}`}
                  ref={(element) => {
                    linkElements.current[index] = element;
                  }}
                  className={`md-constellation-link is-${link.kind} ${on ? 'is-lit' : lit ? 'is-dim' : ''}`}
                  strokeWidth={link.kind === 'co-use' ? Math.min(3, 0.75 + link.weight * 0.6) : 1}
                />
              );
            })}
          </g>
          <g>
            {SKILL_GRAPH.nodes.map((node, index) => {
              const radius = nodeRadius(node);
              const state = [
                node.id === active ? 'is-active' : '',
                node.id === selected ? 'is-selected' : '',
                lit && !lit.has(node.id) ? 'is-dim' : '',
                quiet && hasQuietLabel(node) && !lit?.has(node.id) ? 'is-quiet' : '',
              ].join(' ');
              return (
                <g
                  key={node.id}
                  ref={(element) => {
                    if (element) nodeElements.current.set(node.id, element);
                    else nodeElements.current.delete(node.id);
                  }}
                  role="button"
                  tabIndex={index === focusIndex ? 0 : -1}
                  aria-pressed={node.id === selected}
                  aria-label={describe(node)}
                  className={`md-constellation-node is-${node.kind} tone-${toneOf(node)} ${state}`}
                  onPointerDown={(event) => onPointerDown(event, node.id)}
                  onPointerMove={(event) => onPointerMove(event, node.id)}
                  onPointerUp={() => onPointerUp(node.id)}
                  onLostPointerCapture={onLostPointerCapture}
                  onPointerEnter={() => hover(node.id)}
                  onPointerLeave={() => hover(null)}
                  onFocus={() => {
                    setFocusIndex(index);
                    hover(node.id);
                  }}
                  onBlur={() => hover(null)}
                  onKeyDown={(event) => onKeyDown(event, index, node.id)}
                >
                  <circle r={radius + 10} className="md-constellation-hit" />
                  <circle r={radius} className="md-constellation-dot" />
                  <text y={radius + (node.kind === 'category' ? 20 : 14)} textAnchor="middle" className="md-constellation-label">
                    {node.label}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      )}
      <p id="constellation-help" className="sr-only">
        Arrow keys move between skills. Enter selects one and shows where it was used. Escape clears the selection.
      </p>
    </div>
  );
}
