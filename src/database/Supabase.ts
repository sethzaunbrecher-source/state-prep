import {createClient} from '@supabase/supabase-js'

const supaBaseUrl:string= import.meta.env.VITE_SUPABASE_URL
let supaBaseKey:string="xxx"

console.log(import.meta.env)
if(import.meta.env.MODE=='development'){

   supaBaseKey= import.meta.env.VITE_SUPABASE_KEY
   
}
export const supabase = createClient(supaBaseUrl,supaBaseKey)