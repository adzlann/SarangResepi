'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/utils/supabaseClient';
import { type Comment } from '@/types/comment';
import { formatDistanceToNow } from 'date-fns';

interface Props {
  recipeId: string;
}

export default function Comments({ recipeId }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format email
  const formatEmail = (email: string) => {
    return email.split('@')[0];
  };

  // Helper function to get display name
  const getDisplayName = (comment: Comment) => {
    if (comment.user_full_name) return comment.user_full_name;
    return formatEmail(comment.user_email);
  };

  // Fetch initial comments
  useEffect(() => {
    const fetchComments = async () => {
      console.log('Fetching comments for recipe:', recipeId);
      
      const { data, error } = await supabase
        .from('comments_with_users')
        .select('*')
        .eq('recipe_id', recipeId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching comments:', error);
        setError(error.message);
        return;
      }

      console.log('Fetched comments:', data);
      setComments(data || []);
    };

    fetchComments();
  }, [recipeId]);

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up real-time subscription for recipe:', recipeId);
    
    const channel = supabase
      .channel('comments-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `recipe_id=eq.${recipeId}`,
        },
        async (payload) => {
          console.log('Received real-time event:', payload);

          if (payload.eventType === 'INSERT') {
            // Fetch the complete comment data from the view
            const { data: newComment, error } = await supabase
              .from('comments_with_users')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            console.log('Fetched new comment data:', newComment, 'Error:', error);

            if (newComment) {
              setComments(prev => {
                // Check if comment already exists
                if (prev.some(comment => comment.id === newComment.id)) {
                  console.log('Comment already exists, skipping:', newComment.id);
                  return prev;
                }
                console.log('Adding new comment:', newComment.id);
                return [...prev, newComment];
              });
            }
          } else if (payload.eventType === 'DELETE') {
            console.log('Handling delete for comment:', payload.old.id);
            setComments(prev => prev.filter(comment => comment.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [recipeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting new comment for recipe:', recipeId);
      
      const { data: insertedComment, error } = await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: user.id,
          text: newComment,
        })
        .select()
        .single();

      console.log('Insert result:', insertedComment, 'Error:', error);

      if (error) throw error;

      // Immediately fetch and add the complete comment data
      if (insertedComment) {
        const { data: newComment, error: fetchError } = await supabase
          .from('comments_with_users')
          .select('*')
          .eq('id', insertedComment.id)
          .single();

        console.log('Fetched new comment data:', newComment, 'Error:', fetchError);

        if (newComment) {
          // Only add if it doesn't already exist
          setComments(prev => {
            if (prev.some(comment => comment.id === newComment.id)) {
              console.log('Comment already exists in state, skipping:', newComment.id);
              return prev;
            }
            console.log('Adding new comment to state:', newComment.id);
            return [...prev, newComment];
          });
        }
      }

      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;

    console.log('Deleting comment:', commentId);

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id);

      console.log('Delete result error:', error);

      if (error) throw error;

      // Optimistically remove the comment from the UI
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="mt-8 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Comments</h3>
      
      {/* Comment Form */}
      {user && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col space-y-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-3 border rounded-md text-gray-800 placeholder-gray-500 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              disabled={isSubmitting}
            />
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 w-fit"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-blue-600">
                  {getDisplayName(comment)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at))} ago
                </p>
                <p className="mt-2 text-gray-800">{comment.text}</p>
              </div>
              {user?.id === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
