import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages and components
import Home from './pages/Home';
import Class from './pages/Class'; // Import the Class component
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/class" element={<Class />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
