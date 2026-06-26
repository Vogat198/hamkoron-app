# HAMKORON — Платформаи устоҳои Тоҷикистон

🇹🇯 Усто ва кор ёфтан бо мо осон!

## Stack
- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Apple Liquid Glass UI
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Create Supabase project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run `supabase-schema.sql` in the SQL editor
3. Copy your project URL and anon key

### 3. Configure environment
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run development server
```bash
npm run dev
```

## Admin Dashboard
Visit `/admin` — demo password: `hamkoron2025`

## Pages
- `/` — Homepage (Hero, Categories, Workers Directory, Forms)
- `/admin` — Admin Dashboard (Stats, Workers, Jobs)

## Contact
- 📞 Phone: +7 963 069 18 35
- 📸 Instagram: [@hamkoron](https://www.instagram.com/hamkoron)

## Features
- ✅ Apple Liquid Glass UI (WWDC 2025 inspired)
- ✅ Mobile-first responsive design
- ✅ Worker search & filter (profession, city, name)
- ✅ Job posting form
- ✅ Worker registration form
- ✅ Admin dashboard with stats
- ✅ Supabase integration ready
- ✅ SEO optimized (Tajik + Russian)
- ✅ Animated glassmorphism background
