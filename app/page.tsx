'use client'

import Image from 'next/image'
import { SearchBar } from '@/components/SearchBar'
import { TodayRecommend } from '@/components/TodayRecommend'
import { HistoryList } from '@/components/HistoryList'
import { CameraButton } from '@/components/CameraButton'


// 定义 Header 组件
const Header = () => {
  const handleClick = () => {
    alert('Header被点击了');
  };

  return (
    <header
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 10
      }}
    >
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="粤语智识"
          width={32}
          height={32}
        />
        <span className="ml-2 text-lg font-medium text-black">粤语智识</span>
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
  );
};

// 定义 Main 组件
const Main = () => {
  const handleItemClick = (index: number) => {
    alert(`Main中的第${index + 1}项被点击了`);
  };

  return (
    <main style={{ marginTop: '80px', marginBottom: '80px', padding: '20px', overflowY: 'auto', height: 'calc(100vh - 160px)' }}>
      <SearchBar />

      {/* Today's Recommendation */}
      <div style={{ pointerEvents: 'auto' }}>
        <TodayRecommend />
      </div>

      {/* History */}
      <HistoryList />
    </main>
  );
};

// 定义 Footer 组件
const Footer = () => {
  const handleClick = () => {
    alert('Footer被点击了');
  };

  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '50px',
        textAlign: 'center',
        cursor: 'pointer',
        backgroundColor: 'white',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ position: 'relative', zIndex: 10 }}>
        <CameraButton  />
      </div>
    </footer>
  );
};
export default function Home() {
  return (<div>
    <Header />
    <Main />
    <Footer />
  </div>
  )
}