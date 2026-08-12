---
title: Habbit
eyebrow: Personal Product · iOS · SwiftUI
summary: A habit tracker I designed and built (for) myself — kind streak logic, home-screen widget, and a calm iOS interface.
year: "2026"
order: 1
featured: true
tags: ["B2C", "0→1", "Mobile"]
role: Sole product designer and iOS developer
challenge: Build a habit app that motivates without punishing people for being human.
outcome: A working iOS app with flexible cadences, grace periods, streak freezes, and an interactive widget.
outcomeLabel: Built end-to-end, used by me and friends
status: ready
link: https://github.com/luis-amrein/habbit
linkLabel: View on GitHub
showcaseTitle: Habbit on iPhone 17 Pro
showcaseLabel: In the simulator
showcase:
  - type: video
    src: work/habbit/demo.mp4
    alt: Screen recording of Habbit running in the iPhone 17 Pro simulator
    caption: Walkthrough — creating habits, completing them, and living with the loop
  - type: image
    src: work/habbit/screen-03.jpg
    alt: Home screen showing habit progress rings and streaks
    caption: Habits home
  - type: image
    src: work/habbit/screen-01.jpg
    alt: New Habit screen with icon picker and frequency options
    caption: New habit
  - type: image
    src: work/habbit/screen-02.jpg
    alt: Emoji picker sheet for choosing a habit icon
    caption: Icon picker
  - type: image
    src: work/habbit/screen-04.jpg
    alt: Edit Habits list with reorder and delete controls
    caption: Edit habits
  - type: image
    src: work/habbit/screen-05.jpg
    alt: Home screen with streak freezes and mixed progress states
    caption: Progress & freezes
  - type: image
    src: work/habbit/screen-06.jpg
    alt: Analysis dashboard with completions, best streak, and calendar
    caption: Analysis
  - type: image
    src: work/habbit/screen-07.jpg
    alt: Habit breakdown list with completions and streaks
    caption: Habit breakdown
  - type: image
    src: work/habbit/screen-08.jpg
    alt: In-app Habbit Manual explaining habit psychology
    caption: Habbit Manual
  - type: image
    src: work/habbit/screen-09.jpg
    alt: Profile screen with general settings and appearance
    caption: Profile & settings
  - type: image
    src: work/habbit/screen-10.jpg
    alt: Appearance settings with System, Light, and Dark options
    caption: Appearance
  - type: image
    src: work/habbit/screen-11.jpg
    alt: Habbit home screen in dark mode
    caption: Dark mode
---

## The situation

Habbit is an extension and bring-to-life of my earlier [Habit Tracker for Atom](../habit-tracker/) case study — work I created as Product Owner during that programme. That case defined the product logic on paper: kinder motivation, less streak anxiety, a calm loop. Habbit is where I took those ideas into a real iOS app I would actually use.

I had also tried a handful of habit trackers and was not happy with any of them. Too rigid, too punishing, or too much friction for something I wanted to do every day.

So I built Habbit myself — a personal iOS habit tracker with SwiftUI and SwiftData. Clear progress, flexible rhythms, and less of the anxious streak culture. Both a product exercise and a build exercise: from interaction design to shipping native code.

The home-screen widget was a hard requirement. I needed a low-threshold way to mark habits done without opening the app — otherwise the tracker becomes another thing to remember, not a habit helper.

## The product question

Most habit apps optimise for unbroken streaks. That can help for a while, then backfire the first time life gets busy. The question for Habbit was: how do you keep the motivation of progress without making one missed day feel like failure?

## What I built

- Circular progress that shows how long until a habit is due again
- Flexible cadence: daily, every two days, weekly, or custom intervals
- Streak freezes earned at milestones, so streaks can survive an off day
- A 24-hour grace period before a missed habit costs the streak
- Completion history with filtering
- A short in-app manual on habit psychology and practical tips
- An interactive home-screen widget — the low-friction path to check habits off without opening the app
- Full light and dark mode

## How I approached it

I treated myself as the first user. That meant designing the loop around real days — travel, tired evenings, imperfect weeks — not an ideal calendar.

I also wanted the product to feel friendly, familiar, personal, and light — more like a companion than a coach. Soft language, calm visuals, and small personality moments so that over time the app feels like a friend, not another system watching you.

On the product side, I focused on a few decisions: flexible timing, forgiveness mechanics, and a widget that removes friction at the moment of action. On the engineering side, I built the app natively for iOS 17+ with SwiftUI, SwiftData, and a widget extension sharing data through App Groups.

## What changed

The result is a working app I can install, use, and keep improving. Friends are using it too and sending feedback — which is already sharpening the next round of decisions. More importantly, it forced end-to-end product craft: naming the problem, choosing trade-offs, designing the interface, and implementing the behaviour myself.

## Tools

Swift, SwiftUI, SwiftData, Xcode, App Groups, WidgetKit.

## Reflection

Building Habbit made the product role feel less abstract. When you also write the code, vague requirements stop being an option — every choice shows up on screen the next day.

Future features like notifications are planned. A social layer also looks promising: friends following and liking progress could build social accountability and make success feel more shared — and more motivating.