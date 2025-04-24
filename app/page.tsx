'use client'
import Image from 'next/image'
import { SearchBar } from '@/components/SearchBar'
import { TodayRecommend } from '@/components/TodayRecommend'
import { HistoryList } from '@/components/HistoryList'
import { CameraButton } from '@/components/CameraButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 pb-20"> {/* 增加底部内边距 */}
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
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


      {/* 可滑动内容区域 */}
      <div className="overflow-y-auto h-[calc(100vh-200px)]">
        <div className="min-h-full"> {/* 添加这个包装div */}
          {/* Search Bar */}
          <SearchBar />

          {/* Today's Recommendation */}
          <TodayRecommend />

          {/* History */}
          <HistoryList />
        </div>
      </div>

      {/* 底部固定栏位 */}
      <CameraButton />
    </main>
  )
}