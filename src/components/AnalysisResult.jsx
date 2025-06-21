import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAnalysisResult, getImageUrl } from '../api/api';
import '../styles/common.css';
import '../styles/AnalysisResult.css';

const AnalysisResult = () => {
  useEffect(() => { document.title = '분석 결과 - 체크사인'; }, []);
  
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const uploadedFiles = location.state?.uploadedFiles || [];
  const firstFile = uploadedFiles[0];

  const fetchAnalysisResult = async (imageId) => {
    try {
      const data = await getAnalysisResult(imageId);
        if (data.status === 'completed') {
        setResult(data.result);
        setLoading(false);
        
        // Save to localStorage for history
        const historyItem = {
          id: imageId,
          result: data.result,
          timestamp: new Date().toISOString(),
          imageId: imageId
        };
        
        const existingHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
        const updatedHistory = [historyItem, ...existingHistory.filter(item => item.id !== imageId)];
        localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory.slice(0, 20))); // Keep only last 20 items
      } else if (data.status === 'failed') {
        setError(data.error_message || '분석이 실패했습니다.');
        setLoading(false);
      } else if (data.status === 'pending') {
        // 3초 후 재확인
        setTimeout(() => {
          fetchAnalysisResult(imageId);
        }, 3000);
      }
    } catch (error) {
      console.error('Result fetch error:', error);
      setError('결과를 가져오는 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (firstFile?.id && !firstFile.id.startsWith('temp_')) {
      fetchAnalysisResult(firstFile.id);
    } else {
      setError('분석 결과를 가져올 이미지를 찾을 수 없습니다.');
      setLoading(false);
    }
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleShare = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}/shared-result/${firstFile.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 클립보드에 복사되었습니다!');
      setShowShareDialog(false);
    } catch (error) {
      // 클립보드 API가 지원되지 않는 경우 대체 방법
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('링크가 클립보드에 복사되었습니다!');
        setShowShareDialog(false);
      } catch (fallbackError) {
        alert('링크 복사에 실패했습니다. 링크를 직접 복사해주세요: ' + shareUrl);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleRetry = () => {
    if (firstFile?.id && !firstFile.id.startsWith('temp_')) {
      setError('');
      setResult('');
      setLoading(true);
      fetchAnalysisResult(firstFile.id);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <span className="header-title">분석 결과</span>
      </div>
      
      <div className="content">
        <div className="scrollable-content">
          {/* 이미지 미리보기 */}
          <div className="document-image-preview">
            {firstFile && !firstFile.id.startsWith('temp_') ? (
              <img
                src={getImageUrl(firstFile.id)}
                alt="분석된 문서"
                className="document-image"
              />
            ) : (
              <div className="document-placeholder">
                <div style={{ textAlign: 'center' }}>
                  <div className="document-icon">📄</div>
                  <div>문서</div>
                </div>
              </div>
            )}
          </div>

          {/* 분석 상태 및 결과 */}
          <div>
            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <h3>분석 결과를 가져오고 있습니다...</h3>
                <p className="status-description">
                  잠시만 기다려주세요.
                </p>
              </div>
            )}

            {!loading && result && (
              <div>
                <h3 className="result-title">📋 분석 결과</h3>
                <div className="result-content">
                  {result}
                </div>
                <div className="result-disclaimer">
                  💡 이 결과는 AI에 의해 생성되었으며, 실제 법률 검토를 대체할 수 없습니다.
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="error-container">
                <div className="error-icon">❌</div>
                <h3 className="error-title">오류 발생</h3>
                <p className="error-message">{error}</p>
                <button 
                  className="button button-primary"
                  onClick={handleRetry}
                  style={{ marginTop: '16px' }}
                >
                  다시 시도
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 고정된 하단 버튼 영역 */}
        <div className="footer-buttons">
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="button button-secondary" onClick={handleGoHome} style={{ flex: 1 }}>
              처음으로
            </button>
            {!loading && result && (
              <button 
                className="button button-primary"
                onClick={handleShare}
                style={{ flex: 1 }}
              >
                분석 결과 공유
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 공유 다이얼로그 */}
      {showShareDialog && (
        <div className="dialog-overlay">
          <div className="dialog-content">
            <h3 className="dialog-title">분석 결과 공유</h3>
            <p className="dialog-description">
              아래 링크를 복사하여 분석 결과를 공유할 수 있습니다.
            </p>
            
            <div className="share-link">
              {`${window.location.origin}/shared-result/${firstFile?.id || 'unknown'}`}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="button button-secondary"
                onClick={() => setShowShareDialog(false)}
                style={{ flex: 1 }}
              >
                취소
              </button>
              <button 
                className="button button-primary"
                onClick={handleCopyLink}
                style={{ flex: 1 }}
              >
                링크 복사
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResult;