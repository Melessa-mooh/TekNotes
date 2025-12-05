-- Migration script to add status column to reviews and downloads tables
-- Run this script on your MySQL database

-- Add status column to reviews table
ALTER TABLE reviews 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';

-- Update existing reviews to have ACTIVE status
UPDATE reviews 
SET status = 'ACTIVE' 
WHERE status IS NULL;

-- Add status column to downloads table
ALTER TABLE downloads 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';

-- Update existing downloads to have ACTIVE status
UPDATE downloads 
SET status = 'ACTIVE' 
WHERE status IS NULL;

