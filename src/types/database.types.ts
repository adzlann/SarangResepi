export type Recipe = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Comment = {
  id: string;
  recipe_id: string;
  user_id: string;
  text: string;
  created_at: string;
  updated_at: string;
};
