import { Home, Compass, Camera, MessageSquare, User } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';

const tabs = [
  { to: '/home', icon: Home, label: 'Home' },
  { to: '/explore', icon: Compass, label: 'Explore' },
  { to: '/create-entry/map-select', icon: Camera, label: 'Add', isCenter: true },
  { to: '/feedback', icon: MessageSquare, label: 'Feedback' },
  { to: '/account', icon: User, label: 'Account' },
];

export function TabBar() {
  const navigate = useNavigate();

  return (
    <nav className="bg-primary border-t border-accent/10 h-[56px] shrink-0 pb-safe overflow-visible z-[1003] shadow-[0_-1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-full max-w-xl mx-auto overflow-visible">
      {tabs.map(({ to, icon: Icon, label, isCenter }) => {
        if (isCenter) {
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center justify-center -mt-9 z-50"
            >
              <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white shadow-lg hover:bg-accent hover:text-white transition-colors group">
                <Icon className="w-[22px] h-[22px] text-text-secondary group-hover:text-white" />
              </div>
            </button>
          );
        }

        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 pt-2 ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`
            }
          >
            <Icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        );
      })}
      </div>
    </nav>
  );
}
