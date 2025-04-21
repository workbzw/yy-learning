import Image from 'next/image'
export function SearchBar() {
  return (
    <div className="relative mb-6">
      <input
        type="text"
        placeholder="搜索..."
        className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-blue-400"
      />
      <button className="absolute right-3 top-1/2 -translate-y-1/2">
        <Image src="/icons/search.png" alt="搜索" width={20} height={20} />
      </button>
    </div>
  )
}