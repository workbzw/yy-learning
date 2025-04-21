import Image from 'next/image'
export function TodayRecommend() {
  return (
    <div className="mb-6">
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Image src="/icons/calendar.png" alt="日历" width={24} height={24} />
        <span className="ml-2 text-black">今日推荐</span>
      </h2>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Image 
          src="/images/chair.png"
          alt="椅子"
          width={200}
          height={200}
          className="mx-auto mb-3"
        />
        <p className="text-center text-lg text-black">这是一把椅子</p>
        <p className="text-center text-gray-500">今日推荐</p>
      </div>
    </div>
  )
}