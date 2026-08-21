import { useState } from 'react';

const principles = [
  {
    title: 'Start with the real problem',
    detail:
      'I write down constraints, users, and what “good” looks like before a solution. That can be a requirements list from the people who will use the product, conversion data plus session replays, or time sitting with operations. The aim is to separate symptoms from causes so the team is not solving the wrong thing.',
  },
  {
    title: 'Build to learn, then ship',
    detail:
      'I prototype while the question is still open — four generations of a physical knee, an expanded marketplace demo, a native app I can install. When the bet is clear, I turn it into production-ready work: tickets, specs, and code a team can maintain.',
  },
  {
    title: 'Make trade-offs visible',
    detail:
      'I make the “why this, not that” explicit: a roadmap, a PRD, or a short list of what we are deliberately not doing. Stability versus activity, speed versus data quality, polish versus a believable investor story. A visible trade-off can be challenged. A hidden one cannot.',
  },
  {
    title: 'Bring the team into the thinking',
    detail:
      'I work as the product contact, not the sole decision-maker. Designers, engineers, and stakeholders get a backlog, acceptance criteria, and a shared problem statement so they can challenge the direction while it is still movable.',
  },
  {
    title: 'Measure the change',
    detail:
      'I define what should move before we build, then check it after — quantitative signals where they exist, qualitative feedback where they do not. An experiment, a field constraint, or someone actually using the thing all count.',
  },
];

export default function ProductPrinciples() {
  const [selected, setSelected] = useState(0);
  const principle = principles[selected];

  return (
    <div className="principles">
      <div className="principle-tabs" role="tablist" aria-label="Product principles">
        {principles.map((item, index) => (
          <button
            className="principle-tab"
            type="button"
            role="tab"
            id={`principle-tab-${index}`}
            aria-controls="principle-panel"
            aria-selected={selected === index}
            key={item.title}
            onClick={() => setSelected(index)}
          >
            <span>{item.title}</span>
            <span aria-hidden="true">0{index + 1}</span>
          </button>
        ))}
      </div>
      <div
        className="principle-copy"
        role="tabpanel"
        id="principle-panel"
        aria-labelledby={`principle-tab-${selected}`}
        tabIndex={0}
      >
        <h3>{principle.title}</h3>
        <p>{principle.detail}</p>
      </div>
    </div>
  );
}
