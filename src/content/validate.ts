import { awards, certifications, copy, education, experience, profile, projects, routine, skillCategories, skills } from '@/data';

/**
 * Checks src/data.ts for mistakes TypeScript can't see: references that point
 * nowhere, ids that collide, and values the page depends on. Returns one
 * plain message per problem, naming the item, or nothing when all is well.
 * Runs in the tests and in every build (scripts/prerender.mjs), so a broken
 * edit stops the build instead of quietly breaking the page.
 */
export function validateContent(): string[] {
  const problems: string[] = [];
  const problem = (message: string) => problems.push(message);

  const duplicates = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) problem(`${label}: the id "${id}" is used more than once. Every id must be unique.`);
      seen.add(id);
    }
  };
  duplicates('skills', skills.map((skill) => skill.id));
  duplicates('projects', projects.map((project) => project.id));
  duplicates('experience', experience.map((role) => role.id));
  duplicates('education', education.map((degree) => degree.id));
  duplicates('skillCategories', skillCategories.map((category) => category.id));

  // Tags must name real skills, or the evidence quietly goes missing.
  const skillIds = new Set(skills.map((skill) => skill.id));
  const unknownSkills = (where: string, ids: string[]) => {
    for (const id of ids) if (!skillIds.has(id)) problem(`${where} is tagged with the skill "${id}", which isn't in \`skills\`. Add it there, or fix the spelling.`);
  };
  for (const role of experience) unknownSkills(`experience "${role.id}"`, role.skills);
  for (const project of projects) unknownSkills(`project "${project.id}"`, project.skills);

  const isUrl = (value: string) => /^https?:\/\/\S+$/.test(value);
  const isPublicPath = (value: string) => /^\/[^\s]+$/.test(value);

  for (const project of projects) {
    // The id goes in share links (?project=...), so it has to be URL-safe.
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(project.id)) problem(`project "${project.id}": ids may only use lowercase letters, numbers, and single hyphens, like "my-project".`);
    if (project.repoUrl && !isUrl(project.repoUrl)) problem(`project "${project.id}": repoUrl must be a full https:// address.`);
    if (project.demoUrl && !isUrl(project.demoUrl)) problem(`project "${project.id}": demoUrl must be a full https:// address.`);
    if (project.media && !isPublicPath(project.media.poster)) problem(`project "${project.id}": media.poster must be a path in public/, starting with "/", like "/burrow.webp".`);
    if (project.media?.video && !isPublicPath(project.media.video)) problem(`project "${project.id}": media.video must be a path in public/, starting with "/".`);
    if (project.skills.length === 0) problem(`project "${project.id}": tag at least one skill, so it shows up when that skill is selected.`);
    if (project.headline && (!project.headline.value.trim() || !project.headline.label.trim())) problem(`project "${project.id}": headline needs both a value and a label.`);
    (project.gallery ?? []).forEach((item, index) => {
      const where = `project "${project.id}", gallery item ${index + 1}`;
      if (item.type === 'embed') {
        if (!/^[A-Za-z0-9_-]{6,64}$/.test(item.id)) problem(`${where}: "${item.id}" doesn't look like a ${item.provider} video id. Use only the id, not the whole link.`);
        if (!item.title.trim()) problem(`${where}: give the video a title.`);
        if (item.poster && !isPublicPath(item.poster)) problem(`${where}: poster must be a path in public/, starting with "/".`);
        return;
      }
      if (!isPublicPath(item.src)) problem(`${where}: src must be a path in public/, starting with "/", like "/projects/${project.id}/screen.webp".`);
      if (!item.alt.trim()) problem(`${where}: alt text is required; describe what the ${item.type} shows.`);
      if (item.type === 'video' && item.poster && !isPublicPath(item.poster)) problem(`${where}: poster must be a path in public/, starting with "/".`);
    });
  }
  const featured = projects.filter((project) => project.featured).length;
  if (featured > 6) problem(`projects: ${featured} are marked featured; the home page shows up to six.`);

  const yearMonth = /^\d{4}-(0[1-9]|1[0-2])$/;
  for (const degree of education) {
    if (!yearMonth.test(degree.start) || !yearMonth.test(degree.end)) problem(`education "${degree.id}": start and end must be "YYYY-MM", like "2024-09".`);
    else if (degree.start > degree.end) problem(`education "${degree.id}": start (${degree.start}) is after end (${degree.end}).`);
    if (!degree.gpa.includes('/')) problem(`education "${degree.id}": gpa must be written as "score / scale", like "3.72 / 4.0".`);
  }

  for (const category of skillCategories) {
    if (/\s/.test(category.short)) problem(`skill category "${category.id}": short must be one word; it sets the large category filter.`);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) problem(`profile: "${profile.email}" doesn't look like an email address.`);
  for (const [field, value] of [['github', profile.github], ['linkedin', profile.linkedin], ...(profile.resumeUrl ? [['resumeUrl', profile.resumeUrl]] : [])] as const) {
    if (!isUrl(value)) problem(`profile: ${field} must be a full https:// address.`);
  }
  if (profile.photo && !isPublicPath(profile.photo)) problem('profile: photo must be a path in public/, starting with "/".');
  for (const [field, value] of Object.entries(copy)) if (!value.trim()) problem(`copy: ${field} is empty.`);

  duplicates('awards', awards.map((award) => award.id));
  duplicates('certifications', certifications.map((certification) => certification.id));
  const roleIds = new Set(experience.map((role) => role.id));
  for (const award of awards) {
    if (!award.title.trim() || !award.from.trim() || !award.reason.trim()) problem(`award "${award.id}": title, from, and reason are all required.`);
    if (!yearMonth.test(award.date)) problem(`award "${award.id}": date must be "YYYY-MM", like "2023-06".`);
    if (award.role && !roleIds.has(award.role)) problem(`award "${award.id}": role "${award.role}" isn't an id in \`experience\`.`);
    if (award.url && !isUrl(award.url)) problem(`award "${award.id}": url must be a full https:// address.`);
    if (award.type !== undefined && !award.type.trim()) problem(`award "${award.id}": type is empty; remove it or name the award's kind, like "Thank You".`);
    if (award.document && !(isPublicPath(award.document) && /\.(pdf|png|jpe?g|webp)$/i.test(award.document))) problem(`award "${award.id}": document must be a PDF or image in public/, starting with "/", like "/awards/${award.id}.pdf".`);
  }
  for (const certification of certifications) {
    const where = `certification "${certification.id}"`;
    if (!certification.name.trim() || !certification.issuer.trim()) problem(`${where}: name and issuer are both required.`);
    if (!yearMonth.test(certification.issued) || (certification.expires && !yearMonth.test(certification.expires))) problem(`${where}: issued and expires must be "YYYY-MM", like "2025-01".`);
    else if (certification.expires && certification.expires <= certification.issued) problem(`${where}: expires (${certification.expires}) must be after issued (${certification.issued}).`);
    if (!isUrl(certification.verifyUrl)) problem(`${where}: verifyUrl must be a full https:// address, such as the Credly badge page.`);
    if (certification.badge && !isPublicPath(certification.badge)) problem(`${where}: badge must be a path in public/, starting with "/".`);
    unknownSkills(where, certification.skills);
  }

  // The footer looks up the block for every hour, so the day has to start at 0 and move forward.
  const blocks = routine.blocks;
  if (blocks.length === 0) problem('routine: add at least one block.');
  else if (blocks[0]!.from !== 0) problem(`routine: the first block must start at hour 0 (it starts at ${blocks[0]!.from}).`);
  blocks.forEach((block, i) => {
    if (!Number.isInteger(block.from) || block.from < 0 || block.from > 23) problem(`routine: "${block.scene}" starts at ${block.from}; hours run from 0 to 23.`);
    const previous = blocks[i - 1];
    if (previous && block.from <= previous.from) problem(`routine: "${block.scene}" starts at ${block.from}, not after "${previous.scene}" at ${previous.from}. List blocks in order of hour.`);
  });
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: routine.timeZone });
  } catch {
    problem(`routine: "${routine.timeZone}" isn't a time zone. Use one like "America/New_York".`);
  }

  return problems;
}

/**
 * Entries still marked `example: true`, as reminders. The build prints these
 * but doesn't stop: examples are there to develop against until the real
 * entries are in.
 */
export function contentWarnings(): string[] {
  return [
    ...awards.filter((award) => award.example).map((award) => `award "${award.id}" is an example placeholder; replace it with a real award.`),
    ...certifications.filter((c) => c.example).map((c) => `certification "${c.id}" is an example placeholder; replace it with a real certification.`),
  ];
}
