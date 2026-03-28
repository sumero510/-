'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MealPlan } from '@/lib/types'
import { getAllMealPlans, deleteMealPlan } from '@/lib/storage'

export default function HistoryPage() {
  const [plans, setPlans] = useState<MealPlan[]>([])
  const router = useRouter()

  useEffect(() => {
    setPlans(getAllMealPlans())
  }, [])

  const handleDelete = (id: string, name: string) => {
    if (confirm(`「${name}」を削除しますか？`)) {
      deleteMealPlan(id)
      setPlans(getAllMealPlans())
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

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
                  onClick={() => router.push(`/history/${plan.id}`)}
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
