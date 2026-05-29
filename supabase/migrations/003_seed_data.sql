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
