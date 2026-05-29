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
