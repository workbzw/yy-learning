'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  description: string;
}

export function HistoryList() {
  const dates = ['11-09', '11-10', '11-11', '11-12']
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
  async function fetchData(): Promise<any> {
    const res = await fetch('/api/history', {
      method: 'GET',
    })
    return await res.json()
  }

  useEffect(() => {
    fetchData().then((res) => {
      setHistoryItems(res.data.map((item: any) => ({
        id: item.id,
        url: item.url,
        title: item.title,
        description: item.details // 使用title作为description
      })))
    })
  }, [])

  const [modalData, setModalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = (item: HistoryItem) => {
    console.log("----------------------------------------")
    console.log(item)
    setModalData(item);
    setShowModal(true);
  };

  return (
    <div className="mb-20">
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Image src="/icons/history.png" alt="历史" width={24} height={24} />
        <span className="ml-2 text-black">历史识别</span>
      </h2>
      <div className="flex gap-2 mb-4">
        {dates.map(date => (
          <button
            key={date}
            className="px-4 py-1 rounded-full bg-blue-100 text-blue-600 first:bg-blue-500 first:text-white"
          >
            {date}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4" style={{ zIndex: 0 }}>
        {historyItems.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer pointer-events-auto"
            style={{ position: 'relative', zIndex: 1 ,pointerEvents: 'auto'}}
            onClick={() => {
              console.log("Div clicked - 测试点击");
              handlePlayClick(item);
            }}
          >
            <Image
              src={item.url}
              alt={item.title}
              width={150}
              height={150}
              className="mx-auto mb-3"
            />
            <p className="text-center text-black">{item.title}</p>
            <button 
              className="block ml-auto z-[9999]"
              onClick={(e) => {
                e.stopPropagation();
                handlePlayClick(item); // 添加播放按钮的点击处理
              }}
            >
              {/* <Image 
                src="/icons/play.png" 
                alt="播放" 
                width={24} 
                height={24}
                style={{ pointerEvents: 'none' }}
              /> */}
            </button>
          </div>
        ))}
      </div>

      {/* 添加弹窗 */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md w-full z-[101] shadow-xl border border-gray-200 dark:border-gray-700 mx-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">详细信息</h3>
              <button 
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300 px-2">
              {modalData && (
                <>
                  <div className="flex">
                    <span className="font-medium w-20">ID:</span>
                    <span>{modalData.id}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">标题:</span>
                    <span>{modalData.title}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-20">描述:</span>
                    <span>{modalData.description}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}