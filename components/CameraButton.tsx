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
      
      // 直接转换为Blob对象(JPG格式)
      canvas.toBlob(async (blob) => {
        if (blob) {
          setPhotoTaken(true);
          stopCamera();
          
          // 创建临时URL用于预览
          const objectUrl = URL.createObjectURL(blob);
          setPhotoData(objectUrl);
          
          // 上传Blob对象
          await uploadPhoto(blob);
        }
      }, 'image/jpeg', 0.9); // 0.9表示JPEG质量
    }
  };

  const uploadPhoto = async (imageBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('image', imageBlob, 'photo.jpg');
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData // 不需要设置Content-Type头部
      });
      
      if (!response.ok) {
        alert('上传失败');
        throw new Error('上传失败');
      }
      
      const result = await response.json();
      console.log('上传成功:', result);
      alert("上传成功："+result.msg);
      window.location.reload()

    } catch (error) {
      alert("上传错误"+error);
      console.error('上传错误:', error);
      window.location.reload()
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end pb-8 pointer-events-none">
      {/* 摄像头预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${isCameraOn ? '' : 'hidden'} pointer-events-auto`}
      />
      
      {/* 拍照结果预览 */}
      {photoTaken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black pointer-events-auto">
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
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg pointer-events-auto ${
          isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
        }`}
        onClick={isCameraOn ? takePhoto : startCamera}
      >
        <Image 
          src={"/icons/camera.png"} 
          alt={isCameraOn ? "拍照" : "开启摄像头"} 
          width={24} 
          height={24} 
        />
      </button>
    </div>
  );
}