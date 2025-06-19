import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import DocumentUpload from './components/DocumentUpload';
import DocumentAnalysis from './components/DocumentAnalysis';
import AnalysisResult from './components/AnalysisResult';
import SharedResult from './components/SharedResult';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<DocumentUpload />} />
          <Route path="/analysis" element={<DocumentAnalysis />} />
          <Route path="/analysis-result" element={<AnalysisResult />} />
          <Route path="/shared-result/:imageId" element={<SharedResult />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;