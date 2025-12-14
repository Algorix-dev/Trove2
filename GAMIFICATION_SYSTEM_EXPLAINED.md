# 🎮 Gamification System - How It Works

## Overview
Trove2 uses a comprehensive gamification system to motivate reading through XP, levels, achievements, and streaks.

---

## 🎯 Core Components

### 1. **XP (Experience Points)**
- **What it is:** Points earned for reading activities
- **How you earn:**
  - **1 XP per minute** of reading
  - **Achievement unlocks** (varies by achievement)
  - **Completing books** (bonus XP)
  - **Maintaining streaks** (bonus XP)

### 2. **Levels**
- **What it is:** Your reading rank based on total XP
- **Levels:**
  1. Novice Reader (0 XP)
  2. Book Enthusiast (100 XP)
  3. Avid Reader (250 XP)
  4. Literary Explorer (500 XP)
  5. Bookworm (1,000 XP)
  6. Page Turner (2,000 XP)
  7. Reading Addict (4,000 XP)
  8. Master Reader (8,000 XP)
  9. Grand Bibliophile (16,000 XP)
  10. Legendary Scholar (32,000 XP)

- **How it works:**
  - XP is tracked in `profiles.total_xp`
  - Level is calculated automatically via database trigger
  - When you level up, you get a celebration animation!

### 3. **Achievements**
- **What it is:** Badges unlocked for milestones
- **Current Achievements:**
  - **First Steps** - Read your first book (50 XP)
  - **Early Bird** - 3-day streak (100 XP)
  - **Week Warrior** - 7-day streak (200 XP)
  - **Bookworm** - Read 10 books (300 XP)
  - **Speed Reader** - 100 pages in one day (150 XP)
  - **Night Owl** - Read after midnight (75 XP)
  - **Marathon Reader** - 30-day streak (500 XP)
  - **Century Club** - 100 hours total (400 XP)
  - **Library Builder** - Upload 25 books (250 XP)
  - **Milestone Master** - Reach level 5 (1,000 XP)

- **How it works:**
  - Achievements are checked automatically
  - When unlocked, you get XP bonus
  - Confetti animation plays
  - Toast notification appears

### 4. **Reading Streaks**
- **What it is:** Consecutive days of reading
- **How it works:**
  - Tracked in `profiles.current_streak`
  - Updates automatically when you read
  - Resets if you miss a day
  - Highest streak is saved in `profiles.highest_streak`

### 5. **Reading Sessions**
- **What it is:** Time spent reading each day
- **How it works:**
  - Tracked in `reading_sessions` table
  - Records: date, book, duration
  - Used for analytics and streaks
  - Awards XP automatically

---

## 🔄 Automatic Processes

### XP Awarding
- **When:** Every minute while reading
- **Amount:** 1 XP per minute
- **Where:** In reader components (PDF, EPUB, TXT)
- **Process:**
  1. Timer tracks reading time
  2. Every 60 seconds, awards 1 XP
  3. Updates `profiles.total_xp`
  4. Database trigger checks for level up
  5. If level up, celebration plays

### Achievement Checking
- **When:** After significant actions
- **Examples:**
  - After completing a book
  - After uploading a book
  - After maintaining a streak
  - After reaching milestones
- **Process:**
  1. System checks achievement requirements
  2. If met, unlocks achievement
  3. Awards achievement XP
  4. Shows celebration

### Streak Tracking
- **When:** Daily, after reading
- **Process:**
  1. Checks if user read today
  2. Updates `last_read_date`
  3. If consecutive day, increments streak
  4. If missed day, resets streak
  5. Updates highest streak if needed

---

## 📊 Database Tables

### `profiles`
- `total_xp` - Total experience points
- `current_level` - Current level (auto-calculated)
- `current_streak` - Current reading streak
- `highest_streak` - Best streak ever
- `last_read_date` - Last day user read

### `levels`
- Static table with level definitions
- `level` - Level number
- `min_xp` - Minimum XP required
- `title` - Level name

### `achievements`
- Static table with achievement definitions
- `code` - Unique achievement code
- `name` - Achievement name
- `xp_reward` - XP bonus for unlocking
- `requirement_type` - What to check (streak, books_read, etc.)
- `requirement_value` - Target value

### `user_achievements`
- Tracks which achievements users have unlocked
- `user_id` - User
- `achievement_id` - Achievement
- `unlocked_at` - When unlocked
- `notified` - Whether user was notified

### `reading_sessions`
- Tracks daily reading time
- `user_id` - User
- `book_id` - Book being read
- `duration_minutes` - Minutes read
- `session_date` - Date of session

### `xp_history`
- Log of all XP earned
- `user_id` - User
- `amount` - XP amount
- `reason` - Why XP was earned
- `book_id` - Related book (if any)
- `created_at` - When earned

---

## 🎨 Visual Feedback

### Level Up Celebration
- **When:** You reach a new level
- **Animation:** Confetti, level badge, XP display
- **Component:** `LevelUpCelebration`

### Achievement Unlocked
- **When:** You unlock an achievement
- **Animation:** Confetti, achievement badge, toast
- **Component:** `AchievementConfetti`

### Daily Goal Reached
- **When:** You reach your daily reading goal
- **Animation:** Celebration animation
- **Component:** `DailyGoalCelebration`

---

## 🔧 How to Use

### For Developers

**Award XP:**
```typescript
import { GamificationService } from '@/lib/gamification'

await GamificationService.awardXP(
    userId, 
    10, // amount
    "Completed Book", // action description
    bookId // optional
)
```

**Check Achievement:**
```typescript
await GamificationService.checkAndUnlockAchievement(
    userId,
    'FIRST_BOOK' // achievement code
)
```

### For Users

**Earn XP by:**
- Reading books (1 XP per minute)
- Completing books (bonus XP)
- Unlocking achievements (bonus XP)
- Maintaining reading streaks (bonus XP)

**Level Up by:**
- Earning enough XP to reach next level threshold
- Automatic level calculation
- Celebration when you level up!

**Unlock Achievements by:**
- Reading your first book
- Maintaining streaks
- Reading many books
- Reaching milestones

---

## ✅ Current Status

- ✅ XP system working
- ✅ Level system working
- ✅ Achievement system working
- ✅ Streak tracking working
- ✅ Reading sessions tracking
- ✅ Celebrations and animations
- ✅ Database triggers for auto-level-up

---

## 🚀 Future Enhancements

- [ ] More achievement types
- [ ] Leaderboards
- [ ] Seasonal challenges
- [ ] Reading competitions
- [ ] Badge collection
- [ ] Social sharing of achievements

---

**The gamification system is fully functional and uses live data!** 🎉

