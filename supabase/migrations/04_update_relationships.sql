-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS recipes 
  DROP CONSTRAINT IF EXISTS recipes_user_id_fkey;

-- Recreate the foreign key constraint
ALTER TABLE recipes
  ADD CONSTRAINT recipes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up RLS for profiles if not already set
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or replace policies
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    
    -- Create new policies
    CREATE POLICY "Public profiles are viewable by everyone"
      ON profiles FOR SELECT
      USING ( true );

    CREATE POLICY "Users can insert their own profile"
      ON profiles FOR INSERT
      WITH CHECK ( auth.uid() = id );

    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      USING ( auth.uid() = id );
END $$;

-- Create trigger for handling new users if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for existing users if they don't have one
INSERT INTO profiles (id, email)
SELECT id, email 
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;
