import { MealPlan } from './types'

const STORAGE_KEY = 'meal_plans'

export function saveMealPlan(plan: MealPlan): void {
  const plans = getAllMealPlans()
  const existingIndex = plans.findIndex(p => p.id === plan.id)
  if (existingIndex >= 0) {
    plans[existingIndex] = plan
  } else {
    plans.unshift(plan)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function getAllMealPlans(): MealPlan[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return []
  try {
    return JSON.parse(stored) as MealPlan[]
  } catch {
    return []
  }
}

export function getMealPlanById(id: string): MealPlan | null {
  const plans = getAllMealPlans()
  return plans.find(p => p.id === id) ?? null
}

export function deleteMealPlan(id: string): void {
  const plans = getAllMealPlans().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

export function generateId(): string {
  return `plan_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
