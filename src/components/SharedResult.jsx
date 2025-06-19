import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAnalysisResult, getImageUrl } from '../api/api';
import '../styles/common.css';
import '../styles/SharedResult.css';

const SharedResult = () => {
  useEffect(() => { document.title = '공유 분석 결과 - 체크사인'; }, []);

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { imageId } = useParams();
  const navigate = useNavigate();

  const fetchAnalysisResult = async () => {
    try {
      const data = await getAnalysisResult(imageId);
      
      if (data.status === 'completed') {
        setResult(data.result);
        setLoading(false);
      } else if (data.status === 'failed') {
        setError('분석이 실패했습니다: ' + (data.error_message || '알 수 없는 오류'));
        setLoading(false);
      } else if (data.status === 'pending') {
        setError('분석이 아직 진행 중입니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Result fetch error:', error);
      setError('결과를 가져오는 중 오류가 발생했습니다: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (imageId) {
      fetchAnalysisResult();
    } else {
      setError('잘못된 공유 링크입니다.');
      setLoading(false);
    }
  }, [imageId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setError('');
    setResult('');
    setLoading(true);
    fetchAnalysisResult();
  };

  return (
    <div className="container">
      <div className="header">공유된 분석 결과</div>
      
      <div className="content">
        <div className="scrollable-content">
          {/* 이미지 미리보기 */}
          <div className="document-image-preview">
            {imageId ? (
              <img
                src={getImageUrl(imageId)}
                alt="분석된 문서"
                className="document-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
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
            <button className="button button-primary" onClick={handleGoHome} style={{ flex: 1 }}>
              새로운 문서 분석하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedResult;