import { useState } from 'react';

const principles = [
  {
    title: 'Start with the real problem',
    quote: 'A clean problem statement is already half a product strategy.',
    detail:
      'I use research, data, and direct conversations to separate symptoms from causes before a team commits to a solution.',
  },
  {
    title: 'Build to learn, then ship',
    quote: 'Prototypes answer questions. Production code earns trust.',
    detail:
      'I build working prototypes to test ideas early—then turn the right ones into production-ready software that teams can ship and maintain.',
  },
  {
    title: 'Make trade-offs visible',
    quote: 'Prioritisation is a conversation about evidence, risk, and intent.',
    detail:
      'Roadmaps become useful when people can see why one bet matters more than another—and what we deliberately chose not to do.',
  },
  {
    title: 'Bring the team into the thinking',
    quote: 'The best product decisions are made with a team, not handed to one.',
    detail:
      'I create enough structure for designers, engineers, and stakeholders to challenge assumptions and improve the direction together.',
  },
  {
    title: 'Measure the change',
    quote: 'Shipping is a milestone. Changed behaviour is the outcome.',
    detail:
      'I define success before delivery, instrument what matters, and use both quantitative signals and qualitative context to learn.',
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
        <blockquote>“{principle.quote}”</blockquote>
        <p>{principle.detail}</p>
      </div>
    </div>
  );
}
