import Image from 'next/image'
import { useEffect, useState } from 'react'


interface Recommend {
  id: number;
  url: string;
  title: string;
  description: string;
}
export function TodayRecommend() {
  const [recommend, setRecommend] = useState<Recommend>({id: 0, url: '', title: '', description: ''})
  useEffect(() => {
    fetchData().then((data) => {
      console.log(data)
      setRecommend({id: data.data[0].id, url: data.data[0].url, title: data.data[0].title, description: data.data[0].title})
    })
  }, [])
  async function fetchData(): Promise<any> {
    const res = await fetch('/api/recommend', {
      method: 'GET',
    })
    return await res.json()
  }

  return (
    <div className="mb-6">
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Image src="/icons/calendar.png" alt="日历" width={24} height={24} />
        <span className="ml-2 text-black">今日推荐</span>
      </h2>
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <Image
          src={recommend.url}
          alt={recommend.title}
          width={200}
          height={200}
          className="mx-auto mb-3"
        />
        <p className="text-center text-lg text-black">{recommend.title}</p>
        <p className="text-center text-gray-500">今日推荐</p>
      </div>
    </div>
  )
}