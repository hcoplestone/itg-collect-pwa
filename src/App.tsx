import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from '@/stores';
import { router } from '@/router';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ToastContainer } from '@/components/ui/ToastContainer';

function App() {
  return (
    <StoreProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
        <ToastContainer />
      </ErrorBoundary>
    </StoreProvider>
  );
}

export default App;
