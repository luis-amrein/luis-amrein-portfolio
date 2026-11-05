import { useMemo, useState } from 'react';
import BookProjects from './BookProjects';

type Project = {
  id: string;
  title: string;
  eyebrow: string;
  summary: string;
  outcomeLabel: string;
  outcome: string;
  tags: string[];
};

type Props = {
  projects: Project[];
  base: string;
};

const filters = ['All', 'B2B', 'B2C', 'Mobile', 'Marketplace', 'Data', '0→1'];

export default function WorkFilter({ projects, base }: Props) {
  const [activeFilter, setActiveFilter] = useState('All');
  const visibleProjects = useMemo(
    () =>
      activeFilter === 'All'
        ? projects
        : projects.filter((project) => project.tags.includes(activeFilter)),
    [activeFilter, projects],
  );

  return (
    <>
      <div className="filters" aria-label="Filter projects">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className="filter-button"
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div aria-live="polite"><BookProjects projects={visibleProjects} base={base} /></div>
    </>
  );
}
