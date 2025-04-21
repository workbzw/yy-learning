import Image from 'next/image'
export function CameraButton() {
  return (
    <button className="fixed bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600">
      <Image src="/icons/camera.png" alt="相机" width={32} height={32} />
    </button>
  )
}