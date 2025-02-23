export interface Comment {
  id: string;
  recipe_id: string;
  user_id: string;
  text: string;
  created_at: string;
  user_email: string;
  user_full_name: string | null;
}
