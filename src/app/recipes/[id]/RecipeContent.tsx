'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { type RecipeWithAuthor } from '@/utils/getRecipe';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/utils/supabaseClient';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import PublicNavbar from '@/components/PublicNavbar';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import Comments from './Comments';

interface Props {
  recipe: RecipeWithAuthor;
}

export default function RecipeContent({ recipe }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const [timeAgo, setTimeAgo] = useState<string>('');
  const isOwner = user?.id === recipe.user_id;

  useEffect(() => {
    const timestamp = recipe.updated_at ? new Date(recipe.updated_at) : new Date(recipe.created_at);
    setTimeAgo(formatDistanceToNow(timestamp) + ' ago');
  }, [recipe.updated_at, recipe.created_at]);

  // Debug image URL
  useEffect(() => {
    if (recipe.image_url) {
      console.log('Image URL:', recipe.image_url);
      // Try to fetch the image to check if it's accessible
      fetch(recipe.image_url)
        .then(res => {
          console.log('Image fetch status:', res.status);
          if (!res.ok) {
            console.error('Image fetch failed:', res.statusText);
          }
        })
        .catch(err => {
          console.error('Image fetch error:', err);
          console.log('Failed URL structure:', {
            bucket: 'recipes',
            folder: 'recipe-images',
            fullUrl: recipe.image_url
          });
        });
    }
  }, [recipe.image_url]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      // Delete the image from storage if it exists
      if (recipe.image_url) {
        const imagePath = recipe.image_url.split('/').slice(-2).join('/'); // Get 'recipe-images/filename.jpg'
        const { error: storageError } = await supabase.storage
          .from('recipes')
          .remove([imagePath]);

        if (storageError) {
          console.error('Error deleting image:', storageError);
        }
      }

      // Delete the recipe from the database
      const { error: deleteError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipe.id);

      if (deleteError) throw deleteError;
      router.push('/dashboard');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      throw new Error(err instanceof Error ? err.message : 'Error deleting recipe');
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      {user ? <Navbar /> : <PublicNavbar />}
      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <BackButton />
        </div>
        <div className="max-w-4xl mx-auto bg-dark-surface rounded-lg shadow-dark-lg overflow-hidden border border-dark-border">
          {recipe.image_url && (
            <div className="relative w-full h-[300px] sm:h-[400px] overflow-hidden bg-dark-surface2">
              <Image 
                src={recipe.image_url} 
                alt={recipe.title}
                fill
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image load error:', e);
                  const img = e.target as HTMLImageElement;
                  console.log('Failed URL:', img.src);
                }}
              />
            </div>
          )}
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {recipe.title}
                </h1>
                <div className="text-sm text-text-secondary mb-4">
                  <span>By {recipe.author_email.split('@')[0]}</span>
                  <span className="mx-2">•</span>
                  <span>{timeAgo}</span>
                </div>
                {recipe.description && (
                  <p className="text-text-secondary mb-6">
                    {recipe.description}
                  </p>
                )}
              </div>
              {isOwner && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                    className="text-sm text-accent hover:text-accent-hover transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="text-sm text-status-error hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {user ? (
              <div className="prose prose-dark max-w-none">
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 tracking-wide">
                    Ingredients
                  </h2>
                  <pre className="whitespace-pre-wrap bg-dark-surface2 p-6 rounded-lg text-text-primary text-base font-normal leading-relaxed border border-dark-border">
                    {recipe.ingredients}
                  </pre>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-text-primary mb-4 tracking-wide">
                    Instructions
                  </h2>
                  <pre className="whitespace-pre-wrap bg-dark-surface2 p-6 rounded-lg text-text-primary text-base font-normal leading-relaxed border border-dark-border">
                    {recipe.instructions}
                  </pre>
                </section>
              </div>
            ) : (
              <div className="mt-8 bg-dark-surface2 border border-dark-border rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold text-text-primary mb-4">Want to see the full recipe?</h3>
                <p className="text-text-secondary mb-6">Sign in to view the complete ingredients list and step-by-step instructions.</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-dark-sm text-black bg-accent hover:bg-accent-hover transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-accent hover:text-accent-hover transition-colors font-medium"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Comments Section */}
        <Comments recipeId={recipe.id} />
      </div>
    </div>
  );
}
