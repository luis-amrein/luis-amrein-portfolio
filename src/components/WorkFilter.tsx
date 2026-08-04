import { useMemo, useState } from 'react';

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

const filters = ['All', 'B2B', 'B2C', 'Marketplace', 'Data', '0→1'];

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
      <div className="project-list" aria-live="polite">
        {visibleProjects.map((project, index) => (
          <a className="project-card" href={`${base}work/${project.id}/`} key={project.id}>
            <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
            <div>
              <p className="kicker">{project.eyebrow}</p>
              <h3>{project.title}</h3>
            </div>
            <p>
              <span className="project-outcome">{project.outcomeLabel}</span>
              {project.summary}
            </p>
            <span className="arrow" aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </>
  );
}
