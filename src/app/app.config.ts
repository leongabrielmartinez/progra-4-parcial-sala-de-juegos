import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// 1. Importas la función para crear el cliente de Supabase
import { createClient } from '@supabase/supabase-js';
// 2. Importas tu token (ajusta la ruta según tu proyecto)
import { SUPABASE_CLIENT } from './services/supabase/token/supabase.token';
// 3. Importas tus variables de entorno
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    
    // 4. Registras el token de Supabase en los proveedores globales
    {
      provide: SUPABASE_CLIENT,
      useFactory: () => createClient(environment.supabaseUrl, environment.supabaseKey)
    }
  ]
};