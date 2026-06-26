import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Worker = {
  id: string
  name: string
  phone: string
  profession: string
  experience: string
  city: string
  photo_url?: string
  rating?: number
  review_count?: number
  created_at: string
  verified?: boolean
}

export type Job = {
  id: string
  name: string
  phone: string
  city: string
  description: string
  profession?: string
  created_at: string
  status: 'open' | 'closed'
}

export const PROFESSIONS = [
  { id: 'electrician', tj: 'Барқкаш', ru: 'Электрик', icon: '⚡' },
  { id: 'plumber', tj: 'Сантехник', ru: 'Сантехник', icon: '🔧' },
  { id: 'painter', tj: 'Рангрез', ru: 'Маляр', icon: '🎨' },
  { id: 'welder', tj: 'Ҷӯшкор', ru: 'Сварщик', icon: '🔥' },
  { id: 'builder', tj: 'Бинокор', ru: 'Строитель', icon: '🏗️' },
  { id: 'tile', tj: 'Кошинкор', ru: 'Плиточник', icon: '🟦' },
  { id: 'carpenter', tj: 'Дӯредгар', ru: 'Плотник', icon: '🪚' },
  { id: 'general', tj: 'Коргари умумӣ', ru: 'Разнорабочий', icon: '👷' },
]

export const CITIES = [
  'Душанбе', 'Хуҷанд', 'Кӯлоб', 'Бохтар', 'Истаравшан',
  'Исфара', 'Хоруғ', 'Турсунзода', 'Ваҳдат', 'Нораки'
]

export const MOCK_WORKERS: Worker[] = [
  { id: '1', name: 'Алишер Раҳимов', phone: '+992 900 123 456', profession: 'electrician', experience: '5 сол', city: 'Душанбе', rating: 4.8, review_count: 24, created_at: '2024-01-01', verified: true },
  { id: '2', name: 'Баҳром Назаров', phone: '+992 917 234 567', profession: 'plumber', experience: '7 сол', city: 'Хуҷанд', rating: 4.9, review_count: 31, created_at: '2024-01-02', verified: true },
  { id: '3', name: 'Давлат Юсупов', phone: '+992 934 345 678', profession: 'builder', experience: '10 сол', city: 'Душанбе', rating: 4.7, review_count: 18, created_at: '2024-01-03', verified: false },
  { id: '4', name: 'Фируз Каримов', phone: '+992 918 456 789', profession: 'painter', experience: '4 сол', city: 'Кӯлоб', rating: 4.6, review_count: 12, created_at: '2024-01-04', verified: true },
  { id: '5', name: 'Ҷамшед Мирзоев', phone: '+992 935 567 890', profession: 'welder', experience: '8 сол', city: 'Бохтар', rating: 5.0, review_count: 42, created_at: '2024-01-05', verified: true },
  { id: '6', name: 'Санҷар Тошматов', phone: '+992 901 678 901', profession: 'tile', experience: '6 сол', city: 'Хуҷанд', rating: 4.5, review_count: 9, created_at: '2024-01-06', verified: false },
  { id: '7', name: 'Умед Ҳасанов', phone: '+992 919 789 012', profession: 'carpenter', experience: '12 сол', city: 'Душанбе', rating: 4.9, review_count: 55, created_at: '2024-01-07', verified: true },
  { id: '8', name: 'Шерзод Абдуллоев', phone: '+992 936 890 123', profession: 'general', experience: '3 сол', city: 'Истаравшан', rating: 4.3, review_count: 7, created_at: '2024-01-08', verified: false },
]
