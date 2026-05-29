-- ============================================================
-- 004_posts_and_newsletter_sends.sql
-- Blog/writing posts + newsletter send tracking
-- ============================================================

-- ============================================================
-- POSTS (blog / writing)
-- ============================================================
CREATE TABLE posts (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               text NOT NULL,
  slug                text NOT NULL UNIQUE,
  excerpt             text,
  body                text,                   -- rich HTML from TipTap
  cover_image_id      uuid REFERENCES media(id) ON DELETE SET NULL,
  cover_image_url     text,                   -- direct URL fallback
  tags                text[] NOT NULL DEFAULT '{}',
  reading_time_minutes integer,               -- auto-calculated on save
  status              text NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'published')),
  is_featured         boolean NOT NULL DEFAULT false,
  published_at        timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_slug        ON posts(slug);
CREATE INDEX idx_posts_status      ON posts(status);
CREATE INDEX idx_posts_published   ON posts(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_posts_tags        ON posts USING GIN(tags);
CREATE INDEX idx_posts_featured    ON posts(is_featured) WHERE status = 'published';

-- Auto-update updated_at
CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- NEWSLETTER SENDS (tracking outbound newsletters)
-- ============================================================
CREATE TABLE newsletter_sends (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject          text NOT NULL,
  preview_text     text,
  body             text NOT NULL,   -- HTML email body
  sent_by          uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  sent_at          timestamptz NOT NULL DEFAULT now(),
  recipient_count  integer NOT NULL DEFAULT 0,
  post_id          uuid REFERENCES posts(id) ON DELETE SET NULL
);

CREATE INDEX idx_newsletter_sends_sent_at ON newsletter_sends(sent_at DESC);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE posts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends   ENABLE ROW LEVEL SECURITY;

-- Posts: public reads published; admins full access
CREATE POLICY "posts_public_read" ON posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "posts_admin_all" ON posts
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Newsletter sends: admin only
CREATE POLICY "newsletter_sends_admin_all" ON newsletter_sends
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- Extend search_index with post support (no schema change needed,
-- content_type = 'post' is just a new value in existing text col)
-- ============================================================
