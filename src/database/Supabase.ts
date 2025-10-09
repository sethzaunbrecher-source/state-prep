import {createClient} from '@supabase/supabase-js'

let supaBaseUrl:string="xxx"
let supaBaseKey:string="xxx"

console.log(import.meta.env)
if(import.meta.env.MODE=='development'){

   supaBaseUrl= import.meta.env.VITE_SUPABASE_URL
   supaBaseKey= import.meta.env.VITE_SUPABASE_KEY
   
}
export const supabase = createClient(supaBaseUrl,supaBaseKey)