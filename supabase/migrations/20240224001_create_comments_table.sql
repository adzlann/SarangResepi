-- Create comments table
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES auth.users(id)
        ON DELETE CASCADE
);

-- Create secure view with user data
CREATE OR REPLACE VIEW public.comments_with_users AS
WITH user_data AS (
    SELECT id, email, raw_user_meta_data->>'full_name' as full_name
    FROM auth.users
)
SELECT 
    c.id,
    c.recipe_id,
    c.user_id,
    c.text,
    c.created_at,
    u.email as user_email,
    u.full_name as user_full_name
FROM public.comments c
LEFT JOIN user_data u ON c.user_id = u.id;

-- Grant access to the view
GRANT SELECT ON public.comments_with_users TO authenticated;

-- Enable Row Level Security (RLS)
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow users to create comments" ON public.comments
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow users to view comments" ON public.comments
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "Allow users to delete their own comments" ON public.comments
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX comments_recipe_id_idx ON public.comments(recipe_id);
CREATE INDEX comments_user_id_idx ON public.comments(user_id);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
