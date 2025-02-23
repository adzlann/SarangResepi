-- Add ingredients and instructions columns to recipes table
ALTER TABLE recipes
ADD COLUMN ingredients TEXT NOT NULL DEFAULT '',
ADD COLUMN instructions TEXT NOT NULL DEFAULT '';
