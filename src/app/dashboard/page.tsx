'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Recipe } from '@/types/recipe';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (!loading && !user) {
      console.log('No authenticated user, redirecting to home');
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchUserRecipes() {
      if (user) {
        console.log('Fetching recipes for user:', user.id);
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching recipes:', error);
        } else {
          console.log('Recipes data:', data);
          setRecipes(data || []);
        }
        setIsLoading(false);
      }
    }

    fetchUserRecipes();
  }, [user, supabase]);

  const handleDeleteRecipe = async (recipeId: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) {
        console.error('Error deleting recipe:', error);
      } else {
        setRecipes(recipes.filter(recipe => recipe.id !== recipeId));
      }
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-2xl text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">My Recipes</h2>
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-dark-sm text-black bg-accent hover:bg-accent-hover transition-colors"
            >
              Create New Recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary text-lg">You haven&apos;t created any recipes yet.</p>
              <Link
                href="/recipes/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-black bg-accent hover:bg-accent-hover transition-colors"
              >
                Create your first recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-dark-surface border border-dark-border overflow-hidden shadow-dark-md rounded-lg hover:shadow-dark-lg transition-all duration-300 group flex flex-col"
                >
                  <Link href={`/recipes/${recipe.id}`} className="cursor-pointer block flex-grow">
                    {recipe.image_url && (
                      <div className="relative w-full h-48">
                        <Image
                          src={recipe.image_url}
                          alt={recipe.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          priority={false}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">{recipe.title}</h3>
                      <p className="text-text-secondary line-clamp-2 mb-4">{recipe.description}</p>
                    </div>
                  </Link>
                  <div className="flex justify-end space-x-2 px-4 pb-4 mt-auto border-t border-dark-border pt-4">
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="inline-flex items-center p-2 text-accent hover:text-accent-hover transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="inline-flex items-center p-2 text-status-error hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
