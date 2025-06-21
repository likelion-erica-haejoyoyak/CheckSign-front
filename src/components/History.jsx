import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../api/api';
import '../styles/common.css';
import '../styles/History.css';

const HistoryPage = () => {
  useEffect(() => { document.title = '히스토리 - 체크사인'; }, []);

  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `오늘 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `어제 ${date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays}일 전`;
    } else {
      return date.toLocaleDateString('ko-KR');
    }
  };

  const getPreviewText = (text, maxLength = 100) => {
    if (!text) return '';
    
    // JSON 객체인 경우 처리
    if (typeof text === 'object') {
      try {
        // overview 필드가 있으면 우선 사용
        if (text.overview) {
          return text.overview.length > maxLength 
            ? text.overview.substring(0, maxLength) + '...' 
            : text.overview;
        }
        // 객체를 문자열로 변환
        const jsonString = JSON.stringify(text).replace(/[{}"]/g, '');
        return jsonString.length > maxLength 
          ? jsonString.substring(0, maxLength) + '...' 
          : jsonString;
      } catch (error) {
        return '결과 미리보기 불가';
      }
    }
    
    // 문자열인 경우 기존 로직 적용
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleItemClick = (item) => {
    // Navigate to shared result page
    navigate(`/shared-result/${item.imageId}`);
  };

  const handleClearHistory = () => {
    if (window.confirm('모든 히스토리를 삭제하시겠습니까?')) {
      localStorage.removeItem('analysisHistory');
      setHistory([]);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <div className="header">
        <button className="back-button" onClick={handleBack}>
          ←
        </button>
        <span className="header-title">분석 히스토리</span>
        {history.length > 0 && (
          <button className="clear-button" onClick={handleClearHistory}>
            전체 삭제
          </button>
        )}
      </div>
      
      <div className="content">
        <div className="scrollable-content">
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>분석 히스토리가 없습니다</h3>
              <p>문서를 분석하면 여기에서 확인할 수 있습니다.</p>
              <button className="button button-primary" onClick={() => navigate('/upload')}>
                첫 번째 문서 분석하기
              </button>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div 
                  key={item.id} 
                  className="history-item touch-effect"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="history-image">
                    <img
                      src={getImageUrl(item.imageId)}
                      alt="분석된 문서"
                      className="thumbnail-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="thumbnail-placeholder" style={{ display: 'none' }}>
                      <div className="document-icon">📄</div>
                    </div>
                  </div>
                  
                  <div className="history-content">
                    <div className="history-header">
                      <span className="analysis-badge">분석 완료</span>
                      <span className="history-date">{formatDate(item.timestamp)}</span>
                    </div>
                    
                    <div className="history-preview">
                      {typeof item.result === 'string' ? (
                        <span dangerouslySetInnerHTML={{ __html: getPreviewText(item.result) }}></span>
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: getPreviewText(item.result || {}) }}></span>
                      )}
                    </div>
                  </div>
                  
                  <div className="history-arrow">
                    →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;