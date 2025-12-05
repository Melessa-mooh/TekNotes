-- Add password column to group_chats table if it doesn't exist
ALTER TABLE group_chats ADD COLUMN IF NOT EXISTS password VARCHAR(255);

