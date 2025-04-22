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
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
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
      setPhotoData(dataUrl);
      setPhotoTaken(true);
      stopCamera();
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* 摄像头预览 - 现在会始终显示 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover ${isCameraOn ? '' : 'hidden'}`}
      />
      
      {/* 拍照结果预览 */}
      {photoTaken && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <img src={photoData} alt="拍照结果" className="max-w-full max-h-full" />
        </div>
      )}
      
      {/* 拍照按钮 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
            isCameraOn ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={isCameraOn ? takePhoto : startCamera}
        >
          <Image 
            src={isCameraOn ? "/icons/camera.png" : "/icons/camera-off.png"} 
            alt={isCameraOn ? "拍照" : "开启摄像头"} 
            width={32} 
            height={32} 
          />
        </button>
      </div>
    </div>
  );
}