# Astrosign

A product and campaign planning MVP built with Next.js and TypeScript.

The application helps explore the relationship between advertising spend, cost per click, conversion, product costs, fees and refunds. Results are scenarios calculated from the user's inputs.

## Current features

- Product records with a selling price and cost of goods.
- Product storage in the browser's `localStorage`.
- A campaign simulator for clicks, orders, revenue, profit, ROAS, ROI and CAC.
- A strategy page with planning cards and a project tree.
- A single-administrator login configured on the server.

The simulator does not connect to advertising platforms or import actual campaign results. Its outputs are estimates derived from the entered assumptions.

## How the simulator works

The current implementation calculates:

- Clicks from advertising spend divided by cost per click.
- Orders from clicks and the entered conversion rate.
- Net orders after the entered refund rate.
- Revenue from product price and net orders.
- Profit after advertising spend, product costs and fees.
- ROAS, ROI and CAC from those values.

See [the simulator page](src/app/simulador/page.tsx) and [product storage](src/lib/mvp-products.ts). No financial or performance outcome is claimed for the project.

## Stack

Next.js, React, TypeScript and Tailwind CSS. The repository also contains Prisma schema/migration tooling and authentication experiments; these do not establish a complete multi-user service.

## Local development

Prerequisites: Node.js compatible with the locked Next.js version and npm.

```bash
git clone https://github.com/cesaints/marketing-digital.git
cd marketing-digital
npm ci
npm run dev
```

Set these environment variables locally for the active administrator login:

| Variable | Used for |
| --- | --- |
| `ADMIN_EMAIL` | Administrator identity |
| `ADMIN_PASSWORD` | Administrator login password |
| `SESSION_SECRET` | Signing the application's session |

Use your own development values. Do not commit them.

Open [localhost:3000](http://localhost:3000). The dashboard, product pages and simulator require the application's session.

Prisma CLI configuration reads `DATABASE_URL` when database tooling is used. The current product list and simulator use browser storage rather than that database.

## Available scripts

| Command | Defined purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Application build |
| `npm run start` | Serve an existing build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Prisma client generation |
| `npm run db:migrate` | Development database migrations |
| `npm run db:studio` | Prisma Studio |

Commands were checked in [package.json](package.json); they were not executed for this documentation review. Database commands require their own configured development database.

## Current limits

Browser data is local to the browser and can be removed when its storage is cleared. It is not synchronized between devices or users.

The active login is a basic single-administrator implementation. Automated tests, a CI workflow and a verified production deployment were not found in the reviewed public tree.

## Rights

No license file was present in the reviewed revision. This README does not change the project's licensing.
