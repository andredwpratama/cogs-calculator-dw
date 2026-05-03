-- Supabase Migration: Create tables for COGS Calculator
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)

-- ============================================
-- Table: projects
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  overhead_percent DOUBLE PRECISION NOT NULL DEFAULT 10,
  gp_percent DOUBLE PRECISION NOT NULL DEFAULT 15,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- Table: cost_items
-- ============================================
CREATE TABLE IF NOT EXISTS cost_items (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  part_number TEXT,
  quantity DOUBLE PRECISION NOT NULL DEFAULT 1,
  unit_price DOUBLE PRECISION NOT NULL DEFAULT 0,
  metadata JSONB
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cost_items_project_id ON cost_items(project_id);
CREATE INDEX IF NOT EXISTS idx_projects_updated_at ON projects(updated_at DESC);
