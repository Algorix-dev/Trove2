-- ============================================
-- MARKETPLACE TABLES
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Marketplace listings table
CREATE TABLE IF NOT EXISTS public.marketplace_listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL,
  condition TEXT CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')) DEFAULT 'good',
  images TEXT[] DEFAULT '{}',
  location TEXT,
  status TEXT CHECK (status IN ('active', 'sold', 'pending', 'cancelled')) DEFAULT 'active',
  featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Marketplace transactions table
CREATE TABLE IF NOT EXISTS public.marketplace_transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.marketplace_listings ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')) DEFAULT 'pending',
  payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Marketplace reviews table
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.marketplace_transactions ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reviewee_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(transaction_id, reviewer_id)
);

-- Delivery tracking table
CREATE TABLE IF NOT EXISTS public.marketplace_deliveries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  transaction_id UUID REFERENCES public.marketplace_transactions ON DELETE CASCADE NOT NULL UNIQUE,
  tracking_number TEXT,
  carrier TEXT,
  status TEXT CHECK (status IN ('pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'exception')) DEFAULT 'pending',
  updates JSONB DEFAULT '[]',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  actual_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_deliveries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketplace_listings
CREATE POLICY "Anyone can view active listings"
  ON public.marketplace_listings FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create listings"
  ON public.marketplace_listings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON public.marketplace_listings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON public.marketplace_listings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for marketplace_transactions
CREATE POLICY "Users can view own transactions"
  ON public.marketplace_transactions FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create transactions"
  ON public.marketplace_transactions FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update transactions they're involved in"
  ON public.marketplace_transactions FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- RLS Policies for marketplace_reviews
CREATE POLICY "Anyone can view reviews"
  ON public.marketplace_reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can create reviews for their transactions"
  ON public.marketplace_reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON public.marketplace_reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- RLS Policies for marketplace_deliveries
CREATE POLICY "Users can view deliveries for their transactions"
  ON public.marketplace_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_transactions
      WHERE id = marketplace_deliveries.transaction_id
      AND (buyer_id = auth.uid() OR seller_id = auth.uid())
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_user_id ON public.marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON public.marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_featured ON public.marketplace_listings(featured);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category ON public.marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_buyer_id ON public.marketplace_transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_seller_id ON public.marketplace_transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_transactions_listing_id ON public.marketplace_transactions(listing_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_reviews_reviewee_id ON public.marketplace_reviews(reviewee_id);

