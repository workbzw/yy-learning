import Image from 'next/image'
export function HistoryList() {
  const dates = ['11-09', '11-10', '11-11', '11-12']
  
  return (
    <div className="mb-20">
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Image src="/icons/history.png" alt="历史" width={24} height={24} />
        <span className="ml-2">历史识别</span>
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
        {[1,2].map(i => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <Image
              src="/images/chair.png" 
              alt="椅子"
              width={150}
              height={150}
              className="mx-auto mb-3"
            />
            <p className="text-center">这是一把椅子</p>
            <button className="block ml-auto">
              <Image src="/icons/play.png" alt="播放" width={24} height={24} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}