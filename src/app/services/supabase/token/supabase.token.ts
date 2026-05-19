import { InjectionToken } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';

// Creamos el token vacío (sin factoría por defecto) indicando que guardará un SupabaseClient
export const SUPABASE_CLIENT = new InjectionToken<SupabaseClient>('SUPABASE_CLIENT');