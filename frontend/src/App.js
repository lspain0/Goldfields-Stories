import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClassesProvider } from './context/ClassesContext';
import ClassesList from './components/ClassesList';

// Other imports
import Home from './pages/Home';
import Class from './pages/Class';
import Navbar from './components/Navbar';
import CreateStory from './pages/stories/CreateStory';

function App() {
  return (
    <ClassesProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="pages">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/class" element={<Class />} />
              <Route path="/createstory" element={<CreateStory />} />
              <Route path="/classeslist" element={<ClassesList />} /> {/* New route */}
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </ClassesProvider>
  );
}

export default App;
