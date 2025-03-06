import { getRecipe } from '@/utils/getRecipe';
import { notFound } from 'next/navigation';
import EditRecipeForm from './EditRecipeForm';

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditRecipePage({ params }: Props) {
  const { id } = await params;

  try {
    const recipe = await getRecipe(id);

    if (!recipe) {
      notFound();
    }

    return <EditRecipeForm recipe={recipe} />;
  } catch (error) {
    console.error('Error loading recipe:', error);
    notFound();
  }
}