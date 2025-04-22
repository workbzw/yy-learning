'use client'

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image'

export function CameraButton() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // 自动启动摄像头
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
        setPhotoTaken(false);
        setIsPreviewMode(false);
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

  const enterPreviewMode = () => {
    setIsPreviewMode(true);
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
      setPhotoData(dataUrl);
      setPhotoTaken(true);
      setIsPreviewMode(false);
      stopCamera();
    }
  };

  const handleBack = () => {
    setPhotoTaken(false);
    startCamera();
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* 摄像头预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${!photoTaken && isCameraOn && !isPreviewMode ? '' : 'hidden'}`}
      />
      
      {/* 预览模式 */}
      {isPreviewMode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <button
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600"
              onClick={takePhoto}
            >
              <Image 
                src="/icons/camera.png" 
                alt="确认拍照" 
                width={32} 
                height={32} 
              />
            </button>
          </div>
        </div>
      )}
      
      {/* 拍照结果预览 */}
      {photoTaken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <img 
            src={photoData} 
            alt="拍照结果" 
            className="max-w-full max-h-[70%] object-contain"
          />
          <div className="flex gap-4 mt-4">
            <button 
              onClick={startCamera}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              重新拍照
            </button>
            <button 
              onClick={handleBack}
              className="px-4 py-2 bg-gray-500 text-white rounded"
            >
              返回
            </button>
          </div>
        </div>
      )}
      
      {/* 初始拍照按钮 */}
      {!photoTaken && !isPreviewMode && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button
            className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600"
            onClick={enterPreviewMode}
          >
            <Image 
              src="/icons/camera.png" 
              alt="拍照" 
              width={32} 
              height={32} 
            />
          </button>
        </div>
      )}
    </div>
  );
}