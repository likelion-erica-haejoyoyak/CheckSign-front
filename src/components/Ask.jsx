import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Ask.css';

const AskPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');

  const handleSend = () => {
    if (!question.trim()) return;
    console.log('전송된 질문:', question);
    setQuestion('');
  };

  const exampleQuestions = [
    { subject: '법률', text: '계약서에 있는 특약이 강제력이 있나요?' },
    { subject: '부동산', text: '전세 계약 중도 해지 가능한가요?' },
    { subject: '계약 효력', text: '계약서에 서명하지 않으면 무효인가요?' },
    { subject: '전자계약', text: '전자계약서도 법적 효력이 있나요?' },
  ];

  return (
    <div className="ask-page">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>←</button>
        <span className="header-title">법률 AI 챗봇</span>
        <div className="profile-icon" />
      </div>

      <div className="content">

        <div className="ai-label">
          <div className="ai-icon">🍀</div>
          <div className="ai-title">계약서 관련 궁금한 점</div>
          <div className="ai-subtitle">자유롭게 물어보세요</div>
        </div>

        <div className="example-questions">
          {exampleQuestions.map((q, idx) => (
            <div
              key={idx}
              className="question-card"
              onClick={() => setQuestion(q.text)}
            >
              <strong>{q.subject}</strong><br />
              {q.text}
            </div>
          ))}
        </div>

        <div className="question-input-container">
          <input
            type="text"
            placeholder="질문을 입력해 주세요."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button className="send-button" onClick={handleSend}>
            <span className="send-icon">↑</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AskPage;

