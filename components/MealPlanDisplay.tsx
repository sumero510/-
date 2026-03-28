'use client'

import { MealPlan } from '@/lib/types'

interface Props {
  plan: MealPlan
}

const DAY_EMOJI: Record<string, string> = {
  '月曜日': '🌙', '火曜日': '🔥', '水曜日': '💧',
  '木曜日': '🌲', '金曜日': '✨', '土曜日': '🌸', '日曜日': '☀️',
}

export default function MealPlanDisplay({ plan }: Props) {
  return (
    <div className="space-y-6">
      {/* Title for print */}
      <div className="text-center hidden print:block mb-6">
        <h1 className="text-2xl font-bold">🍱 {plan.saveName}</h1>
        <p className="text-sm text-gray-500">
          作成日：{new Date(plan.createdAt).toLocaleDateString('ja-JP')} ／
          人数：{plan.numPeople} ／ 予算：{plan.budget}
        </p>
      </div>

      {/* Summary */}
      {plan.summary && Object.keys(plan.summary).length > 0 && (
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            📋 献立の概要
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="font-semibold text-orange-800">対象人数</p>
              <p className="text-gray-700">{plan.summary.numPeople || plan.numPeople}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="font-semibold text-orange-800">1週間予算</p>
              <p className="text-gray-700">{plan.summary.budget || plan.budget}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="font-semibold text-orange-800">献立の方針</p>
              <p className="text-gray-700">{plan.summary.policy || plan.theme}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3">
              <p className="font-semibold text-orange-800">食材使い回しポイント</p>
              <p className="text-gray-700">{plan.summary.ingredientReusePoints || '—'}</p>
            </div>
          </div>
        </section>
      )}

      {/* Weekly menu table */}
      {plan.weeklyMenu && plan.weeklyMenu.length > 0 && (
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            📅 1週間の献立表
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-orange-100">
                  <th className="text-left p-2 rounded-tl-lg font-semibold text-orange-800">曜日</th>
                  <th className="text-left p-2 font-semibold text-orange-800">メインコース</th>
                  <th className="text-left p-2 font-semibold text-orange-800">副菜</th>
                  <th className="text-left p-2 font-semibold text-orange-800">汁物</th>
                  <th className="text-left p-2 font-semibold text-orange-800">概算</th>
                  <th className="text-left p-2 rounded-tr-lg font-semibold text-orange-800">時間</th>
                </tr>
              </thead>
              <tbody>
                {plan.weeklyMenu.map((row, i) => (
                  <tr
                    key={i}
                    className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="p-2 font-medium text-gray-700">
                      {DAY_EMOJI[row.day] || ''} {row.day}
                    </td>
                    <td className="p-2 text-gray-700">{row.mainCourse}</td>
                    <td className="p-2 text-gray-600">{row.sideDish}</td>
                    <td className="p-2 text-gray-600">{row.soup}</td>
                    <td className="p-2 text-gray-700 whitespace-nowrap">{row.estimatedCost}</td>
                    <td className="p-2 text-gray-600 whitespace-nowrap">{row.cookingTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Daily details */}
      {plan.dailyDetails && plan.dailyDetails.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            🍽️ 各日の詳細レシピ
          </h2>
          <div className="space-y-4">
            {plan.dailyDetails.map((day, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md p-6 print-break"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {DAY_EMOJI[day.day] || ''} {day.day}
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {day.estimatedCost}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {day.cookingTime}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-red-500 font-semibold">主菜</p>
                    <p className="text-sm font-medium text-gray-800">{day.mainDish}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-green-600 font-semibold">副菜</p>
                    <p className="text-sm font-medium text-gray-800">{day.sideDish}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-blue-500 font-semibold">汁物</p>
                    <p className="text-sm font-medium text-gray-800">{day.soup}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Ingredients */}
                  {day.ingredients && day.ingredients.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm">🛒 材料</h4>
                      <ul className="text-sm text-gray-600 space-y-0.5">
                        {day.ingredients.map((ing, j) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-orange-400 mt-0.5">•</span>
                            <span>{ing}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Instructions */}
                  {day.instructions && day.instructions.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2 text-sm">📝 作り方</h4>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {day.instructions.map((step, j) => (
                          <li key={j} className="flex items-start gap-1">
                            <span className="text-orange-500 font-bold min-w-[1.2rem]">{j + 1}.</span>
                            <span>{step.replace(/^\d+[\.\)]\s*/, '')}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>

                {(day.timeSavingTips || day.leftoverTips) && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {day.timeSavingTips && (
                      <div className="bg-yellow-50 rounded-lg p-2">
                        <p className="text-xs font-semibold text-yellow-700">⚡ 時短のコツ</p>
                        <p className="text-xs text-gray-600 mt-0.5">{day.timeSavingTips}</p>
                      </div>
                    )}
                    {day.leftoverTips && (
                      <div className="bg-purple-50 rounded-lg p-2">
                        <p className="text-xs font-semibold text-purple-700">♻️ 食材の使い回し</p>
                        <p className="text-xs text-gray-600 mt-0.5">{day.leftoverTips}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Shopping list */}
      {plan.shoppingList && Object.keys(plan.shoppingList).length > 0 && (
        <section className="bg-white rounded-2xl shadow-md p-6 print-break">
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            🛒 1週間分の買い物リスト
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {plan.shoppingList.meatFish && plan.shoppingList.meatFish.length > 0 && (
              <ShoppingCategory
                title="🥩 肉・魚"
                items={plan.shoppingList.meatFish}
                color="red"
              />
            )}
            {plan.shoppingList.vegetables && plan.shoppingList.vegetables.length > 0 && (
              <ShoppingCategory
                title="🥦 野菜"
                items={plan.shoppingList.vegetables}
                color="green"
              />
            )}
            {plan.shoppingList.mushroomsTofu && plan.shoppingList.mushroomsTofu.length > 0 && (
              <ShoppingCategory
                title="🍄 きのこ・豆腐・卵"
                items={plan.shoppingList.mushroomsTofu}
                color="yellow"
              />
            )}
            {plan.shoppingList.seasonings && plan.shoppingList.seasonings.length > 0 && (
              <ShoppingCategory
                title="🧂 調味料"
                items={plan.shoppingList.seasonings}
                color="orange"
              />
            )}
            {plan.shoppingList.others && plan.shoppingList.others.length > 0 && (
              <ShoppingCategory
                title="📦 その他"
                items={plan.shoppingList.others}
                color="gray"
              />
            )}
          </div>
        </section>
      )}

      {/* Budget summary */}
      {plan.budgetSummary && plan.budgetSummary.weeklyTotal && (
        <section className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-bold text-orange-700 mb-4 flex items-center gap-2">
            💰 予算まとめ
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 text-sm">各日の概算金額</h3>
              <div className="space-y-1">
                {plan.budgetSummary.dailyCosts?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100">
                    <span className="text-gray-600">{item.day}</span>
                    <span className="font-medium text-gray-800">{item.cost}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className={`rounded-xl p-4 text-center ${
                plan.budgetSummary.withinBudget
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className="text-sm font-semibold text-gray-600">1週間合計</p>
                <p className={`text-3xl font-bold mt-1 ${
                  plan.budgetSummary.withinBudget ? 'text-green-700' : 'text-red-700'
                }`}>
                  {plan.budgetSummary.weeklyTotal}
                </p>
                <p className={`text-sm mt-1 font-medium ${
                  plan.budgetSummary.withinBudget ? 'text-green-600' : 'text-red-600'
                }`}>
                  {plan.budgetSummary.withinBudget ? '✓ 予算内' : '⚠ 予算オーバー'}
                </p>
              </div>
              {plan.budgetSummary.alternatives && !plan.budgetSummary.withinBudget && (
                <div className="mt-3 bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-yellow-700">代替案</p>
                  <p className="text-xs text-gray-600 mt-1">{plan.budgetSummary.alternatives}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Saved data section */}
      <section className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
          💾 保存データ
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="font-semibold text-gray-500">保存名：</span>{plan.saveName}</div>
          <div><span className="font-semibold text-gray-500">作成日：</span>{new Date(plan.createdAt).toLocaleDateString('ja-JP')}</div>
          <div><span className="font-semibold text-gray-500">人数：</span>{plan.numPeople}</div>
          <div><span className="font-semibold text-gray-500">予算：</span>{plan.budget}</div>
          <div><span className="font-semibold text-gray-500">テーマ：</span>{plan.theme}</div>
        </div>
      </section>
    </div>
  )
}

function ShoppingCategory({
  title,
  items,
  color,
}: {
  title: string
  items: string[]
  color: string
}) {
  const colorMap: Record<string, string> = {
    red: 'bg-red-50 border-red-200',
    green: 'bg-green-50 border-green-200',
    yellow: 'bg-yellow-50 border-yellow-200',
    orange: 'bg-orange-50 border-orange-200',
    gray: 'bg-gray-50 border-gray-200',
  }
  return (
    <div className={`rounded-xl border p-3 ${colorMap[color] ?? 'bg-gray-50 border-gray-200'}`}>
      <h4 className="font-semibold text-sm text-gray-700 mb-2">{title}</h4>
      <ul className="space-y-0.5">
        {items.map((item, i) => (
          <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
            <span className="mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
