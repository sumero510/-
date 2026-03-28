'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MealPlan } from '@/lib/types'
import { getMealPlanById } from '@/lib/storage'
import MealPlanDisplay from '@/components/MealPlanDisplay'

export default function MealPlanDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [plan, setPlan] = useState<MealPlan | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const id = params.id as string
    const found = getMealPlanById(id)
    if (found) {
      setPlan(found)
    } else {
      setNotFound(true)
    }
  }, [params.id])

  if (notFound) {
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

  if (!plan) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl animate-bounce">🍳</div>
        <p className="text-gray-500 mt-4">読み込み中...</p>
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
      <MealPlanDisplay plan={plan} />
    </div>
  )
}
