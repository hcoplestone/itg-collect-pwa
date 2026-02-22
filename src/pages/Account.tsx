import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { FileText, Heart, File, LogOut, ChevronRight } from 'lucide-react';

const menuItems = [
  { icon: FileText, label: 'My Entries', to: '/my-entries' },
  { icon: Heart, label: 'My Favourites', to: '/my-favourites' },
  { icon: File, label: 'Drafts', to: '/drafts' },
];

const Account = observer(function Account() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const handleLogout = () => {
    userStore.logout();
    navigate('/welcome', { replace: true });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="Account" />

      <div className="px-4 py-6">
        {/* User Info */}
        <div className="bg-secondary rounded-xl p-5 mb-6">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-secondary">
              {userStore.displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold text-accent">{userStore.displayName}</h2>
          <p className="text-sm text-text-secondary">{userStore.user?.email}</p>
        </div>

        {/* Menu Items */}
        <div className="bg-secondary rounded-xl overflow-hidden mb-6">
          {menuItems.map(({ icon: Icon, label, to }) => (
            <button
              key={to}
              onClick={() => navigate(to)}
              className="flex items-center w-full px-4 py-4 hover:bg-secondary-dark transition-colors border-b border-primary/20 last:border-b-0"
            >
              <Icon className="w-5 h-5 text-accent mr-3" />
              <span className="flex-1 text-left text-sm font-medium text-accent">{label}</span>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-4 bg-danger/10 rounded-xl hover:bg-danger/20 transition-colors"
        >
          <LogOut className="w-5 h-5 text-danger mr-3" />
          <span className="text-sm font-medium text-danger">Logout</span>
        </button>
      </div>
    </div>
  );
});

export default Account;
