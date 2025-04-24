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
        description: item.details 
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
      <div className="grid grid-cols-2 gap-4">
        {historyItems.map(item => (
          <div 
            key={item.id} 
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer"
            style={{ position: 'relative', zIndex: 1 }} // 添加z-index确保元素在最上层
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
            <p className="text-center text-black">{item.description}</p>
            <button 
              className="block ml-auto"
              onClick={(e) => {
                e.stopPropagation(); // 阻止按钮点击事件冒泡
              }}
            >
              <Image 
                src="/icons/play.png" 
                alt="播放" 
                width={24} 
                height={24}
                style={{ pointerEvents: 'none' }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* 添加弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">详细信息</h3>
            <div className="space-y-2">
              {modalData && (
                <>
                  <p><strong>ID:</strong> {modalData.id}</p>
                  <p><strong>标题:</strong> {modalData.title}</p>
                  <p><strong>描述:</strong> {modalData.description}</p>
                  {/* 添加更多动态字段 */}
                </>
              )}
            </div>
            <button 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowModal(false)}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  )
}