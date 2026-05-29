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
