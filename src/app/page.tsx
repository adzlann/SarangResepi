'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PublicNavbar from '@/components/PublicNavbar';
import Navbar from '@/components/Navbar';
import { Recipe } from '@/types/recipe';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';

export default function Home() {
  const [recipes, setRecipes] = useState<(Recipe & { author_email?: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchPublicRecipes() {
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      if (recipesError) {
        console.error('Error fetching recipes');
        return;
      }

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

      if (recipesError) {
        console.error('Error fetching recipes');
      } else {
        setRecipes(recipesWithAuthors || []);
      }
      setIsLoading(false);
    }

    fetchPublicRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-text-primary">
      {user ? <Navbar /> : <PublicNavbar />}
      
      <main className="max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3 sm:mb-4">
              Discover Amazing Recipes
            </h1>
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl px-4 sm:px-0">
              Join our community of home chefs and food enthusiasts. Share your recipes and discover new favorites.
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-xl sm:text-2xl text-text-secondary">Loading...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-dark-surface rounded-lg overflow-hidden hover:shadow-dark-lg transition-shadow duration-300 border border-dark-border"
                >
                  <Link href={`/recipes/${recipe.id}`}>
                    {recipe.image_url && (
                      <div className="relative w-full h-40 sm:h-48">
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
                    <div className="p-3 sm:p-4">
                      <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-1">{recipe.title}</h3>
                      <p className="text-xs sm:text-sm text-text-secondary mb-2">
                        By {recipe.author_email ? recipe.author_email.split('@')[0] : 'Anonymous'}
                      </p>
                      <p className="text-sm text-text-secondary line-clamp-2">{recipe.description}</p>
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
