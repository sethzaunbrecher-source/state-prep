import {createClient} from '@supabase/supabase-js'

   const supaBaseUrl:string= import.meta.env.VITE_SUPABASE_URL
   const supaBaseKey:string= import.meta.env.VITE_SUPABASE_KEY
    
    export const supabase = createClient(supaBaseUrl,supaBaseKey)