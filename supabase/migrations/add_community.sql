-- ============================================
-- COMMUNITY TABLES
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Communities table
CREATE TABLE IF NOT EXISTS public.communities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  creator_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  discord_channel_id TEXT,
  discord_guild_id TEXT,
  member_count INTEGER DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community members table
CREATE TABLE IF NOT EXISTS public.community_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  community_id UUID REFERENCES public.communities ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'moderator', 'member')) DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(community_id, user_id)
);

-- Community posts table
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  community_id UUID REFERENCES public.communities ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Community post replies table
CREATE TABLE IF NOT EXISTS public.community_post_replies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_replies ENABLE ROW LEVEL SECURITY;

-- RLS Policies for communities
CREATE POLICY "Anyone can view public communities"
  ON public.communities FOR SELECT
  USING (is_public = TRUE OR EXISTS (
    SELECT 1 FROM public.community_members
    WHERE community_id = communities.id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create communities"
  ON public.communities FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Owners can update communities"
  ON public.communities FOR UPDATE
  USING (auth.uid() = creator_id);

-- RLS Policies for community_members
CREATE POLICY "Users can view community members"
  ON public.community_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join communities"
  ON public.community_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities"
  ON public.community_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for community_posts
CREATE POLICY "Members can view posts"
  ON public.community_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.community_members
      WHERE community_id = community_posts.community_id
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for community_post_replies
CREATE POLICY "Members can view replies"
  ON public.community_post_replies FOR SELECT
  USING (true);

CREATE POLICY "Members can create replies"
  ON public.community_post_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_communities_slug ON public.communities(slug);
CREATE INDEX IF NOT EXISTS idx_community_members_community_id ON public.community_members(community_id);
CREATE INDEX IF NOT EXISTS idx_community_members_user_id ON public.community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_community_id ON public.community_posts(community_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_post_replies_post_id ON public.community_post_replies(post_id);

