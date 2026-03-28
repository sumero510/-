import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI献立アシスタント',
  description: '家庭向けの1週間分の夕食献立を自動生成します',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen">
        <header className="bg-orange-600 text-white shadow-md no-print">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🍱</span>
              <div>
                <h1 className="text-xl font-bold">AI献立アシスタント</h1>
                <p className="text-orange-100 text-xs">1週間分の夕食献立を自動生成</p>
              </div>
            </div>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="hover:text-orange-200 transition-colors font-medium">
                ✏️ 新しい献立
              </a>
              <a href="/history" className="hover:text-orange-200 transition-colors font-medium">
                📚 履歴
              </a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="text-center text-gray-500 text-xs py-6 no-print">
          AI献立アシスタント — Claude Opus 4.6 powered
        </footer>
      </body>
    </html>
  )
}
