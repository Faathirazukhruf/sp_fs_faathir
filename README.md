# Sellerpintar Fullstack Test – Multi-User Project Management App

A fullstack project management web app built with Next.js App Router, allowing users to create projects, invite members, and manage tasks collaboratively.

## 🚀 Features

- User Authentication with NextAuth.js (credentials)
- Create / delete projects
- Invite members by email
- Project dashboard
- Task management (create, delete tasks)
- Protected routes with middleware
- Responsive UI with TailwindCSS + shadcn

## 🧪 Tech Stack

- Next.js 15 App Router (Frontend & Backend API Routes)
- TypeScript
- TailwindCSS + shadcn/ui
- Prisma ORM
- PostgreSQL (via Supabase)
- NextAuth.js (credentials provider)
- Deployed on Vercel

## 🧭 Folder Structure

```

src/
├── app/               → Pages & API Routes
│   ├── dashboard/     → Project dashboard
│   ├── login/         → Login page
│   ├── register/      → Register page
│   ├── projects/      → Project board & settings
│   └── api/           → Backend routes (auth, register, projects, tasks)
├── lib/               → Prisma client & NextAuth config
├── prisma/            → Prisma schema
└── .env.example       → Environment variable format

````

## ⚙️ How to Run Locally

1. Clone the repo
2. Install dependencies

```bash
npm install
````

3. Create `.env` file based on `.env.example`

4. Push Prisma schema to your PostgreSQL:

```bash
npx prisma db push
```

5. Run the dev server:

```bash
npm run dev
```

Visit `http://localhost:3000`

## 🔐 Credentials

You can register new users at `/register`, then login via `/login`.


---

Made with 💻 by [Faathir Azukhruf](https://github.com/Faathirazukhruf)

````

---

