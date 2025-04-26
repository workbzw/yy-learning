'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  details: string;
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
        details: item.details // 使用title作为description
      })))
    })
  }, [])

  const [modalData, setModalData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePlayClick = (item: HistoryItem) => {
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
      <div className="grid grid-cols-2 gap-4" >
        {historyItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer pointer-events-auto"
            style={{ position: 'relative', pointerEvents: 'auto' }}
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
              className="block ml-auto"
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
          className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-[100]"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white p-8 rounded-xl max-w-md w-full z-[101] shadow-xl border border-gray-200 mx-4 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white"></h3>
              <button
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-700 px-2">
              {modalData && (
                <>
                  {/* <div className="flex">
                    <span className="font-medium w-20">ID:</span>
                    <span>{modalData.id}</span>
                  </div> */}
                  {/* <div className="flex">
                    <span className="font-medium w-20">标题:</span>
                    <span>{modalData.title}</span>
                  </div> */}
                  {/* <div className="flex"> */}
                  {/* <span className="font-medium w-20">描述:</span> */}
                  <div className="flex flex-col space-y-4">
                    {modalData.details && JSON.parse(modalData.details).map((item: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="mb-2">
                          <span className="font-medium"> </span>
                          <span>{item.data}</span>
                        </div>
                        <div className="space-y-2">
                          {item.note.map((noteItem: any, noteIndex: number) => (
                            <div key={noteIndex} className="border-l-2 border-blue-200 pl-3">
                              {noteItem.context.pron && <div className="flex items-center">
                                <span className="font-medium mr-2">发音:</span>
                                <span>{noteItem.context.pron}</span>
                              </div>}
                              {noteItem.context.english && <div className="flex items-center">
                                <span className="font-medium mr-2">英文:</span>
                                <span>{noteItem.context.english}</span>
                              </div>}
                              {noteItem.context.voxel && (
                                <div className="mt-2">
                                  <iframe
                                    src={noteItem.context.voxel}
                                    className="w-full h-40 border rounded-lg"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                </div>
                              )}
                              {noteItem.context.描述 && <div className="flex items-center">
                                <span className="font-medium mr-2"></span>
                                <span>{noteItem.context.描述}</span>
                              </div>}
                              {noteItem.context.粤语 && <div className="flex items-center">
                                {/* <span>{noteItem.context.粤语}</span> */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const audio = new Audio(noteItem.context.粤语);
                                    audio.play();
                                  }}
                                  className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <span className="font-medium mr-2">粤语</span>
                              </div>}
                              {noteItem.context.普通话 && <div className="flex items-center">
                                {/* <span>{noteItem.context.普通话}</span> */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const audio = new Audio(noteItem.context.普通话);
                                    audio.play();
                                  }}
                                  className="ml-2 p-1 rounded-full bg-blue-100 hover:bg-blue-200"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <span className="font-medium mr-2">普通话</span>
                              </div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {modalData.details && JSON.parse(modalData.details)[0]?.tags?.map((tag: string, tagIndex: number) => (
                      <span
                        key={tagIndex}
                        className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* </div> */}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}