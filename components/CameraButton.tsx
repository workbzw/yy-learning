'use client'

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image'

export function CameraButton() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [error, setError] = useState('');

  // 自动启动摄像头
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraOn(true);
          setPhotoTaken(false);
          setIsPreviewMode(false);
        };
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('无法访问摄像头，请检查权限设置');
      setIsCameraOn(false);
    }
  };

  const enterPreviewMode = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      
      if (previewVideoRef.current) {
        previewVideoRef.current.srcObject = stream;
        previewVideoRef.current.onloadedmetadata = () => {
          setIsPreviewMode(true);
          console.log('已进入预览模式');
        };
      }
    } catch (err) {
      console.error('Error accessing camera for preview:', err);
      setError('无法访问摄像头，请检查权限设置');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOn(false);
    }
    
    if (previewVideoRef.current?.srcObject) {
      const stream = previewVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const takePhoto = () => {
    console.log('开始拍照');
    if (!previewVideoRef.current) {
      console.error('预览视频元素不存在');
      return;
    }
    
    try {
      // 强制等待视频加载完成
      if (previewVideoRef.current.readyState < 2) {
        console.log('视频尚未准备好，等待加载...');
        setTimeout(takePhoto, 500);
        return;
      }
      
      const canvas = document.createElement('canvas');
      // 确保获取到视频尺寸
      const videoWidth = previewVideoRef.current.videoWidth || 640;
      const videoHeight = previewVideoRef.current.videoHeight || 480;
      console.log('视频尺寸:', videoWidth, 'x', videoHeight);
      
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(previewVideoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        console.log('拍照成功，数据长度:', dataUrl.length);
        
        // 确保状态更新顺序正确
        setPhotoData(dataUrl);
        setIsPreviewMode(false);
        setPhotoTaken(true);
        stopCamera();
      } else {
        console.error('无法获取canvas上下文');
        alert('拍照失败，请重试');
      }
    } catch (err) {
      console.error('拍照过程中出错:', err);
      setError('拍照失败，请重试');
    }
  };

  const handleBack = () => {
    setPhotoTaken(false);
    startCamera();
  };

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
          {error}
        </div>
      )}

      {/* 摄像头预览 */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${!photoTaken && isCameraOn && !isPreviewMode && !error ? '' : 'hidden'}`}
      />
      
      {/* 预览模式 */}
      {isPreviewMode && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black">
          <video
            ref={previewVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            onCanPlay={() => console.log('预览视频可以播放')}
            onLoadedMetadata={() => console.log('预览视频元数据已加载')}
            onLoadedData={() => console.log('预览视频数据已加载')}
            onError={(e) => {
              console.error('预览视频加载失败:', e);
              setError('预览视频加载失败，请检查摄像头权限');
            }}
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <button
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg bg-red-500 hover:bg-red-600 active:bg-red-700 focus:outline-none"
              onClick={(e) => {
                e.preventDefault(); // 防止事件冒泡
                console.log('拍照按钮被点击');
                takePhoto();
              }}
              type="button"
              id="takePhotoButton" // 添加ID便于调试
            >
              <Image 
                src="/icons/camera.png" 
                alt="确认拍照" 
                width={32} 
                height={32} 
                priority={true} // 优先加载图标
              />
            </button>
            <button
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
              onClick={() => {
                setIsPreviewMode(false);
              }}
            >
              返回
            </button>
          </div>
        </div>
      )}
      
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