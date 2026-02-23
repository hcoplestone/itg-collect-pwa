import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useUserStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { FileText, Heart, File, LogOut, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAP_SCALE } from '@/lib/animations';

const menuItems = [
  { icon: FileText, label: 'My Entries', to: '/my-entries' },
  { icon: Heart, label: 'My Favourites', to: '/my-favourites' },
  { icon: File, label: 'Drafts', to: '/drafts' },
];

const Account = observer(function Account() {
  const navigate = useNavigate();
  const userStore = useUserStore();

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    userStore.logout();
    navigate('/welcome', { replace: true });
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col h-full">
        <Header title="Account" showLogo />

        <div className="px-4 pt-2 pb-6">
          {/* User Info */}
          <div className="bg-secondary rounded-xl p-5 mb-6 items-center text-center flex flex-col shadow-sm">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-secondary">
                {userStore.displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl font-bold text-accent">{userStore.displayName}</h2>
            <p className="text-sm text-text-secondary">{userStore.user?.email}</p>
          </div>

          {/* Menu Items */}
          <div className="bg-secondary rounded-xl overflow-hidden mb-6 shadow-sm">
            {menuItems.map(({ icon: Icon, label, to }) => (
              <motion.button
                key={to}
                onClick={() => navigate(to)}
                whileTap={TAP_SCALE}
                className="flex items-center w-full px-4 py-4 hover:bg-secondary-dark transition-colors border-b border-primary/20 last:border-b-0"
              >
                <Icon className="w-5 h-5 text-accent mr-3" />
                <span className="flex-1 text-left text-sm font-medium text-accent">{label}</span>
                <ChevronRight className="w-4 h-4 text-text-secondary" />
              </motion.button>
            ))}
          </div>

          {/* Logout */}
          <motion.button
            onClick={() => setShowLogoutConfirm(true)}
            whileTap={TAP_SCALE}
            className="flex items-center w-full px-4 py-4 bg-secondary rounded-xl shadow-sm hover:bg-secondary-dark transition-colors"
          >
            <LogOut className="w-5 h-5 text-danger mr-3" />
            <span className="text-sm font-medium text-danger">Logout</span>
          </motion.button>

          <p className="text-center text-xs text-text-secondary mt-6">v{__APP_VERSION__}</p>
        </div>

        <ConfirmDialog
          open={showLogoutConfirm}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
          title="Logout"
          message="Are you sure you want to logout?"
          confirmLabel="Logout"
        />
      </div>
    </AnimatedPage>
  );
});

export default Account;
