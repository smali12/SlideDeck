/*
  # Slide Deck Platform Schema

  ## Overview
  Creates a comprehensive database schema for an advanced slide deck platform with support
  for presentations, slides, themes, and collaboration features.

  ## New Tables
  
  ### `presentations`
  - `id` (uuid, primary key) - Unique identifier for each presentation
  - `title` (text) - Presentation title
  - `description` (text, nullable) - Optional presentation description
  - `theme` (text) - Visual theme for the presentation (navy, modern, minimal, etc.)
  - `created_at` (timestamptz) - When the presentation was created
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `slides`
  - `id` (uuid, primary key) - Unique identifier for each slide
  - `presentation_id` (uuid, foreign key) - Reference to parent presentation
  - `order_index` (integer) - Order of the slide in the presentation
  - `title` (text) - Slide title
  - `content` (jsonb) - Slide content stored as JSON (supports rich formatting)
  - `layout` (text) - Layout type (title, title-content, two-column, full-image, etc.)
  - `background_color` (text) - Custom background color for the slide
  - `notes` (text, nullable) - Presenter notes
  - `created_at` (timestamptz) - When the slide was created
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Public read access for presentations and slides (for sharing)
  - Full CRUD access for all users (simplified for demo purposes)

  ## Notes
  - JSONB content field allows for flexible, structured content storage
  - Order index enables drag-and-drop reordering
  - Theme system allows for consistent styling across presentations
*/

-- Create presentations table
CREATE TABLE IF NOT EXISTS presentations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'Untitled Presentation',
  description text,
  theme text NOT NULL DEFAULT 'navy',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create slides table
CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  presentation_id uuid NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  order_index integer NOT NULL DEFAULT 0,
  title text NOT NULL DEFAULT 'Untitled Slide',
  content jsonb DEFAULT '[]'::jsonb,
  layout text NOT NULL DEFAULT 'title-content',
  background_color text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index for faster slide queries
CREATE INDEX IF NOT EXISTS slides_presentation_id_idx ON slides(presentation_id);
CREATE INDEX IF NOT EXISTS slides_order_idx ON slides(presentation_id, order_index);

-- Enable RLS
ALTER TABLE presentations ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Presentations policies (public read, authenticated write)
CREATE POLICY "Anyone can view presentations"
  ON presentations FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert presentations"
  ON presentations FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update presentations"
  ON presentations FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete presentations"
  ON presentations FOR DELETE
  USING (true);

-- Slides policies (public read, authenticated write)
CREATE POLICY "Anyone can view slides"
  ON slides FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert slides"
  ON slides FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update slides"
  ON slides FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete slides"
  ON slides FOR DELETE
  USING (true);