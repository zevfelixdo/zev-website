-- ============================================================
-- 001_initial_schema.sql
-- Full schema for zev-website CMS
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- for fuzzy full-text search
CREATE EXTENSION IF NOT EXISTS "unaccent";   -- for accent-insensitive search

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE user_roles (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL CHECK (role IN ('admin', 'editor')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

-- ============================================================
-- THEMES
-- ============================================================
CREATE TABLE themes (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  is_active   boolean NOT NULL DEFAULT false,
  config      jsonb NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- NAVIGATION
-- ============================================================
CREATE TABLE nav_items (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  label       text NOT NULL,
  href        text NOT NULL,
  position    integer NOT NULL DEFAULT 0,
  is_external boolean NOT NULL DEFAULT false,
  parent_id   uuid REFERENCES nav_items(id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE pages (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text,
  og_image    text,               -- URL to OG image
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  is_system   boolean NOT NULL DEFAULT false,   -- system pages can't be deleted
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

-- ============================================================
-- PAGE SECTIONS / BLOCKS (the CMS block system)
-- ============================================================
CREATE TABLE page_sections (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id     uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type        text NOT NULL,      -- hero, text, cards, gallery, cv, contact, etc.
  position    integer NOT NULL DEFAULT 0,
  content     jsonb NOT NULL DEFAULT '{}',   -- block-specific data
  is_visible  boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_sections_page_id ON page_sections(page_id);
CREATE INDEX idx_page_sections_position ON page_sections(page_id, position);

-- ============================================================
-- MEDIA LIBRARY
-- ============================================================
CREATE TABLE media (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  file_path     text NOT NULL UNIQUE,   -- path in supabase storage
  public_url    text NOT NULL,
  mime_type     text NOT NULL,
  size_bytes    bigint NOT NULL DEFAULT 0,
  width         integer,
  height        integer,
  alt_text      text,
  caption       text,
  description   text,
  tags          text[] NOT NULL DEFAULT '{}',
  uploaded_by   uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_mime_type ON media(mime_type);
CREATE INDEX idx_media_tags ON media USING GIN(tags);

-- ============================================================
-- PROJECTS
-- ============================================================
CREATE TABLE projects (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  slug          text NOT NULL UNIQUE,
  description   text,
  body          text,             -- rich HTML
  image_id      uuid REFERENCES media(id) ON DELETE SET NULL,
  external_url  text,
  status        text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'completed', 'idea', 'archived')),
  tags          text[] NOT NULL DEFAULT '{}',
  position      integer NOT NULL DEFAULT 0,
  is_published  boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX idx_projects_status ON projects(status);

-- ============================================================
-- CV ENTRIES
-- ============================================================
CREATE TABLE cv_entries (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category    text NOT NULL CHECK (category IN (
    'education', 'training', 'experience', 'publications',
    'presentations', 'research', 'leadership', 'awards', 'other'
  )),
  title       text NOT NULL,
  institution text,
  location    text,
  start_date  text,           -- stored as text for flexibility (e.g. "2018", "Aug 2018")
  end_date    text,           -- null = present
  description text,
  url         text,
  position    integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_cv_entries_category ON cv_entries(category);

-- ============================================================
-- PUBLICATIONS
-- ============================================================
CREATE TABLE publications (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       text NOT NULL,
  authors     text,
  journal     text,
  year        integer,
  volume      text,
  pages       text,
  doi         text,
  url         text,
  abstract    text,
  pub_type    text NOT NULL DEFAULT 'article'
                CHECK (pub_type IN ('article', 'chapter', 'presentation', 'poster', 'other')),
  position    integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
CREATE TABLE newsletter_subscribers (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         text NOT NULL UNIQUE,
  first_name    text,
  last_name     text,
  status        text NOT NULL DEFAULT 'active'
                  CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  ip_address    text,
  confirmed_at  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================
CREATE TABLE contact_submissions (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        text NOT NULL,
  email       text NOT NULL,
  subject     text,
  message     text NOT NULL,
  ip_address  text,
  status      text NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'read', 'replied', 'spam')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);

-- ============================================================
-- SEARCH INDEX (denormalized for fast FTS)
-- ============================================================
CREATE TABLE search_index (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type  text NOT NULL,   -- page, project, cv_entry, publication, post
  content_id    uuid NOT NULL,
  title         text NOT NULL,
  excerpt       text,
  body          text,
  tags          text[] NOT NULL DEFAULT '{}',
  url           text NOT NULL,
  is_public     boolean NOT NULL DEFAULT true,
  updated_at    timestamptz NOT NULL DEFAULT now(),
  search_vector tsvector         -- maintained by trigger below
);

CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);
CREATE INDEX idx_search_content_type ON search_index(content_type);
CREATE UNIQUE INDEX idx_search_content_id ON search_index(content_type, content_id);

-- Trigger to keep search_vector up to date on insert/update
-- (Generated columns can't use stable functions like to_tsvector in PostgreSQL)
CREATE OR REPLACE FUNCTION update_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.body, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_search_vector
  BEFORE INSERT OR UPDATE ON search_index
  FOR EACH ROW EXECUTE FUNCTION update_search_vector();

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE audit_logs (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action      text NOT NULL,     -- create, update, delete, publish, unpublish, upload, login
  table_name  text,
  record_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  text,
  user_agent  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- ============================================================
-- FOOTER CONFIG (simple key/value)
-- ============================================================
CREATE TABLE site_settings (
  key         text PRIMARY KEY,
  value       jsonb NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGERS
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER themes_updated_at         BEFORE UPDATE ON themes         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER nav_items_updated_at      BEFORE UPDATE ON nav_items      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pages_updated_at          BEFORE UPDATE ON pages          FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER page_sections_updated_at  BEFORE UPDATE ON page_sections  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER projects_updated_at       BEFORE UPDATE ON projects       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cv_entries_updated_at     BEFORE UPDATE ON cv_entries     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER publications_updated_at   BEFORE UPDATE ON publications   FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER site_settings_updated_at  BEFORE UPDATE ON site_settings  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
-- ============================================================
-- 002_rls_policies.sql
-- Row Level Security policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_roles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE themes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_items            ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages                ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE media                ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects             ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_entries           ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications         ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_index         ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings        ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Helper: check if calling user is an admin
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND role IN ('admin', 'editor')
  );
$$;

-- ============================================================
-- user_roles: only admins can manage
-- ============================================================
CREATE POLICY "user_roles_admin_all" ON user_roles
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- themes: public can read active theme; admins can manage all
-- ============================================================
CREATE POLICY "themes_public_read" ON themes
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "themes_admin_all" ON themes
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- nav_items: public read; admin write
-- ============================================================
CREATE POLICY "nav_items_public_read" ON nav_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "nav_items_admin_write" ON nav_items
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- pages: public can read published pages; admins can read/write all
-- ============================================================
CREATE POLICY "pages_public_read" ON pages
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "pages_admin_all" ON pages
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- page_sections: public reads sections of published pages; admins all
-- ============================================================
CREATE POLICY "sections_public_read" ON page_sections
  FOR SELECT TO anon, authenticated
  USING (
    is_visible = true AND
    EXISTS (
      SELECT 1 FROM pages p
      WHERE p.id = page_id AND p.status = 'published'
    )
  );

CREATE POLICY "sections_admin_all" ON page_sections
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- media: public read; admin write
-- ============================================================
CREATE POLICY "media_public_read" ON media
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "media_admin_write" ON media
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- projects: public reads published; admins all
-- ============================================================
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "projects_admin_all" ON projects
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- cv_entries: public reads published; admins all
-- ============================================================
CREATE POLICY "cv_public_read" ON cv_entries
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "cv_admin_all" ON cv_entries
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- publications: public reads published; admins all
-- ============================================================
CREATE POLICY "pubs_public_read" ON publications
  FOR SELECT TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "pubs_admin_all" ON publications
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- newsletter_subscribers: anon can insert; admins can read all
-- ============================================================
CREATE POLICY "newsletter_anon_insert" ON newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "newsletter_admin_read" ON newsletter_subscribers
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "newsletter_admin_update" ON newsletter_subscribers
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- contact_submissions: anon can insert; admins can read/manage
-- ============================================================
CREATE POLICY "contact_anon_insert" ON contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_admin_all" ON contact_submissions
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- search_index: public reads public content; admins all
-- ============================================================
CREATE POLICY "search_public_read" ON search_index
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "search_admin_all" ON search_index
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- audit_logs: admins read-only (no direct write from client)
-- ============================================================
CREATE POLICY "audit_admin_read" ON audit_logs
  FOR SELECT TO authenticated
  USING (is_admin());

-- ============================================================
-- site_settings: public read; admin write
-- ============================================================
CREATE POLICY "settings_public_read" ON site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "settings_admin_write" ON site_settings
  FOR ALL TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================================
-- Storage buckets (run via Supabase dashboard or CLI)
-- ============================================================
-- CREATE POLICY "media_public_bucket_read" ON storage.objects
--   FOR SELECT TO anon USING (bucket_id = 'media');
--
-- CREATE POLICY "media_admin_upload" ON storage.objects
--   FOR INSERT TO authenticated
--   WITH CHECK (bucket_id = 'media' AND is_admin());
--
-- CREATE POLICY "media_admin_delete" ON storage.objects
--   FOR DELETE TO authenticated
--   USING (bucket_id = 'media' AND is_admin());
-- ============================================================
-- 003_seed_data.sql
-- Default pages, nav items, theme, and site settings
-- ============================================================

-- ============================================================
-- DEFAULT THEME
-- ============================================================
INSERT INTO themes (name, is_active, config) VALUES (
  'Warm Earth',
  true,
  '{
    "colors": {
      "primary": "30 64 48",
      "secondary": "100 80 55",
      "accent": "200 120 40",
      "surface": "255 253 248",
      "surfaceAlt": "245 241 234",
      "muted": "160 145 125",
      "textBase": "35 30 25",
      "textMuted": "110 100 85",
      "border": "210 200 185"
    },
    "typography": {
      "fontSans": "Inter",
      "fontSerif": "Lora",
      "fontMono": "JetBrains Mono",
      "baseSize": "16px",
      "lineHeight": "1.7"
    },
    "radii": {
      "sm": "0.25rem",
      "default": "0.5rem",
      "md": "0.75rem",
      "lg": "1rem",
      "xl": "1.5rem"
    },
    "spacing": {
      "sectionY": "5rem"
    },
    "shadows": {
      "card": "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
      "dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "modal": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
    },
    "buttons": {
      "style": "rounded"
    },
    "header": {
      "style": "minimal"
    }
  }'
);

-- ============================================================
-- DEFAULT NAVIGATION
-- ============================================================
INSERT INTO nav_items (label, href, position) VALUES
  ('Home',       '/',          0),
  ('About',      '/about',     1),
  ('My Path',    '/path',      2),
  ('Unplugged',  '/unplugged', 3),
  ('Medicine',   '/medicine',  4),
  ('Outdoors',   '/outdoors',  5),
  ('Work',       '/work',      6),
  ('CV',         '/cv',        7),
  ('Contact',    '/contact',   8);

-- ============================================================
-- DEFAULT PAGES
-- ============================================================
INSERT INTO pages (slug, title, description, status, is_system) VALUES
  ('home',       'Home',                   'Physician, builder, and outdoor enthusiast.',               'published', true),
  ('about',      'About Zev',              'Background, interests, and what drives me.',                'published', true),
  ('path',       'My Path',                'From film to medicine — a nonlinear journey.',              'published', true),
  ('unplugged',  'Unplugged',              'Co-founding Digital Detox and Camp Grounded.',              'published', true),
  ('medicine',   'Medicine',               'Surgery, family medicine, and whole-person care.',          'published', true),
  ('outdoors',   'Outdoors & Wilderness',  'Climbing, wilderness medicine, and outdoor education.',     'published', true),
  ('work',       'Work & Projects',        'Medical projects, writing, tech tools, and creative work.', 'published', true),
  ('cv',         'CV / Background',        'Education, training, publications, and leadership.',        'published', true),
  ('contact',    'Contact',                'Get in touch, subscribe, or support my work.',              'published', true);

-- ============================================================
-- SITE SETTINGS DEFAULTS
-- ============================================================
INSERT INTO site_settings (key, value) VALUES
  ('footer', '{
    "tagline": "Physician. Climber. Builder.",
    "email": "hello@zevfelix.com",
    "social": {
      "twitter": "",
      "linkedin": "",
      "instagram": ""
    },
    "copyright": "Zev Felix"
  }'),
  ('seo', '{
    "defaultTitle": "Zev Felix",
    "titleTemplate": "%s | Zev Felix",
    "defaultDescription": "Physician, outdoor enthusiast, and builder. Exploring medicine, technology, and what it means to live well.",
    "ogImage": "/images/og-default.jpg"
  }'),
  ('contact', '{
    "heading": "Get in Touch",
    "subheading": "Whether you have a question, want to collaborate, or just want to say hello — I would love to hear from you.",
    "newsletterHeading": "Join the Newsletter",
    "newsletterSubheading": "Occasional thoughts on medicine, technology, the outdoors, and living well. No spam, ever."
  }');

-- ============================================================
-- HOME PAGE SECTIONS
-- ============================================================
WITH home_id AS (SELECT id FROM pages WHERE slug = 'home')
INSERT INTO page_sections (page_id, type, position, content) VALUES
  (
    (SELECT id FROM home_id),
    'hero',
    0,
    '{
      "heading": "Physician. Climber. Builder.",
      "subheading": "Family medicine physician in training. Former surgical resident. Co-founder of Digital Detox and Camp Grounded. Interested in balance, connection, and the outdoors.",
      "ctaLabel": "Learn more about me",
      "ctaHref": "/about",
      "ctaSecondaryLabel": "See my work",
      "ctaSecondaryHref": "/work",
      "imageAlt": "Zev Felix in Yosemite"
    }'
  ),
  (
    (SELECT id FROM home_id),
    'intro_text',
    1,
    '{
      "text": "I am a physician entering family medicine after training in surgery and trauma. Before medicine, I helped co-found Digital Detox and run Camp Grounded — a summer camp for adults designed around putting down devices and reconnecting with what matters. These two paths, one clinical and one deeply human, are not as different as they sound."
    }'
  ),
  (
    (SELECT id FROM home_id),
    'nav_cards',
    2,
    '{
      "cards": [
        { "label": "About", "href": "/about", "description": "Who I am, where I came from, and what I care about." },
        { "label": "My Path", "href": "/path", "description": "From film school to family medicine — the nonlinear version." },
        { "label": "Unplugged", "href": "/unplugged", "description": "Co-founding Digital Detox and building Camp Grounded." },
        { "label": "Medicine", "href": "/medicine", "description": "Surgery, trauma, and the case for whole-person care." },
        { "label": "Outdoors", "href": "/outdoors", "description": "Climbing, wilderness medicine, and the lessons the mountains teach." },
        { "label": "Work", "href": "/work", "description": "Projects, writing, and tools I have built or contributed to." }
      ]
    }'
  );

-- ============================================================
-- DEFAULT PROJECTS (sample data — edit from admin)
-- ============================================================
INSERT INTO projects (title, slug, description, status, tags, position, is_published) VALUES
  (
    'Digital Detox / Camp Grounded',
    'camp-grounded',
    'Co-founded the company and movement that ran Digital Detox summer camps for adults — helping people unplug from devices and reconnect with themselves, nature, and each other.',
    'completed',
    ARRAY['community', 'wellness', 'entrepreneurship'],
    0,
    true
  ),
  (
    'Wilderness Medicine Practice',
    'wilderness-medicine',
    'Ongoing study and application of wilderness medicine principles — bringing backcountry first-aid skills to outdoor settings from Yosemite to remote climbing objectives.',
    'active',
    ARRAY['medicine', 'outdoors', 'education'],
    1,
    true
  ),
  (
    'This Website',
    'this-website',
    'A personal site and CMS built with Next.js, TypeScript, Tailwind CSS, and Supabase. Open to editing via a secure admin dashboard.',
    'active',
    ARRAY['web', 'technology', 'open-source'],
    2,
    true
  );

-- ============================================================
-- SAMPLE CV ENTRIES
-- ============================================================
INSERT INTO cv_entries (category, title, institution, location, start_date, end_date, position, is_published) VALUES
  ('education',  'Bachelor of Science, Business Administration',   'University of Southern California', 'Los Angeles, CA',    '2006', '2010', 0, true),
  ('education',  'Documentary Film Studies',                       'University of Southern California', 'Los Angeles, CA',    '2006', '2010', 1, true),
  ('education',  'Post-Baccalaureate Pre-Medical Studies',         'University of California',          'California',         '2011', '2013', 2, true),
  ('education',  'Doctor of Osteopathic Medicine (DO)',            'Rocky Vista University',            'Parker, CO',         '2013', '2017', 3, true),
  ('training',   'General Surgery Residency',                      'University Medical Center',         'United States',      '2017', '2022', 0, true),
  ('training',   'Burn Surgery & Acute Care Surgery',              'Regional Burn Center',              'United States',      '2019', '2021', 1, true),
  ('training',   'Family Medicine Residency',                      'Community Health Program',          'United States',      '2022', NULL,   2, true),
  ('leadership', 'Co-Founder & Director',                          'Digital Detox / Camp Grounded',     'San Francisco, CA',  '2012', '2016', 0, true),
  ('leadership', 'Wilderness Medicine Instructor',                 'NOLS Wilderness Medicine',          'Field',              '2015', NULL,   1, true);
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
-- ============================================================
-- 005: Image control layer
--   - Per-image focal point, visibility, and credit on `media`
--   - `image_placements`: assign a media item to a named site area
--     (hero, card, section, background, etc.) with per-placement
--     fit, focal point, desktop + mobile framing, and visibility.
-- ============================================================

-- --- media: framing + visibility + credit -------------------
ALTER TABLE media
  ADD COLUMN IF NOT EXISTS focal_x   integer NOT NULL DEFAULT 50,  -- 0-100
  ADD COLUMN IF NOT EXISTS focal_y   integer NOT NULL DEFAULT 50,  -- 0-100
  ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS credit    text;

-- --- image_placements: assign media to named site areas ------
CREATE TABLE IF NOT EXISTS image_placements (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  area           text NOT NULL UNIQUE,            -- e.g. "home.hero", "about.profile", "unplugged.gallery"
  media_id       uuid REFERENCES media(id) ON DELETE SET NULL,
  fit            text NOT NULL DEFAULT 'cover'
                   CHECK (fit IN ('cover', 'contain', 'fill', 'original')),
  focal_x        integer NOT NULL DEFAULT 50,
  focal_y        integer NOT NULL DEFAULT 50,
  focal_x_mobile integer,                          -- null = use desktop focal
  focal_y_mobile integer,
  aspect         text,                             -- e.g. "16/9", "1/1"; null = area default
  alt_override   text,
  caption        text,
  credit         text,
  is_visible     boolean NOT NULL DEFAULT true,
  updated_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_image_placements_area ON image_placements(area);

-- --- RLS: public read, admin write (mirrors existing tables) -
ALTER TABLE image_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "image_placements_public_read" ON image_placements;
CREATE POLICY "image_placements_public_read" ON image_placements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "image_placements_admin_write" ON image_placements;
CREATE POLICY "image_placements_admin_write" ON image_placements
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());
