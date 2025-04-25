'use client'
import Image from 'next/image'
import { SearchBar } from '@/components/SearchBar'
import { TodayRecommend } from '@/components/TodayRecommend'
import { HistoryList } from '@/components/HistoryList'
import { CameraButton } from '@/components/CameraButton'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header 部分 - 固定不动 */}
      <header className="sticky top-0 z-51 bg-white p-4">
        <div className="flex items-center">
          <Image
            src="/logo.png"
            alt="粤语学习"
            width={32}
            height={32}
          />
          <span className="ml-2 text-lg font-medium text-black">粤语学习</span>
        </div>
        <div className="flex gap-4">
          <button className="p-2 rounded-full hover:bg-gray-100" style={{
            backgroundImage: 'url(/images/e.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image src="/icons/search_w.png" alt="搜索" width={16} height={16} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" style={{
            backgroundImage: 'url(/images/e.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image src="/icons/list.png" alt="列表" width={16} height={16} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100" style={{
            backgroundImage: 'url(/images/e.png)',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '30px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Image src="/icons/settings.png" alt="设置" width={16} height={16} />
          </button>
        </div>
      </header>

      {/* Content 部分 - 可滑动内容 */}
      <main className="absolute top-[64px] bottom-[100px] left-0 right-0 overflow-y-auto p-4 bg-gradient-to-b from-sky-50 to-white">
        {/* Search Bar */}
        <SearchBar />
        
        {/* Today's Recommendation */}
        <div style={{pointerEvents: 'auto'}}>
          <TodayRecommend />
        </div>
        
        {/* History */}
        <HistoryList />
      </main>

      {/* Tab 部分 - 底部固定栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4" style={{ 
        height: '100px'
      }}>
        <CameraButton />
      </div>
    </div>
  )
}