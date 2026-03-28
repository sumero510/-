'use client'

import Anthropic from '@anthropic-ai/sdk'
import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { UserInput, MealPlan } from '@/lib/types'
import { saveMealPlan, generateId } from '@/lib/storage'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'
import MealPlanDisplay from '@/components/MealPlanDisplay'

function GenerateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null)
  const [saved, setSaved] = useState(false)
  const hasFetched = useRef(false)

  const userInput: UserInput = {
    numPeople: searchParams.get('numPeople') ?? '',
    budget: searchParams.get('budget') ?? '',
    familyComposition: searchParams.get('familyComposition') ?? '',
    dislikedIngredients: searchParams.get('dislikedIngredients') ?? '',
    allergies: searchParams.get('allergies') ?? '',
    preferredCuisine: searchParams.get('preferredCuisine') ?? '',
    cookingTimePerMeal: searchParams.get('cookingTimePerMeal') ?? '',
    makeAhead: searchParams.get('makeAhead') ?? '',
    cookRiceEachTime: searchParams.get('cookRiceEachTime') ?? '',
    wantsSoup: searchParams.get('wantsSoup') ?? '',
    priority: searchParams.get('priority') ?? '',
    saveName: searchParams.get('saveName') ?? '',
  }

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const fetchMealPlan = async () => {
      const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
      if (!apiKey) {
        setError('APIキーが設定されていません。環境変数 NEXT_PUBLIC_ANTHROPIC_API_KEY を確認してください。')
        setLoading(false)
        return
      }

      try {
        // GitHub Pages (static export) では API Route が使えないため、
        // ブラウザから Anthropic SDK を直接呼び出します
        const client = new Anthropic({
          apiKey,
          dangerouslyAllowBrowser: true,
        })

        const stream = client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 8000,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: buildUserPrompt(userInput) }],
        })

        let fullContent = ''
        for await (const event of stream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            fullContent += event.delta.text
            setContent(fullContent)
          }
        }

        // Parse JSON from the streamed content
        try {
          const jsonMatch = fullContent.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            const plan: MealPlan = {
              id: generateId(),
              saveName: userInput.saveName || `${new Date().getFullYear()}年献立`,
              createdAt: new Date().toISOString(),
              numPeople: userInput.numPeople || '3人',
              budget: userInput.budget || '25,000円',
              theme: userInput.priority || '節約重視',
              summary: parsed.summary ?? {},
              weeklyMenu: parsed.weeklyMenu ?? [],
              dailyDetails: parsed.dailyDetails ?? [],
              shoppingList: parsed.shoppingList ?? {},
              budgetSummary: parsed.budgetSummary ?? {},
              rawContent: fullContent,
            }
            setMealPlan(plan)
          }
        } catch {
          // If JSON parsing fails, still show the raw content
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '献立の生成に失敗しました')
      } finally {
        setLoading(false)
      }
    }

    fetchMealPlan()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    if (!mealPlan) return
    saveMealPlan(mealPlan)
    setSaved(true)
  }

  const handleViewHistory = () => {
    if (mealPlan) {
      saveMealPlan(mealPlan)
    }
    router.push('/history')
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-red-600 mb-2">エラーが発生しました</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
        >
          やり直す
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Action bar */}
      <div className="flex justify-between items-center mb-6 no-print">
        <button
          onClick={() => router.push('/')}
          className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
        >
          ← 入力画面に戻る
        </button>
        <div className="flex gap-3">
          {mealPlan && (
            <>
              <button
                onClick={handleSave}
                disabled={saved}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  saved
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {saved ? '✓ 保存済み' : '💾 保存する'}
              </button>
              <button
                onClick={handleViewHistory}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                📚 履歴を見る
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
              >
                🖨️ PDF保存
              </button>
            </>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="text-5xl animate-bounce">🍳</div>
            <div>
              <h2 className="text-xl font-bold text-orange-700">献立を生成中...</h2>
              <p className="text-gray-500 text-sm mt-1">Claude AIが最適な1週間分の献立を考えています</p>
            </div>
            <div className="w-full max-w-md bg-gray-100 rounded-lg p-4 text-left">
              <p className="text-xs text-gray-500 mb-2">生成中のプレビュー：</p>
              <div className="text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto font-mono">
                {content || '...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && mealPlan && (
        <MealPlanDisplay plan={mealPlan} />
      )}

      {!loading && !mealPlan && content && (
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-xl font-bold text-orange-700 mb-4">生成結果</h2>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">{content}</pre>
        </div>
      )}
    </div>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="text-5xl animate-bounce">🍳</div>
        <p className="text-gray-500 mt-4">読み込み中...</p>
      </div>
    }>
      <GenerateContent />
    </Suspense>
  )
}
