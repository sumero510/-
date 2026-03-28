'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserInput } from '@/lib/types'

const defaultInput: UserInput = {
  numPeople: '',
  budget: '',
  familyComposition: '',
  dislikedIngredients: '',
  allergies: '',
  preferredCuisine: '',
  cookingTimePerMeal: '',
  makeAhead: '',
  cookRiceEachTime: '',
  wantsSoup: '',
  priority: '',
  saveName: '',
}

export default function HomePage() {
  const [input, setInput] = useState<UserInput>(defaultInput)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setInput(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const params = new URLSearchParams()
    Object.entries(input).forEach(([k, v]) => {
      if (v) params.set(k, v)
    })
    router.push(`/generate?${params.toString()}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🍽️</div>
          <h2 className="text-2xl font-bold text-orange-700">1週間分の夜ごはん献立を作成します</h2>
          <p className="text-gray-500 mt-2 text-sm">
            以下の項目を入力してください。未入力の場合は一般的な家庭向けの条件で補完します。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ① 人数
              </label>
              <input
                type="text"
                name="numPeople"
                value={input.numPeople}
                onChange={handleChange}
                placeholder="例：3人（大人2・子1）"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ② 1週間の予算
              </label>
              <input
                type="text"
                name="budget"
                value={input.budget}
                onChange={handleChange}
                placeholder="例：25,000円"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ③ 家族構成
            </label>
            <input
              type="text"
              name="familyComposition"
              value={input.familyComposition}
              onChange={handleChange}
              placeholder="例：大人のみ、子どもあり（小学生）、高齢者あり"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ④ 苦手な食材
              </label>
              <input
                type="text"
                name="dislikedIngredients"
                value={input.dislikedIngredients}
                onChange={handleChange}
                placeholder="例：セロリ、レバー"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                アレルギー <span className="text-red-500 text-xs">※最優先</span>
              </label>
              <input
                type="text"
                name="allergies"
                value={input.allergies}
                onChange={handleChange}
                placeholder="例：卵・小麦・そば"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 border-red-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ⑤ 好きな料理ジャンル
            </label>
            <input
              type="text"
              name="preferredCuisine"
              value={input.preferredCuisine}
              onChange={handleChange}
              placeholder="例：和食多め、中華も好き"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⑥ 調理時間の目安
              </label>
              <select
                name="cookingTimePerMeal"
                value={input.cookingTimePerMeal}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">選択してください</option>
                <option value="15〜20分">15〜20分（時短）</option>
                <option value="30分以内">30分以内</option>
                <option value="30〜45分">30〜45分</option>
                <option value="1時間以内">1時間以内</option>
                <option value="時間がかかってもOK">時間がかかってもOK</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ⑦ 重視する点
              </label>
              <select
                name="priority"
                value={input.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">選択してください</option>
                <option value="節約重視">節約重視</option>
                <option value="栄養重視">栄養重視</option>
                <option value="時短重視">時短重視</option>
                <option value="バランス重視">バランス重視</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                作り置き
              </label>
              <select
                name="makeAhead"
                value={input.makeAhead}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">選択</option>
                <option value="希望する">希望する</option>
                <option value="希望しない">希望しない</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ご飯を毎回炊く
              </label>
              <select
                name="cookRiceEachTime"
                value={input.cookRiceEachTime}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">選択</option>
                <option value="はい">はい</option>
                <option value="まとめて炊く">まとめて炊く</option>
                <option value="パン派">パン派</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                汁物
              </label>
              <select
                name="wantsSoup"
                value={input.wantsSoup}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">選択</option>
                <option value="毎日欲しい">毎日欲しい</option>
                <option value="週3〜4回">週3〜4回</option>
                <option value="希望しない">希望しない</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ⑧ 保存名（任意）
            </label>
            <input
              type="text"
              name="saveName"
              value={input.saveName}
              onChange={handleChange}
              placeholder="例：2026年3月第4週献立"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 px-6 rounded-xl transition-colors text-lg shadow-md"
          >
            {loading ? '生成中...' : '🍱 1週間の献立を生成する'}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-orange-50 rounded-xl p-4 border border-orange-200">
        <p className="text-sm text-orange-800 font-medium">💡 ヒント</p>
        <ul className="text-xs text-orange-700 mt-1 space-y-1">
          <li>• 未入力の項目は一般的な家庭向けの条件で自動補完されます</li>
          <li>• アレルギー情報は必ず正確に入力してください</li>
          <li>• 生成された献立は保存・印刷・PDF化できます</li>
        </ul>
      </div>
    </div>
  )
}
