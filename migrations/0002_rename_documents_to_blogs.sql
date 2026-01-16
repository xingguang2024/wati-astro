-- Rename documents table to blogs
ALTER TABLE documents RENAME TO blogs;

-- Drop old indexes
DROP INDEX IF EXISTS idx_documents_user_id;
DROP INDEX IF EXISTS idx_documents_slug;
DROP INDEX IF EXISTS idx_documents_status;

-- Create new indexes with updated names
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status);
