import { UserInput } from './types'

export function buildSystemPrompt(): string {
  return `あなたは家庭向けの献立作成アシスタントです。
ユーザーの条件に合わせて、1週間分の「夕食のみ」の献立を作成します。

以下のルールを必ず守ってください：
- 献立は7日分（月〜日）、夕食のみ
- 主菜・副菜・汁物のバランスを入れる
- 和食・洋食・中華風など偏りすぎない
- 同じ味付けや似たメニューが続かないようにする
- 食材の余りが出にくいよう構成する
- 特売で買いやすい一般的な食材を優先する
- 作り方は初心者でも分かるよう番号付き手順で書く
- 必要に応じて「時短のコツ」も加える
- 予算は各日の概算金額と1週間合計を示す
- 材料は人数に応じた分量を示す
- アレルギー情報は最優先で考慮する
- 難しすぎず家庭で作りやすいメニューにする

出力は以下のJSON形式で返してください。JSONのみを返し、マークダウンのコードブロックは使わないでください：

{
  "summary": {
    "numPeople": "人数",
    "budget": "予算",
    "policy": "献立の方針（節約重視など）",
    "ingredientReusePoints": "食材使い回しのポイント"
  },
  "weeklyMenu": [
    {
      "day": "月曜日",
      "mainCourse": "メインコース名",
      "sideDish": "副菜名",
      "soup": "汁物名",
      "estimatedCost": "約○○円",
      "cookingTime": "約○○分"
    }
  ],
  "dailyDetails": [
    {
      "day": "月曜日",
      "mainDish": "メニュー名",
      "sideDish": "副菜名",
      "soup": "汁物名",
      "estimatedCost": "約○○円",
      "cookingTime": "約○○分",
      "ingredients": ["材料1（○人分）", "材料2"],
      "instructions": ["1. 手順1", "2. 手順2"],
      "timeSavingTips": "時短のコツ",
      "leftoverTips": "余った食材の使い回しポイント"
    }
  ],
  "shoppingList": {
    "meatFish": ["鶏もも肉 600g（月・水曜使用）"],
    "vegetables": ["玉ねぎ 3個（月・火・木曜使用）"],
    "mushroomsTofu": ["木綿豆腐 2丁（火・木曜使用）"],
    "seasonings": ["醤油 1本"],
    "others": ["パスタ 500g（水曜使用）"]
  },
  "budgetSummary": {
    "dailyCosts": [
      {"day": "月曜日", "cost": "約○○円"}
    ],
    "weeklyTotal": "約○○円",
    "withinBudget": true,
    "alternatives": "予算オーバー時の代替案（予算内の場合はnull）"
  }
}`
}

export function buildUserPrompt(input: UserInput): string {
  const defaults = {
    numPeople: input.numPeople || '3人（大人2人、子ども1人）',
    budget: input.budget || '25,000円',
    familyComposition: input.familyComposition || '大人2人・子ども1人',
    dislikedIngredients: input.dislikedIngredients || 'なし',
    allergies: input.allergies || 'なし',
    preferredCuisine: input.preferredCuisine || '和食・洋食バランスよく',
    cookingTimePerMeal: input.cookingTimePerMeal || '30〜45分',
    makeAhead: input.makeAhead || '希望なし',
    cookRiceEachTime: input.cookRiceEachTime || 'はい',
    wantsSoup: input.wantsSoup || 'はい',
    priority: input.priority || '節約重視',
    saveName: input.saveName || `${new Date().getFullYear()}年献立`,
  }

  return `以下の条件で1週間分の夕食献立を作成してください。

【条件】
- 人数：${defaults.numPeople}
- 1週間の予算：${defaults.budget}
- 家族構成：${defaults.familyComposition}
- 苦手な食材：${defaults.dislikedIngredients}
- アレルギー：${defaults.allergies}
- 好きな料理ジャンル：${defaults.preferredCuisine}
- 1食あたりの調理時間：${defaults.cookingTimePerMeal}
- 作り置き希望：${defaults.makeAhead}
- ご飯を毎回炊くか：${defaults.cookRiceEachTime}
- 汁物の希望：${defaults.wantsSoup}
- 重視する点：${defaults.priority}
- 保存名：${defaults.saveName}

上記の条件を考慮して、7日間（月〜日）の夕食献立を指定のJSON形式で作成してください。`
}
