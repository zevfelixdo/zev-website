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
