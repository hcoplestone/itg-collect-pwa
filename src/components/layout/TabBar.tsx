import { IoHome, IoCompass, IoCamera, IoChatbubbleEllipses, IoPerson } from 'react-icons/io5';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { to: '/home', icon: IoHome, label: 'Home' },
  { to: '/explore', icon: IoCompass, label: 'Explore' },
  { to: '/drafts', icon: IoCamera, label: 'Add', isCenter: true },
  { to: '/feedback', icon: IoChatbubbleEllipses, label: 'Feedback' },
  { to: '/account', icon: IoPerson, label: 'Account' },
];

export function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-primary border-t border-accent/10 h-[56px] shrink-0 pb-safe overflow-visible z-[1003] shadow-[0_-1px_3px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-full max-w-xl mx-auto overflow-visible">
      {tabs.map(({ to, icon: Icon, label, isCenter }) => {
        if (isCenter) {
          const isActive = location.pathname === to;
          return (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex flex-col items-center justify-center -mt-9 z-50"
            >
              <div className={`flex items-center justify-center w-[50px] h-[50px] rounded-full shadow-lg transition-colors ${isActive ? 'bg-accent' : 'bg-white'}`}>
                <Icon size={20} className={isActive ? 'text-white' : 'text-text-secondary'} />
              </div>
            </button>
          );
        }

        return (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 h-full ${
                isActive ? 'text-accent' : 'text-text-secondary'
              }`
            }
          >
            <Icon size={20} />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        );
      })}
      </div>
    </nav>
  );
}
