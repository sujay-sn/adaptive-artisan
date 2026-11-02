import { forceCollide, forceLink, forceManyBody, forceRadial, forceSimulation, forceX, forceY, type SimulationLinkDatum, type SimulationNodeDatum } from 'd3-force';
import { SKILL_GRAPH, type GraphNode } from './graph';

// The constellation's physics, kept outside React. The component renders the
// SVG once; this moves it, writing positions straight to the DOM on each tick.

interface SimNode extends SimulationNodeDatum, GraphNode {
  radius: number;
}

interface SimLink extends SimulationLinkDatum<SimNode> {
  kind: 'category' | 'co-use';
  weight: number;
}

export function nodeRadius(node: GraphNode): number {
  return node.kind === 'category' ? 22 : 5 + Math.min(node.usage, 5) * 2;
}

export interface ConstellationController {
  resize: (width: number, height: number) => void;
  /** Pulls a node to the center and draws its neighbors in. Null relaxes the graph. */
  setFocus: (id: string | null) => void;
  dragStart: (id: string, x: number, y: number) => void;
  dragMove: (x: number, y: number) => void;
  /** Releases the node, which springs back into the layout. */
  dragEnd: () => void;
  dispose: () => void;
}

interface Options {
  node: (id: string) => SVGGElement | undefined;
  link: (index: number) => SVGLineElement | null | undefined;
  reducedMotion: boolean;
}

const endpointId = (end: string | number | SimNode) => (typeof end === 'object' ? end.id : String(end));
const clamp = (value: number, min: number, max: number) => Math.min(Math.max(min, max), Math.max(min, value));

export function createConstellation({ node, link, reducedMotion }: Options): ConstellationController {
  const nodes: SimNode[] = SKILL_GRAPH.nodes.map((n) => ({ ...n, radius: nodeRadius(n) }));
  const links: SimLink[] = SKILL_GRAPH.links.map((l) => ({ ...l }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  let width = 0;
  let height = 0;
  let focus: string | null = null;
  let dragged: SimNode | null = null;
  let grab = { dx: 0, dy: 0 };
  let placed = false;

  const simulation = forceSimulation<SimNode, SimLink>(nodes).alphaDecay(0.025).velocityDecay(0.35).stop();

  const draw = () => {
    for (const n of nodes) {
      const pad = n.radius + 8;
      n.x = clamp(n.x ?? width / 2, pad, width - pad);
      n.y = clamp(n.y ?? height / 2, pad, height - pad - 18);
      node(n.id)?.setAttribute('transform', `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`);
    }
    links.forEach((l, index) => {
      const element = link(index);
      const source = l.source;
      const target = l.target;
      if (!element || typeof source !== 'object' || typeof target !== 'object') return;
      element.setAttribute('x1', (source.x ?? 0).toFixed(1));
      element.setAttribute('y1', (source.y ?? 0).toFixed(1));
      element.setAttribute('x2', (target.x ?? 0).toFixed(1));
      element.setAttribute('y2', (target.y ?? 0).toFixed(1));
    });
  };
  simulation.on('tick', draw);

  const touchesFocus = (l: SimLink) => focus !== null && (endpointId(l.source) === focus || endpointId(l.target) === focus);

  const configure = () => {
    const cx = width / 2;
    const cy = height / 2;
    const ring = Math.min(width, height) * 0.34;
    simulation
      .force(
        'link',
        forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => (l.kind === 'category' ? 64 : touchesFocus(l) ? 90 : 150))
          .strength((l) => (l.kind === 'category' ? 0.5 : Math.min(0.3, 0.04 * l.weight) * (touchesFocus(l) ? 5 : 1))),
      )
      .force('charge', forceManyBody<SimNode>().strength((d) => (d.kind === 'category' ? -380 : -60)))
      .force('collide', forceCollide<SimNode>().radius((d) => d.radius + (d.kind === 'category' ? 24 : 10)).strength(0.85))
      .force('ring', forceRadial<SimNode>(ring, cx, cy).strength((d) => (d.kind === 'category' && focus === null ? 0.4 : 0)))
      .force('x', forceX<SimNode>(cx).strength((d) => (d.id === focus ? 0.35 : 0.035)))
      .force('y', forceY<SimNode>(cy).strength((d) => (d.id === focus ? 0.35 : 0.05)));
  };

  // With reduced motion, the layout is solved instantly and drawn once.
  const settle = (alpha: number) => {
    if (reducedMotion) {
      simulation.alpha(1);
      for (let i = 0; i < 300; i += 1) simulation.tick();
      draw();
      return;
    }
    simulation.alpha(alpha).restart();
  };

  return {
    resize(nextWidth, nextHeight) {
      width = nextWidth;
      height = nextHeight;
      if (!placed) {
        // Start every node near the center, so the constellation assembles outward.
        nodes.forEach((n, i) => {
          const angle = i * 2.39996;
          const distance = 6 * Math.sqrt(i);
          n.x = width / 2 + Math.cos(angle) * distance;
          n.y = height / 2 + Math.sin(angle) * distance;
        });
        placed = true;
        configure();
        draw();
        settle(1);
        return;
      }
      configure();
      settle(0.4);
    },
    setFocus(id) {
      if (id === focus) return;
      focus = id;
      if (!placed) return;
      configure();
      settle(0.6);
    },
    dragStart(id, x, y) {
      const n = byId.get(id);
      if (!n) return;
      dragged = n;
      grab = { dx: (n.x ?? x) - x, dy: (n.y ?? y) - y };
      n.fx = x + grab.dx;
      n.fy = y + grab.dy;
      if (!reducedMotion) simulation.alphaTarget(0.3).restart();
    },
    dragMove(x, y) {
      if (!dragged) return;
      dragged.fx = clamp(x + grab.dx, dragged.radius, width - dragged.radius);
      dragged.fy = clamp(y + grab.dy, dragged.radius, height - dragged.radius);
      if (reducedMotion) {
        simulation.tick();
        draw();
      }
    },
    dragEnd() {
      if (!dragged) return;
      dragged.fx = null;
      dragged.fy = null;
      dragged = null;
      if (reducedMotion) settle(1);
      else simulation.alphaTarget(0);
    },
    dispose() {
      simulation.stop();
      simulation.on('tick', null);
    },
  };
}