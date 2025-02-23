export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  image_url?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    email: string;
  };
}
