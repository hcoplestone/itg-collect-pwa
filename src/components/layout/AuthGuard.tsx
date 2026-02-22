import { observer } from 'mobx-react-lite';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserStore } from '@/stores';

export const AuthGuard = observer(function AuthGuard() {
  const userStore = useUserStore();

  if (!userStore.isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
});
