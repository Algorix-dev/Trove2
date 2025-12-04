# 📚 Trove - Your Personal Reading Companion

A modern, full-featured web application for managing your e-book library, tracking reading progress, taking notes, and connecting with other readers.

## ✨ Features

- 📖 **E-Book Reader** - Read PDF, EPUB, and TXT files in a beautiful, customizable reader
- 📊 **Reading Analytics** - Track your reading time, streaks, and progress with interactive charts
- ✍️ **Notes & Highlights** - Mark important passages and keep your thoughts organized
- 📚 **Library Management** - Upload and organize your personal book collection
- 👥 **Community** - Join discussion groups and connect with fellow readers
- 🎯 **Reading Goals** - Set and track daily reading targets
- 🌙 **Dark Mode** - Easy on the eyes with full dark mode support
- 📱 **Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd Trove
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Add your Supabase credentials to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Database**: Supabase
- **Authentication**: Supabase Auth

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard and main features
│   ├── login/            # Authentication pages
│   └── page.tsx          # Landing page
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── features/         # Feature-specific components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 UI Components

Built with a comprehensive set of reusable components:
- Button, Card, Input, Dialog
- Progress, Slider, Switch, Label
- Custom feature components for each section

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Configuration

### Database Setup

Create the following tables in your Supabase project:

```sql
-- Books table
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  author TEXT,
  file_url TEXT NOT NULL,
  cover_url TEXT,
  format TEXT,
  total_pages INT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add more tables for reading_progress, notes, highlights, etc.
```

## 🚧 Current Status

**Frontend**: ✅ Complete
- All UI components implemented
- Responsive design
- Animations and transitions
- Dark mode support

**Backend**: 🔄 In Progress
- Supabase client configured
- Database schema defined
- Auth integration needed
- File upload functionality needed

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by modern reading apps
- Icons by Lucide
- UI components powered by Radix UI

---

Built with ❤️ for book lovers everywhere
