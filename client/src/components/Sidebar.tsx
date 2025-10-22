import { NavLink } from 'react-router-dom';

function Sidebar() {
  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 rounded hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`;

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <h1 className="text-xl font-bold p-4">FinTrack</h1>
      <nav className="flex flex-col">
        <NavLink to="/" className={linkClasses}>
          Dashboard
        </NavLink>
        <NavLink to="/transactions" className={linkClasses}>
          Transactions
        </NavLink>
        <NavLink to="/goals" className={linkClasses}>
          Goals
        </NavLink>
        <NavLink to="/settings" className={linkClasses}>
          Settings
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
