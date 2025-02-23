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
          // Log image URLs to check their format and accessibility
          data?.forEach(recipe => {
            if (recipe.image_url) {
              console.log('Recipe image URL:', recipe.image_url);
            }
          });
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Recipes</h2>
            <Link
              href="/recipes/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Create New Recipe
            </Link>
          </div>

          {recipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">You haven&apos;t created any recipes yet.</p>
              <Link
                href="/recipes/create"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-600 bg-emerald-100 hover:bg-emerald-200"
              >
                Create your first recipe
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300 group flex flex-col"
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{recipe.title}</h3>
                      <p className="text-gray-600 line-clamp-2 mb-4">{recipe.description}</p>
                    </div>
                  </Link>
                  <div className="flex justify-end space-x-2 px-4 pb-4 mt-auto border-t pt-4">
                    <Link
                      href={`/recipes/${recipe.id}/edit`}
                      className="inline-flex items-center p-2 text-emerald-600 hover:text-emerald-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="inline-flex items-center p-2 text-red-600 hover:text-red-700"
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
