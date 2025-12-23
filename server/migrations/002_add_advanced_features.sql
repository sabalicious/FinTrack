-- Migration: Add currencies, accounts, budgets, transfers and related tables
-- Also modifies existing tables to support new features

-- 1. Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(3) NOT NULL UNIQUE,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(5) NOT NULL,
  exchange_rate DECIMAL(10, 4) DEFAULT 1.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert default currencies
INSERT INTO currencies (code, name, symbol, exchange_rate) VALUES
  ('USD', 'US Dollar', '$', 1.0),
  ('EUR', 'Euro', '€', 0.92),
  ('RUB', 'Russian Ruble', '₽', 103.5),
  ('GBP', 'British Pound', '£', 0.79),
  ('JPY', 'Japanese Yen', '¥', 150.0),
  ('CNY', 'Chinese Yuan', '¥', 7.24)
ON CONFLICT (code) DO NOTHING;

-- 3. Create accounts table
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('debit', 'credit', 'cash', 'savings', 'investment')),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  initial_balance DECIMAL(15, 2) DEFAULT 0,
  current_balance DECIMAL(15, 2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  limit_amount DECIMAL(15, 2) NOT NULL CHECK (limit_amount > 0),
  period VARCHAR(20) DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  spent_amount DECIMAL(15, 2) DEFAULT 0,
  currency_id UUID NOT NULL REFERENCES currencies(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, category_id, period, start_date)
);

-- 5. Create transfers table
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  from_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  to_account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
  amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
  currency_id UUID NOT NULL REFERENCES currencies(id),
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'rejected', 'cancelled')),
  transfer_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT different_users CHECK (from_user_id != to_user_id)
);

-- 6. Create account_balances table (for history)
CREATE TABLE IF NOT EXISTS account_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  previous_balance DECIMAL(15, 2),
  new_balance DECIMAL(15, 2) NOT NULL,
  transaction_type VARCHAR(50),
  reference_id UUID,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- 7. Modify transactions table (add new columns if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='category_id') THEN
    ALTER TABLE transactions ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='account_id') THEN
    ALTER TABLE transactions ADD COLUMN account_id UUID REFERENCES accounts(id) ON DELETE SET NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='transactions' AND column_name='currency_id') THEN
    ALTER TABLE transactions ADD COLUMN currency_id UUID REFERENCES currencies(id);
  END IF;
END $$;

-- 8. Modify users table (add new columns if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='default_currency_id') THEN
    ALTER TABLE users ADD COLUMN default_currency_id UUID REFERENCES currencies(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='total_balance') THEN
    ALTER TABLE users ADD COLUMN total_balance DECIMAL(15, 2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='updated_at') THEN
    ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();
  END IF;
END $$;

-- 9. Modify goals table (add new columns if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goals' AND column_name='currency_id') THEN
    ALTER TABLE goals ADD COLUMN currency_id UUID REFERENCES currencies(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='goals' AND column_name='category_id') THEN
    ALTER TABLE goals ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_category_id ON budgets(category_id);
CREATE INDEX IF NOT EXISTS idx_transfers_from_user ON transfers(from_user_id);
CREATE INDEX IF NOT EXISTS idx_transfers_to_user ON transfers(to_user_id);
CREATE INDEX IF NOT EXISTS idx_account_balances_account_id ON account_balances(account_id);
CREATE INDEX IF NOT EXISTS idx_transactions_category_id ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_transactions_account_id ON transactions(account_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Migration completed: Added currencies, accounts, budgets, transfers, and account_balances tables';
  RAISE NOTICE 'Modified transactions, users, and goals tables with new columns';
END $$;
