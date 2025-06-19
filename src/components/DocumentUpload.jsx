import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { uploadImage, deleteImage } from '../api/api';
import '../styles/common.css';
import '../styles/DocumentUpload.css';

const DocumentUpload = () => {
  useEffect(() => { document.title = '문서 추가 - 체크사인'; }, []);

  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const navigate = useNavigate();

  const uploadFile = async (file) => {
    try {
      const result = await uploadImage(file);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleFileSelect = async (file, source) => {
    // 이미지 파일만 허용
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 기존 파일이 있으면 먼저 삭제
    if (files.length > 0) {
      await removeFile(files[0].id);
    }

    const fileId = Date.now();
    const newFile = {
      id: fileId,
      file,
      name: file.name || `${source}_${fileId}.jpg`,
      size: file.size,
      progress: 0,
      status: 'uploading',
      thumbnail: null,
      uploadedId: null
    };

    setFiles([newFile]); // 배열을 새로 설정하여 하나만 유지
    setIsUploading(true);

    // Create thumbnail
    const reader = new FileReader();
    reader.onload = (e) => {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, thumbnail: e.target.result } : f
      ));
    };
    reader.readAsDataURL(file);

    // Start upload progress animation
    const progressInterval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileId && f.progress < 90 && f.status === 'uploading') {
          return { ...f, progress: Math.min(f.progress + 5, 90) };
        }
        return f;
      }));
    }, 200);

    try {
      const result = await uploadFile(file);
      clearInterval(progressInterval);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          progress: 100, 
          status: 'completed',
          uploadedId: result.id
        } : f
      ));
    } catch (error) {
      clearInterval(progressInterval);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'error',
          error: error.message
        } : f
      ));
      console.error('Upload error:', error);
    }

    setIsUploading(false);
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file, 'gallery');
    }
  };

  const handleCameraChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFileSelect(file, 'camera');
    }
  };

  const removeFile = async (fileId) => {
    const fileToRemove = files.find(f => f.id === fileId);
    
    // If file was successfully uploaded, delete from server
    if (fileToRemove?.uploadedId && !fileToRemove.uploadedId.startsWith('temp_')) {
      try {
        await deleteImage(fileToRemove.uploadedId);
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
    
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleComplete = () => {
    const completedFiles = files.filter(f => f.status === 'completed');
    // Pass uploaded file IDs to analysis page
    navigate('/analysis', { 
      state: { 
        uploadedFiles: completedFiles.map(f => ({
          id: f.uploadedId,
          name: f.name
        }))
      }
    });
  };

  const handleCancel = () => {
    // 현재 업로드 중인 파일이 있다면 삭제
    if (files.length > 0) {
      files.forEach(file => {
        if (file.uploadedId && !file.uploadedId.startsWith('temp_')) {
          deleteImage(file.uploadedId).catch(console.error);
        }
      });
    }
    // 홈으로 이동
    navigate('/');
  };

  const formatFileSize = (bytes) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  };

  const hasCompletedFiles = files.some(f => f.status === 'completed');
  const currentFile = files[0];

  return (
    <div className="container">
      <div className="header">문서 추가</div>
      
      <div className="content">
        <div 
          className={`upload-area ${!currentFile ? 'cursor-pointer' : ''}`}
          onClick={!currentFile ? handleGallerySelect : undefined}
        >
          {currentFile?.thumbnail ? (
            <>
              <img 
                src={currentFile.thumbnail} 
                alt="업로드된 이미지" 
                className="document-image"
              />
              <button 
                className="close-button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(currentFile.id);
                }}
              >
                ✕
              </button>
              {currentFile.status === 'uploading' && (
                <div className="upload-status">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${currentFile.progress}%` }}
                    ></div>
                  </div>
                  업로드 중... {currentFile.progress}%
                </div>
              )}
              {currentFile.status === 'completed' && (
                <div className="upload-success">
                  ✅ 업로드 완료
                </div>
              )}
              {currentFile.status === 'error' && (
                <div className="upload-error">
                  ❌ 업로드 실패: {currentFile.error}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="upload-icon">📄</div>
              <div className="upload-text">이 곳을 클릭하여 이미지를 추가하세요.</div>
              <div className="upload-subtext">지원되는 형식: JPEG, PNG</div>
            </>
          )}
        </div>

        <div style={{ marginTop: 'auto' }}>
          {!currentFile && (
            <div className="button-group">
              <button className="button" onClick={handleCameraCapture}>
                📷 카메라 촬영
              </button>
              <button className="button" onClick={handleGallerySelect}>
                🖼️ 갤러리에서 선택
              </button>
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="button button-secondary" 
              style={{ flex: 1 }}
              onClick={handleCancel}
            >
              취소하기
            </button>
            <button 
              className="button button-primary"
              onClick={handleComplete}
              disabled={!hasCompletedFiles || isUploading}
              style={{ flex: 1 }}
            >
              완료
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="hidden"
      />
    </div>
  );
};

export default DocumentUpload;