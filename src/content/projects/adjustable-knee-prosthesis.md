---
title: Adjustable Knee Prosthesis
eyebrow: Master's Thesis · Medical Engineering · Frugal Design
summary: Designing an adjustable polycentric knee for transfemoral amputees in Ethiopia — from locally informed requirements to physical prototypes, production tooling, and an ISO test setup.
year: "2020"
order: 3
featured: true
tags: ["Medical Engineering", "0→1", "Hardware", "Research"]
role: Master's thesis researcher and product developer
challenge: Create a functional, maintainable prosthetic knee around the realities of Ethiopian patients, technicians, supply chains, and local production.
outcome: Four prototype generations demonstrated adjustable stability and free-swinging gait mechanics; the work also established injection-mould tooling and a route to ISO 10328 testing.
outcomeLabel: 4 prototype generations
status: ready
link: work/knee-prosthesis/frugal-knee-prosthesis-thesis.pdf
linkLabel: Read the thesis PDF
showcaseTitle: One knee, designed as a system
showcaseLabel: Thesis artefacts
showcase:
  - type: image
    src: work/knee-prosthesis/physical-prototype.webp
    alt: Physical knee prosthesis prototype shown extended, flexed, from the front, and from the rear
    caption: Concept 3 — physical prototype in four views
    frame: technical
  - type: image
    src: work/knee-prosthesis/adjustable-stability.webp
    alt: Kinematic analysis comparing stable and active settings with corresponding bumper layouts
    caption: Adjustable stability through interchangeable bumper geometry
    frame: technical
  - type: image
    src: work/knee-prosthesis/alternative-concept.webp
    alt: CAD renderings of an alternative prosthetic knee concept in multiple positions
    caption: Alternative architecture explored during concept development
    frame: technical
  - type: image
    src: work/knee-prosthesis/mould-design.webp
    alt: Injection mould designs for the proximal and distal prosthetic knee blocks
    caption: Production tooling with cavities, inserts, and cooling channels
    frame: technical
  - type: image
    src: work/knee-prosthesis/mouldflow-simulation.webp
    alt: Mouldflow quality prediction for the proximal and distal knee components
    caption: Simulated manufacturability before committing to tooling
    frame: technical
---

## The situation

At the time of the project, Cheshire Ethiopia could fit around 20 amputees with prostheses each month while roughly 300 people remained on its waiting list. The available knees were mostly single-axis mechanisms: robust and simple, but limited to a stiff-legged gait.

The need was not for a cheaper version of a European product. High import taxes, rough terrain, scarce access to specialists, limited repair infrastructure, and the importance of a natural-looking gait changed what “good” meant. The knee had to be functional, durable, quiet, repairable, compatible with existing components, and suitable for eventual local production.

## The product question

Could a polycentric prosthetic knee provide free-swinging gait while remaining simple enough to produce, maintain, and adapt in Ethiopia?

That question became my master's thesis at the Technical University of Munich, developed within the MedTech OneWorld project and in collaboration with Cheshire Ethiopia and Tegbare-id Polytechnic College in Addis Ababa.

## Turning context into requirements

I started with the operating context, not a preferred mechanism. Input from Cheshire Ethiopia's technical director, prior field research, standards, literature, and my own observations became a list of more than 60 requirements.

The requirements covered:

- stance stability and free-swinging gait
- patient and technician acceptance
- a natural shape and quiet mechanism to reduce visible stigma
- durability in rough environments
- maintenance with simple tools and replaceable wear parts
- compatibility with the prosthetic systems already in use
- production constraints, including local availability of materials
- compliance with ISO 10328 strength testing

## Designing for changing needs

Stability is not a fixed user preference. A newly fitted patient working on uneven ground may initially need a very stable knee. With training, confidence, or a change in environment, that same person may want easier flexion and a more active gait. Regular access to a prosthetist could not be assumed.

I wrote a MATLAB program to analyse four-bar mechanisms and compare their instantaneous centres of rotation. That made it possible to explore how small geometry changes affected stability and flexion.

The resulting concept changes the knee's stability through interchangeable bumper geometry. Different bumper heights move the mechanism between a more stable and a more active setting without replacing the whole knee. The adjustment was designed to be understandable, reversible, and possible with standard tools.

## From system to prototypes

I broke the knee into subsystems — interfaces, blocks, axes, linkages, bearings, damping, extension assist, and bumpers — then generated and evaluated alternatives before combining them.

Four prototype generations made the trade-offs tangible:

- Concept 1 proved the mechanism, moved smoothly, emitted little noise, and allowed the bumper to be exchanged in under a minute. At 1.363 kg, it was too heavy and bulky.
- Concept 2 reduced the assembly to 0.754 kg, introduced replaceable bearings and metal side links, and improved manufacturability.
- Concept 3 reached 0.64 kg while retaining a 149° maximum flexion angle. Its polymer parts were 3D printed, axes turned, and side links water-jet cut.
- Concept 4 explored a simpler, more machine-like architecture at 0.537 kg and 165° flexion, but required an additional mould and was not taken forward.

An FMEA exposed failure modes between iterations. I used it alongside finite-element analysis to strengthen vulnerable parts, secure fasteners, protect bearing surfaces, and make maintenance safer.

## Designing beyond the object

A viable knee also needed a route to repeatable production and verification.

I designed injection moulds for the main polymer blocks, including parting surfaces, inserts, sprues, and cooling channels. Moldflow simulations predicted 100% confidence of fill for both components and highlighted regions requiring further optimisation.

I also designed an adaptable static test setup for ISO 10328. Its adjustable force-application points were intended to test this knee and other prostheses with different heights and kinematics, turning a one-off prototype into a platform for continued development.

## What changed

The thesis produced a working physical prototype of an adjustable, free-swinging polycentric knee and showed a technically plausible route toward small-series production and standards-based testing.

It did not become a validated medical product. COVID-19 cut a planned three-month stay in Addis Ababa to less than two weeks. Patient studies, field testing, full static testing, and the launch of local production could not happen. The result is therefore a well-developed and partially verified foundation, not a finished device.

## Reflection

This was product work before I had the title. The hardest decisions sat between disciplines: biomechanics versus repairability, performance versus simplicity, tooling cost versus unit cost, and technical possibility versus what could actually be maintained locally.

The enduring lesson is that constraint is not a reason to lower the standard. It changes the standard. A sophisticated solution is one that still works when supply chains, specialist access, equipment, and money are limited.
