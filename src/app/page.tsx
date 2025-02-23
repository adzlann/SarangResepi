'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import PublicNavbar from '@/components/PublicNavbar';
import Navbar from '@/components/Navbar';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const [recipes, setRecipes] = useState<(Recipe & { author_email?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPublicRecipes() {
      console.log('Fetching recipes...');
      // First get all recipes
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipesError) {
        console.error('Error fetching recipes:', recipesError);
        return;
      }

      // Then get profiles for each recipe
      const recipesWithAuthors = await Promise.all(
        (recipesData || []).map(async (recipe) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('email')
            .eq('id', recipe.user_id)
            .single();
          
          return {
            ...recipe,
            author_email: profileData?.email
          };
        })
      );

      console.log('Recipes with authors:', recipesWithAuthors);
      
      const data = recipesWithAuthors;
      const error = recipesError;

      if (data) {
        console.log('Recipes found:', data.length);
        console.log('First recipe:', data[0]);
      }

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        console.log('Fetched recipes:', data);
        setRecipes(data || []);
      }
      setIsLoading(false);
    }

    fetchPublicRecipes();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? <Navbar /> : <PublicNavbar />}
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Recipes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Join our community of home chefs and food enthusiasts. Share your recipes and discover new favorites.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-2xl">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <Link href={`/recipes/${recipe.id}`}>
                    {recipe.image_url && (
                      <div className="relative w-full h-48">
                        <Image
                          src={recipe.image_url}
                          alt={recipe.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{recipe.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        By {recipe.author_email ? recipe.author_email.split('@')[0] : 'Anonymous'}
                      </p>
                      <p className="text-gray-600 line-clamp-2">{recipe.description}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
