import { createClient } from '@insforge/sdk';

export const insforge = createClient({
  baseUrl: 'https://vmi3hxr8.us-east.insforge.app',
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
});