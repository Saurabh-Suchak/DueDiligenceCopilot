/*
  # Create Documents and Extractions Tables

  ## Overview
  Creates tables to store parsed documents from Landing AI ADE API and their extracted data.

  ## New Tables
  
  ### `documents`
  Stores uploaded and parsed documents with their metadata and content.
  - `id` (uuid, primary key) - Unique document identifier
  - `user_id` (uuid) - ID of the user who uploaded the document (for future auth integration)
  - `filename` (text) - Original filename of the uploaded document
  - `file_url` (text, nullable) - URL to the stored document file
  - `markdown` (text) - Parsed markdown content from ADE Parse API
  - `chunks` (jsonb) - Chunked content with grounding information
  - `splits` (jsonb, nullable) - Split sections if page-level splitting was used
  - `metadata` (jsonb) - Metadata from ADE API (page_count, duration_ms, job_id, etc.)
  - `status` (text) - Processing status: 'pending', 'processing', 'completed', 'failed'
  - `created_at` (timestamptz) - Timestamp when document was created
  - `updated_at` (timestamptz) - Timestamp when document was last updated

  ### `extractions`
  Stores structured data extracted from documents using JSON schemas.
  - `id` (uuid, primary key) - Unique extraction identifier
  - `document_id` (uuid, foreign key) - References the source document
  - `schema` (jsonb) - The JSON schema used for extraction
  - `extraction` (jsonb) - Extracted structured data
  - `extraction_metadata` (jsonb) - Metadata about the extraction process
  - `metadata` (jsonb) - API metadata (duration_ms, job_id, etc.)
  - `created_at` (timestamptz) - Timestamp when extraction was created

  ## Security
  - Enable RLS on both tables
  - Add policies for authenticated users to manage their own data
  - Future: policies will check user_id matches auth.uid()

  ## Important Notes
  1. user_id is included for future authentication integration
  2. All JSON data is stored as jsonb for efficient querying
  3. Status field allows tracking document processing pipeline
  4. Foreign key constraint ensures data integrity between documents and extractions
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  filename text NOT NULL,
  file_url text,
  markdown text,
  chunks jsonb,
  splits jsonb,
  metadata jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create extractions table
CREATE TABLE IF NOT EXISTS extractions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  schema jsonb NOT NULL,
  extraction jsonb,
  extraction_metadata jsonb,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_extractions_document_id ON extractions(document_id);
CREATE INDEX IF NOT EXISTS idx_extractions_created_at ON extractions(created_at DESC);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE extractions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents table
-- For now, allow all operations (will be restricted when auth is added)
CREATE POLICY "Allow public read access to documents"
  ON documents FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to documents"
  ON documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to documents"
  ON documents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from documents"
  ON documents FOR DELETE
  USING (true);

-- RLS Policies for extractions table
CREATE POLICY "Allow public read access to extractions"
  ON extractions FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert to extractions"
  ON extractions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update to extractions"
  ON extractions FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from extractions"
  ON extractions FOR DELETE
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();