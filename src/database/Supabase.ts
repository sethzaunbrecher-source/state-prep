import {createClient} from '@supabase/supabase-js'

const supaBaseUrl:string= import.meta.env.SUPABASE_URL
const supaBaseKey:string= import.meta.env.SUPABASE_KEY

console.log(import.meta.env)

export const supabase = createClient(supaBaseUrl,supaBaseKey)