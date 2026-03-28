'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MealPlan } from '@/lib/types'
import { getAllMealPlans, deleteMealPlan, getMealPlanById } from '@/lib/storage'
import MealPlanDisplay from '@/components/MealPlanDisplay'

function HistoryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [plans, setPlans] = useState<MealPlan[]>([])
  const [detail, setDetail] = useState<MealPlan | null>(null)

  useEffect(() => {
    if (id) {
      const found = getMealPlanById(id)
      setDetail(found)
    } else {
      setPlans(getAllMealPlans())
    }
  }, [id])

  const handleDelete = (planId: string, name: string) => {
    if (confirm(`「${name}」を削除しますか？`)) {
      deleteMealPlan(planId)
      setPlans(getAllMealPlans())
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  // --- Detail view ---
  if (id) {
    if (!detail) {
      return (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-600 mb-2">献立が見つかりません</h2>
          <button
            onClick={() => router.push('/history')}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 mt-4"
          >
            履歴に戻る
          </button>
        </div>
      )
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => router.push('/history')}
            className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
          >
            ← 履歴一覧に戻る
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg font-medium text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >
            🖨️ PDF保存
          </button>
        </div>
        <MealPlanDisplay plan={detail} />
      </div>
    )
  }

  // --- List view ---
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-700">📚 保存済み献立</h2>
        <button
          onClick={() => router.push('/')}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-medium text-sm"
        >
          + 新しい献立を作成
        </button>
      </div>

      {plans.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-bold text-gray-500 mb-2">保存された献立がありません</h3>
          <p className="text-gray-400 mb-6">献立を生成して「保存する」ボタンを押すと、ここに表示されます。</p>
          <button
            onClick={() => router.push('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 font-bold"
          >
            🍱 最初の献立を作成する
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{plan.saveName}</h3>
                <div className="flex gap-4 mt-1 text-sm text-gray-500">
                  <span>👥 {plan.numPeople}</span>
                  <span>💰 {plan.budget}</span>
                  <span>🎯 {plan.theme}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(plan.createdAt)}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => router.push(`/history?id=${plan.id}`)}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 font-medium text-sm transition-colors"
                >
                  📖 見る
                </button>
                <button
                  onClick={() => handleDelete(plan.id, plan.saveName)}
                  className="bg-red-50 text-red-500 px-3 py-2 rounded-lg hover:bg-red-100 font-medium text-sm transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-12">
        <div className="text-5xl animate-bounce">📚</div>
        <p className="text-gray-500 mt-4">読み込み中...</p>
      </div>
    }>
      <HistoryContent />
    </Suspense>
  )
}
