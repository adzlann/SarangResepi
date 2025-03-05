'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { uploadImage } from '@/utils/uploadImage';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import Navbar from '@/components/Navbar';

export default function CreateRecipe() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a recipe');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage(image);
      }

      const { data, error: insertError } = await supabase
        .from('recipes')
        .insert([
          {
            title,
            description,
            ingredients,
            instructions,
            image_url: imageUrl,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Redirect to the new recipe page
      router.push(`/recipes/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <div className="min-h-screen bg-dark py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="bg-dark-surface rounded-lg shadow-dark-md border border-dark-border p-6">
            <h1 className="text-3xl font-bold text-text-primary mb-6">Create New Recipe</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 text-status-error p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-primary">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-dark-border bg-dark-surface2 shadow-dark-sm focus:border-accent focus:ring-accent text-text-primary"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-dark-border bg-dark-surface2 shadow-dark-sm focus:border-accent focus:ring-accent text-text-primary"
                />
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-text-primary">
                  Ingredients
                </label>
                <textarea
                  id="ingredients"
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  rows={5}
                  required
                  placeholder="Enter each ingredient on a new line"
                  className="mt-1 block w-full rounded-md border-dark-border bg-dark-surface2 shadow-dark-sm focus:border-accent focus:ring-accent font-mono text-text-primary placeholder:text-text-secondary"
                />
              </div>

              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-text-primary">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={8}
                  required
                  placeholder="Enter each step on a new line"
                  className="mt-1 block w-full rounded-md border-dark-border bg-dark-surface2 shadow-dark-sm focus:border-accent focus:ring-accent font-mono text-text-primary placeholder:text-text-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary">Recipe Image</label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer bg-dark-surface2 py-2 px-3 border border-dark-border rounded-md shadow-dark-sm text-sm leading-4 font-medium text-text-primary hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent">
                    Upload Image
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                  </label>
                  {preview && (
                    <div className="relative h-20 w-20">
                      <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-text-primary bg-dark-surface2 border border-dark-border rounded-md shadow-dark-sm hover:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-black bg-accent hover:bg-accent-hover border border-transparent rounded-md shadow-dark-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
