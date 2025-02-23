import { supabase } from './supabaseClient';
import { Recipe } from '@/types/database.types';

export type RecipeWithAuthor = Recipe & {
  author_email: string;
};

export async function getRecipe(id: string): Promise<RecipeWithAuthor | null> {
  // First get the recipe
  const { data: recipe, error: recipeError } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  console.log('Recipe data:', recipe); // Debug log

  if (recipeError || !recipe) {
    console.error('Error fetching recipe:', recipeError);
    return null;
  }

  // Then get the author's email from profiles
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', recipe.user_id)
    .single();

  console.log('Profile data:', profileData); // Debug log

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  const result = {
    ...recipe,
    author_email: profileData?.email || 'Unknown Author'
  } as RecipeWithAuthor;

  console.log('Final recipe data:', result); // Debug log

  return result;
}
