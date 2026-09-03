import { createClient as createBrowserClient } from './supabase/client'
import { createClient as createServerClient } from './supabase/server'

// Client browser (Client Component)
export const supabase = createBrowserClient()

// Helper function untuk client browser
export { createBrowserClient, createServerClient }
