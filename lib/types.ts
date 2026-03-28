export interface UserInput {
  numPeople: string
  budget: string
  familyComposition: string
  dislikedIngredients: string
  allergies: string
  preferredCuisine: string
  cookingTimePerMeal: string
  makeAhead: string
  cookRiceEachTime: string
  wantsSoup: string
  priority: string
  saveName: string
}

export interface DayMenu {
  day: string
  mainDish: string
  sideDish: string
  soup: string
  estimatedCost: string
  cookingTime: string
  ingredients: string[]
  instructions: string[]
  timeSavingTips: string
  leftoverTips: string
}

export interface ShoppingCategory {
  meatFish: string[]
  vegetables: string[]
  mushroomsTofu: string[]
  seasonings: string[]
  others: string[]
}

export interface BudgetSummary {
  dailyCosts: { day: string; cost: string }[]
  weeklyTotal: string
  withinBudget: boolean
  alternatives?: string
}

export interface MealPlan {
  id: string
  saveName: string
  createdAt: string
  numPeople: string
  budget: string
  theme: string
  summary: {
    numPeople: string
    budget: string
    policy: string
    ingredientReusePoints: string
  }
  weeklyMenu: {
    day: string
    mainCourse: string
    sideDish: string
    soup: string
    estimatedCost: string
    cookingTime: string
  }[]
  dailyDetails: DayMenu[]
  shoppingList: ShoppingCategory
  budgetSummary: BudgetSummary
  rawContent: string
}

export interface GenerateRequest {
  userInput: UserInput
}
