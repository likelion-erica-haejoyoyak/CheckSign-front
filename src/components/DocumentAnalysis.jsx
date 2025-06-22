import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { requestAnalysis, getAnalysisResult, getImageUrl } from '../api/api';
import '../styles/common.css';
import '../styles/DocumentAnalysis.css';
import '../styles/AnalysisResult.css';

const DocumentAnalysis = () => {
  useEffect(() => { document.title = '문서 분석 - 체크사인'; }, []);

  const [analysisStage, setAnalysisStage] = useState('requesting'); // requesting, scanning, completed, failed
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  const uploadedFiles = location.state?.uploadedFiles || [];
  const firstFile = uploadedFiles[0];

  const requestAnalysisHandler = async (imageId) => {
    try {
      await requestAnalysis(imageId);
      setAnalysisStage('scanning');
      // 5초 후부터 결과 체크 시작
      setTimeout(() => {
        checkAnalysisResult(imageId);
      }, 5000);
    } catch (error) {
      console.error('Analysis request error:', error);
      setError('분석 요청 중 오류가 발생했습니다: ' + error.message);
      setAnalysisStage('failed');
    }
  };

  const checkAnalysisResult = async (imageId) => {
    try {
      const data = await getAnalysisResult(imageId);
      
      if (data.status === 'COMPLETED') {
        setAnalysisStage('completed');
      } else if (data.status === 'FAILED') {
        setError(data.error_message || '분석이 실패했습니다.');
        setAnalysisStage('failed');
      } else if (data.status === 'PENDING') {
        // 5초 후 재확인
        setTimeout(() => {
          checkAnalysisResult(imageId);
        }, 5000);
      }
    } catch (error) {
      console.error('Result check error:', error);
      setError('결과 확인 중 오류가 발생했습니다: ' + error.message);
      setAnalysisStage('failed');
    }
  };

  useEffect(() => {
    if (firstFile?.id && !firstFile.id.startsWith('temp_')) {
      requestAnalysisHandler(firstFile.id);
    } else {
      setError('분석할 이미지를 찾을 수 없습니다.');
      setAnalysisStage('failed');
    }
  }, []);

  const handleViewResults = () => {
    // Navigate to analysis result page
    navigate('/analysis-result', { 
      state: { 
        uploadedFiles: uploadedFiles
      }
    });
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleRetry = () => {
    if (firstFile?.id && !firstFile.id.startsWith('temp_')) {
      setError('');
      setAnalysisStage('requesting');
      requestAnalysisHandler(firstFile.id);
    }
  };

  if (analysisStage === 'requesting' || analysisStage === 'scanning') {
    return (
      <div className="container upload-container">
        <div className="header">
          <span className="header-title">문서 스캔</span>
        </div>
        
        <div className="content">
          <div className="document-preview">
            <div className="document-container">
              {firstFile && !firstFile.id.startsWith('temp_') ? (
                <img
                  src={getImageUrl(firstFile.id)}
                  alt="업로드된 문서"
                  className="document-image"
                />
              ) : (
                <div className="document-placeholder">
                  <div className="placeholder-content">
                    <div className="document-icon">📄</div>
                    <div>문서 스캔 중...</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="analysis-status">
              <div className="spinner"></div>
              <h2>
                {analysisStage === 'requesting' ? 'AI 분석을 요청하고 있습니다...' : 'AI가 문서를 분석하고 있습니다...'}
              </h2>
              <p className="status-description">
                {analysisStage === 'requesting' ? '잠시만 기다려주세요.' : '분석에는 5-30초 정도 소요될 수 있습니다.'}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="button button-secondary" onClick={handleCancel} style={{ flex: 1 }}>
                취소하기
              </button>
              <button 
                className="button button-primary"
                disabled={true}
                style={{ 
                  flex: 1,
                  opacity: 0.5,
                  cursor: 'not-allowed'
                }}
              >
                분석 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analysisStage === 'failed') {
    return (
      <div className="container upload-container">
        <div className="header">
          <span className="header-title">문서 스캔</span>
        </div>
        
        <div className="content">
          <div className="document-preview">
            <div className="document-container">
              {firstFile && !firstFile.id.startsWith('temp_') ? (
                <img
                  src={getImageUrl(firstFile.id)}
                  alt="업로드된 문서"
                  className="document-image"
                />
              ) : (
                <div className="document-placeholder">
                  <div className="placeholder-content">
                    <div className="document-icon">📄</div>
                    <div>{firstFile?.name || '문서'}</div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="error-container">
              <div className="error-icon">❌</div>
              <h2 className="error-title">분석 실패</h2>
              <p className="error-message">{error}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="button button-secondary" onClick={handleCancel} style={{ flex: 1 }}>
                취소하기
              </button>
              <button 
                className="button button-primary"
                onClick={handleRetry}
                style={{ flex: 1 }}
              >
                다시 시도
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container upload-container">
      <div className="header">
        <span className="header-title">문서 스캔</span>
      </div>
      
      <div className="content">
        <div className="document-preview">
          <div className="document-container">
            {firstFile && !firstFile.id.startsWith('temp_') ? (
              <img
                src={getImageUrl(firstFile.id)}
                alt="분석된 문서"
                className="document-image"
              />
            ) : (
              <div className="document-placeholder">
                <div className="placeholder-content">
                  <div className="document-icon">📄</div>
                  <div>{firstFile?.name || '부동산(아파트) 전세 계약서'}</div>
                </div>
              </div>
            )}
          </div>
          
          <div className="analysis-status">
            <h2 className="success-message">분석 완료! ✅</h2>
            <p className="status-description">AI 분석이 완료되었습니다.</p>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="button button-secondary" onClick={handleCancel} style={{ flex: 1 }}>
              취소하기
            </button>
            <button 
              className="button button-primary"
              onClick={handleViewResults}
              style={{ flex: 1 }}
            >
              분석 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentAnalysis;