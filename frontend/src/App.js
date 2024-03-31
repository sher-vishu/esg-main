import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/index';
import Score from './pages/Score/index';
import Error from './pages/NoPage/index';
import Records from './pages/Records/index';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/score" element={<Score />} />
        <Route path="/records" element={<Records />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;

