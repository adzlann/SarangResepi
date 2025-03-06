import { getRecipe } from '@/utils/getRecipe';
import { notFound } from 'next/navigation';
import RecipeContent from './RecipeContent';
import { type ReactNode } from 'react';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function RecipePage({ params }: Props): Promise<ReactNode> {
  const { id } = await params;

  try {
    const recipe = await getRecipe(id);

    if (!recipe) {
      notFound();
    }

    return <RecipeContent recipe={recipe} />;
  } catch (error) {
    console.error('Error loading recipe:', error);
    notFound();
  }
}
