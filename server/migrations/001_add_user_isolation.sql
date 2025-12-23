-- Migration: Add user_id isolation to transactions and goals tables
-- This script ensures each user sees only their own data

-- 1. Add user_id column to transactions table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='transactions' AND column_name='user_id'
  ) THEN
    -- First, add the column as nullable with correct type (uuid or integer based on users table)
    ALTER TABLE transactions ADD COLUMN user_id UUID;
    
    -- Get the first user's ID to associate existing transactions
    -- If no users exist, we'll handle this gracefully
    UPDATE transactions 
    SET user_id = (SELECT id FROM users LIMIT 1) 
    WHERE user_id IS NULL AND EXISTS (SELECT 1 FROM users LIMIT 1);
    
    -- Make user_id NOT NULL only if we have users
    IF EXISTS (SELECT 1 FROM transactions WHERE user_id IS NULL) THEN
      RAISE WARNING 'Some transactions have NULL user_id because no users exist in the database. Please create users first.';
    ELSE
      ALTER TABLE transactions ALTER COLUMN user_id SET NOT NULL;
      
      -- Add foreign key constraint
      ALTER TABLE transactions 
        ADD CONSTRAINT fk_transactions_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      
      -- Create index for better query performance
      CREATE INDEX idx_transactions_user_id ON transactions(user_id);
    END IF;
    
    RAISE NOTICE 'Added user_id column to transactions table';
  ELSE
    RAISE NOTICE 'user_id column already exists in transactions table';
  END IF;
END
$$;

-- 2. Add user_id column to goals table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='goals' AND column_name='user_id'
  ) THEN
    -- First, add the column as nullable with correct type (uuid or integer based on users table)
    ALTER TABLE goals ADD COLUMN user_id UUID;
    
    -- Get the first user's ID to associate existing goals
    UPDATE goals 
    SET user_id = (SELECT id FROM users LIMIT 1) 
    WHERE user_id IS NULL AND EXISTS (SELECT 1 FROM users LIMIT 1);
    
    -- Make user_id NOT NULL only if we have users
    IF EXISTS (SELECT 1 FROM goals WHERE user_id IS NULL) THEN
      RAISE WARNING 'Some goals have NULL user_id because no users exist in the database. Please create users first.';
    ELSE
      ALTER TABLE goals ALTER COLUMN user_id SET NOT NULL;
      
      -- Add foreign key constraint
      ALTER TABLE goals 
        ADD CONSTRAINT fk_goals_user_id 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
      
      -- Create index for better query performance
      CREATE INDEX idx_goals_user_id ON goals(user_id);
    END IF;
    
    RAISE NOTICE 'Added user_id column to goals table';
  ELSE
    RAISE NOTICE 'user_id column already exists in goals table';
  END IF;
END
$$;

-- Verify the migration
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name IN ('transactions', 'goals') AND column_name = 'user_id'
ORDER BY table_name;
