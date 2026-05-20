import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zycqmcrtgyjsgenfqrfq.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Y3FtY3J0Z3lqc2dlbmZxcmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2OTI2MzAsImV4cCI6MjA5MDI2ODYzMH0.32JuXVVwwZgfx3WQvowZ94gyvsaz_d7gKSo4Egjvpzo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export const FUNCTIONS_URL = `${SUPABASE_URL}/functions/v1`
