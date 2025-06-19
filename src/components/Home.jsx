import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import '../styles/Home.css';

const Home = () => {
  useEffect(() => {
    document.title = '체크사인 - 계약서 AI 분석 서비스'; }, []);

  const navigate = useNavigate();

  const handleAiAnalysisClick = () => {
    navigate('/upload');
  };

  const handleHistoryClick = () => {
    navigate('/history');
  };

  const handleConsultClick = () => {
    navigate('/consult');
  };

  return (
    <div className="home-container">
      <div className="app-header">
        <div className="logo">
          <div className="checkmark">✓</div>
          <span className="app-name">체크사인</span>
        </div>
        <div className="header-icons">
          <span className="notification-icon">🔔</span>
          <span className="settings-icon">⚙️</span>
        </div>
      </div>

      <div className="welcome-message">
        <p className="welcome-text">쉽고 안전한 계약을 위해</p>
        <h1 className="main-heading">사인하기 전에, <span className="highlight">체크사인</span>.</h1>
      </div>

      <div className="feature-card" onClick={handleAiAnalysisClick}>
        <div className="card-icon">
          <div className="receipt-icon">✓</div>
        </div>
        <div className="card-description">
          <p className="card-text">어려운 계약서, 쉽게 요약하고 확인해요.</p>
          <div className="analysis-button">
            계약서 AI 분석 시작하기 <span className="hand-icon">👆</span>
          </div>
        </div>
      </div>

      <div className="option-cards">
        <div className="option-card consult-card" onClick={handleConsultClick}>
          <h3 className="option-title">상담 요청</h3>
          <p className="option-description">법률 전문가 1:1 연결</p>
        </div>
        <div className="option-card history-card" onClick={handleHistoryClick}>
          <h3 className="option-title">히스토리</h3>
          <p className="option-description">지난 분석 내역 보기</p>
        </div>
      </div>

      <div className="chat-section">
        <p className="chat-title">법률 AI 챗봇에게 질문하기</p>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            placeholder="무엇이든 물어보세요..."
          />
          <button className="send-button">
            <span className="send-icon">↑</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
