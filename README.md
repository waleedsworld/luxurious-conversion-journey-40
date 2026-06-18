# Web Development for $15 💸

> Get a website. Get *famous*. Get it for the price of two coffees.

A punchy, single-page marketing site for a no-nonsense web-development service:
one flat **$15** package, free hosting, free revisions, and a friendly WhatsApp
line to the humans behind it. Built with React, Vite, TypeScript, Tailwind and
shadcn/ui — hand-tuned to load fast and convert faster.

![Animated hero demo](assets/demo.gif)

---

## ✨ Features

- **Conversion-first hero** — animated typewriter headline ("Get *Rich /
  Famous / Successful / Unstoppable*") with a dark-to-purple gradient and a
  can't-miss yellow call-to-action.
- **"What You Get" grid** — the value props at a glance, on tidy muted cards.
- **"How It Works" section** — a three-step, idea → pay → launch walkthrough
  so visitors know exactly what happens after they click.
- **Transparent pricing card** — one package, five perks, zero surprises.
- **Light / dark mode** — a one-tap theme toggle powered by `next-themes`.
- **Lead capture** — a "Limited Time Offer" email/phone popup and an inline
  website-brief form.
- **WhatsApp chat widget** — a floating "Chat with Us" bubble that deep-links
  straight to the team.
- **Ziina payment flow** — `/payment`, `/payment/success` and
  `/payment/failed` routes wired to the Ziina payment API.
- **Fully responsive** — looks sharp from a 390px phone to a widescreen
  monitor.
- **Footer with real contact routes** — WhatsApp and email, always one scroll
  away.

| Desktop | Mobile |
| --- | --- |
| ![Full page](docs/media/full.png) | ![Mobile](docs/media/mobile.png) |

---

## 🛠️ Tech stack

- **[Vite](https://vitejs.dev/)** — lightning-fast dev server and build.
- **[React 18](https://react.dev/)** + **TypeScript** — typed, component-driven UI.
- **[Tailwind CSS](https://tailwindcss.com/)** + **[shadcn/ui](https://ui.shadcn.com/)** — the design system.
- **[React Router](https://reactrouter.com/)** — client-side routing.
- **[TanStack Query](https://tanstack.com/query)**, **[React Hook Form](https://react-hook-form.com/)** + **[Zod](https://zod.dev/)** — data & forms.
- **[lucide-react](https://lucide.dev/)** icons and **[GSAP](https://gsap.com/)** for motion.

---

## 🚀 Getting started

### Prerequisites

You'll need **[Node.js](https://nodejs.org/) 18 or newer** (which ships with
`npm`). Check what you've got:

```bash
node -v   # should print v18.x.x or higher
npm -v
```

If Node isn't installed, the easiest route is [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install 18
nvm use 18
```

### Install & run

```bash
# 1. Clone the repo
git clone https://github.com/waleedsworld/luxurious-conversion-journey-40.git
cd luxurious-conversion-journey-40

# 2. Install dependencies
npm install

# 3. Start the dev server (hot-reload on http://localhost:8080)
npm run dev
```

Open **http://localhost:8080** and you're off.

### Configure payments (optional)

The pricing button kicks off a real Ziina payment intent. To wire it up, copy
the example env file and drop in your key — it's read from the environment, and
**never** committed:

```bash
cp .env.example .env.local
# then edit .env.local:
# VITE_ZIINA_API_KEY=your_real_key_here
```

Without a key the UI still runs perfectly; only the live payment call is
skipped (and it'll warn you in the console).

### Build for production

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

---

## 📁 Project structure

```
src/
├── components/        # Hero, Benefits, HowItWorks, Pricing, Footer, chat widgets…
│   └── ui/            # shadcn/ui primitives
├── pages/             # Index, Payment, PaymentSuccess, PaymentFailed, NotFound
├── hooks/             # scroll tracking, mobile detection, toasts
├── services/          # Ziina payment integration
└── utils/             # action handler, API config, theme preview
```

---

## 🌐 Live demo

Live demo — deploying soon.

---

## 📄 License

Released under the MIT License. Build something great with it. 🚀
