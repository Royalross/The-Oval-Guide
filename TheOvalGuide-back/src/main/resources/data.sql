-- Strip common honorifics from existing slugs
UPDATE professors
SET slug = REGEXP_REPLACE(slug, '^(dr-|prof-|professor-)', '')
WHERE slug ~ '^(dr-|prof-|professor-)';

-- sanity check
SELECT id, name, slug FROM professors ORDER BY created_at;