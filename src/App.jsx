import { Outlet } from 'react-router-dom';
import Footer from './components/Footer.tsx';

function App() {
  return (
    <div className="min-h-screen bg-transparent">
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;