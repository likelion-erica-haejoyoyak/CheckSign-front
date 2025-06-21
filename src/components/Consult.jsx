import React, { useState } from 'react';
import '../styles/Consult&History.css';

const ConsultPage = () => {
  const [name, setName] = useState('');
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('상담 요청이 접수되었습니다.');
    setName('');
    setQuestion('');
  };

  return (
    <div className="consult-page">
      <div className="header-with-back">
        <button className="back-button" onClick={() => window.history.back()}>←</button>
        <h2>🍀 상담 요청</h2>
      </div>

      <p className="subtext">전문가와 1:1 상담을 원하시면 아래 내용을 작성해 주세요.</p>

      <form onSubmit={handleSubmit} className="consult-form">
        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="상담 내용을 입력해주세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={6}
          required
        />
        <button type="submit">상담 요청하기</button>
      </form>
    </div>
  );
};

export default ConsultPage;