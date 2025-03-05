import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabaseClient';
import { PostgrestError } from '@supabase/supabase-js';

// Using the standard Web API Request type
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  console.log('[API Debug] GET Request:', {
    params: context.params,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const { id } = context.params;

    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('[API Error] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!recipe) {
      console.warn('[API Warning] Recipe not found:', id);
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    console.log('[API Success] Recipe found:', recipe.id);
    return NextResponse.json(recipe);
  } catch (err) {
    const error = err as Error | PostgrestError;
    console.error('[API Error] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  console.log('[API Debug] PUT Request:', {
    params: context.params,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const { id } = context.params;
    const body = await request.json();

    console.log('[API Debug] Update recipe request:', { id, body });

    const { data, error } = await supabase
      .from('recipes')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API Error] Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('[API Success] Recipe updated:', id);
    return NextResponse.json(data);
  } catch (err) {
    const error = err as Error | PostgrestError;
    console.error('[API Error] Update error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  console.log('[API Debug] DELETE Request:', {
    params: context.params,
    url: request.url,
    timestamp: new Date().toISOString()
  });

  try {
    const { id } = context.params;

    console.log('[API Debug] Delete recipe request:', id);

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[API Error] Supabase delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log('[API Success] Recipe deleted:', id);
    return NextResponse.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    const error = err as Error | PostgrestError;
    console.error('[API Error] Delete error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
} 