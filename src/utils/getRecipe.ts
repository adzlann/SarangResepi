import { supabase } from './supabaseClient';
import { Recipe } from '@/types/database.types';

export type RecipeWithAuthor = Recipe & {
  author_email: string;
};

export async function getRecipe(id: string): Promise<RecipeWithAuthor | null> {
  try {
    // First get the recipe
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (recipeError || !recipe) {
      console.error('Error fetching recipe');
      return null;
    }

    // Then get the author's email from profiles
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', recipe.user_id)
      .single();

    if (profileError) {
      console.error('Error fetching profile');
    }

    return {
      ...recipe,
      author_email: profileData?.email || 'Unknown Author'
    } as RecipeWithAuthor;
    
  } catch {
    console.error('Error processing recipe request');
    return null;
  }
}
