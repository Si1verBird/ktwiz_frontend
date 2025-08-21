import './globals.css'

export const metadata = {
  title: 'KT wiz - 공식 모바일 앱',
  description: 'KT wiz 야구단 공식 모바일 애플리케이션',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 overflow-hidden">
        {children}
      </body>
    </html>
  )
}
