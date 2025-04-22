'use client'

import { useRef, useState } from 'react';
import Image from 'next/image'

export function CameraButton() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState('');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment' // 强制使用后置摄像头
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setPhotoTaken(false);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      
      // 保存照片数据
      setPhotoData(dataUrl);
      setPhotoTaken(true);
      stopCamera();
      
      // 上传到服务器
      uploadPhoto(dataUrl);
    }
  };

  // 添加上传函数
  const uploadPhoto = async (imageData: string) => {
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });
      
      if (!response.ok) {
        throw new Error('上传失败');
      }
      
      const result = await response.json();
      console.log('上传成功:', result);
    } catch (error) {
      console.error('上传错误:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end pb-8">
      {/* 摄像头预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${isCameraOn ? '' : 'hidden'}`}
      />
      
      {/* 拍照结果预览 */}
      {photoTaken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          {photoData ? (
            <img 
              src={photoData} 
              alt="拍照结果" 
              className="max-w-full max-h-[70%] object-contain"
              onLoad={() => console.log('图片加载成功')}
              onError={(e) => {
                console.error('图片加载失败');
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-white">图片加载中...</div>
          )}
          <div className="flex gap-4 mt-4">
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              重新拍照
            </button>
            <button 
              onClick={() => {
                setPhotoTaken(false);
                setIsCameraOn(false); // 确保完全退出拍照模式
                if (videoRef.current?.srcObject) {
                  const stream = videoRef.current.srcObject as MediaStream;
                  stream.getTracks().forEach(track => track.stop());
                }
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              返回
            </button>
          </div>
        </div>
      )}
      
      {/* 拍照按钮 */}
      <button
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
          isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={isCameraOn ? takePhoto : startCamera}
      >
        <Image 
          src={"/icons/camera.png"} 
          alt={isCameraOn ? "拍照" : "开启摄像头"} 
          width={32} 
          height={32} 
        />
      </button>
    </div>
  );
}