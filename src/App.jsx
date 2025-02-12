
import './components/css/Menu.css';
import About from './components/About';
import Home from './components/Home';
import { Route, Routes } from 'react-router-dom';
import NoMatch from './components/NoMatch';
import News from './components/News';
import Menu from './components/Menu';
import Header from './components/Header';

function App() {
  return (
    <div className="wrapper">
      <Menu />
      
      <div className="main-content">
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="news" element={<News />} />
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;