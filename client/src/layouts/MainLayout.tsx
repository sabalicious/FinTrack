import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-4">
          <Outlet /> {/* Здесь будут отображаться страницы Dashboard, Transactions и т.д. */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
