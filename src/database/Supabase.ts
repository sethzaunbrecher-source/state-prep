import {createClient} from '@supabase/supabase-js'


const supaBaseUrl:any= import.meta.env.VITE_SUPABASE_URL
const supaBaseKey:any = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supaBaseUrl,supaBaseKey)