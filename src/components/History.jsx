import React from 'react';
import '../styles/Consult&History.css';

const dummyHistory = [
  { date: '2025-06-19', question: '계약서에 서명 안 하면 무효인가요?', answer: '서명이 없더라도 조건에 따라 효력이 발생할 수 있습니다.' },
  { date: '2025-06-20', question: '전자계약은 법적 효력 있나요?', answer: '전자서명법에 따라 대부분 유효합니다.' }
];

const HistoryPage = () => {
  return (
    <div className="history-page">
      <h2>🍀 나의 질문 히스토리</h2>
      <ul className="history-list">
        {dummyHistory.map((item, idx) => (
          <li key={idx} className="history-item">
            <p className="date">{item.date}</p>
            <p className="question">Q: {item.question}</p>
            <p className="answer">A: {item.answer}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HistoryPage;