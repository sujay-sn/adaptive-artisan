import { useMediaQuery } from '@/lib/useMediaQuery';
import { Button } from '@/ui/Button';
import { Card } from '@/ui/Card';
import { AssistChip } from '@/ui/Chip';
import { categoryLabel, graphNode, relatedTo, usesOf, type GraphNode } from './graph';
import { showProjectsFor, useSkillStore } from './store';

const list = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

function SkillInfo({ node, selected }: { node: GraphNode; selected: boolean }) {
  const select = useSkillStore((state) => state.select);
  const uses = usesOf(node.id);
  const related = relatedTo(node.id).slice(0, 8);
  const projectCount = uses.filter((use) => use.kind === 'project').length;
  return (
    <>
      <p className="text-label-medium text-on-surface-variant">{categoryLabel(node.category)}</p>
      <h3 className="mt-1 font-display text-headline-small text-on-surface">{node.label}</h3>
      <p className="mt-3 text-body-medium text-on-surface">
        {uses.length > 0 ? `Used in ${list.format(uses.map((use) => use.label))}.` : 'On my resume, but not tied to a role or project on this page.'}
      </p>
      {related.length > 0 && (
        <div className="mt-4">
          <p className="text-label-medium text-on-surface-variant">Used with</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {related.map((other) => (
              <AssistChip key={other.id} label={other.label} onClick={() => select(other.id)} />
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-2">
        {projectCount > 0 && (
          <Button variant="tonal" icon="folder" onClick={() => showProjectsFor(node.id)}>
            {projectCount === 1 ? 'See the project' : `See ${projectCount} projects`}
          </Button>
        )}
        {selected && (
          <Button variant="text" onClick={() => select(null)}>
            Clear
          </Button>
        )}
      </div>
    </>
  );
}

function CategoryInfo({ node, selected }: { node: GraphNode; selected: boolean }) {
  const select = useSkillStore((state) => state.select);
  const members = relatedTo(node.id);
  return (
    <>
      <p className="text-label-medium text-on-surface-variant">Category</p>
      <h3 className="mt-1 font-display text-headline-small text-on-surface">{node.label}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {members.map((member) => (
          <AssistChip key={member.id} label={member.label} onClick={() => select(member.id)} />
        ))}
      </div>
      {selected && (
        <Button className="mt-5" variant="text" onClick={() => select(null)}>
          Clear
        </Button>
      )}
    </>
  );
}

/**
 * What the active skill was used in and with. On large screens it follows
 * the pointer; elsewhere it shows only the selection, so the layout never
 * shifts under the cursor.
 */
export function SkillDetail({ className = '' }: { className?: string }) {
  const followsHover = useMediaQuery('(width >= 75rem)');
  const hovered = useSkillStore((state) => state.hovered);
  const selected = useSkillStore((state) => state.selected);
  const id = (followsHover ? hovered : null) ?? selected;
  const node = id ? graphNode(id) : undefined;
  const selectedNode = selected ? graphNode(selected) : undefined;

  return (
    <aside aria-label="Skill details" className={className}>
      <Card variant="filled" className="min-h-40 rounded-xl p-5">
        {!node && <p className="text-body-medium text-on-surface-variant">Select a skill to see where I used it and what I used it with.</p>}
        {node?.kind === 'skill' && <SkillInfo node={node} selected={node.id === selected} />}
        {node?.kind === 'category' && <CategoryInfo node={node} selected={node.id === selected} />}
      </Card>
      <p className="sr-only" aria-live="polite">
        {selectedNode ? `${selectedNode.label} selected` : ''}
      </p>
    </aside>
  );
}