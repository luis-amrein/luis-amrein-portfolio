---
title: MEDWING Registration
eyebrow: Growth · Experimentation · B2C
summary: Improving how healthcare job seekers move from first visit to a qualified registration.
year: "2022"
order: 4
featured: false
tags: ["B2C", "Data"]
role: Associate Product Manager
challenge: Increase visitor-to-hot-lead conversion without sacrificing the candidate information needed for matching.
outcome: Increased user-to-lead conversion by 40% through iterative registration experiments.
outcomeLabel: +40% user → lead
status: needs-update
showcaseTitle: Registration flow
showcaseLabel: Product screens
showcase:
  - type: image
    frame: phone
    src: work/medwing-registration/screen-01.jpg
    alt: MEDWING registration start asking which healthcare area the candidate is looking for
    caption: Job area
  - type: image
    frame: phone
    src: work/medwing-registration/screen-02.jpg
    alt: Step asking which facility type the candidate wants to work in
    caption: Facility type
  - type: image
    frame: phone
    src: work/medwing-registration/screen-03.jpg
    alt: Multi-select step for specialist departments of interest
    caption: Departments
  - type: image
    frame: phone
    src: work/medwing-registration/screen-04.jpg
    alt: Step asking preferred employment relationship
    caption: Employment type
  - type: image
    frame: phone
    src: work/medwing-registration/screen-05.jpg
    alt: Location step with city or postcode preference
    caption: Location
  - type: image
    frame: phone
    src: work/medwing-registration/screen-06.jpg
    alt: Email capture after shortlisting matching positions
    caption: Email capture
---

## The situation

MEDWING connects healthcare professionals with job opportunities. Registration had to do two things that naturally compete: feel quick and relevant to a candidate while capturing enough information to create a useful lead.

I took over an existing A/B-testing setup focused on improving visitor-to-hot-lead conversion.

## How I approached it

I combined behavioural data with close observation of the journey. Quantitative signals showed where conversion changed; session replays and qualitative feedback helped explain why.

- Analysed funnel behaviour and identified high-friction steps.
- Formed hypotheses from quantitative data, session replays, and user feedback.
- Implemented tailored user flows with custom JavaScript.
- Ran iterative A/B tests on sequencing, copy, and interaction details.
- Reviewed experiment results and used the learning to shape the next test.

## Product judgment

Removing fields is an easy growth tactic, but it can simply move the cost downstream. A shorter form that produces an unusable candidate profile is not a better product.

The work therefore focused on progressive, relevant data capture: asking the right question at the right point and making the value of answering clear to the job seeker.

## What changed

The work increased user-to-lead conversion by 40%. Beyond the metric, the team gained a more systematic loop from evidence to hypothesis to experiment — registration variants could be tailored and evaluated using conversion data and direct observations of user behaviour.

## Tools

Looker, Mixpanel, Fullstory, Heyflow, Miro, and JavaScript.

## What I would add now

The next revision should include the strongest winning test, its sample size, confidence level, and any measured impact on downstream candidate quality after the 40% lift.
