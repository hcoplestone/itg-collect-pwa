import { RouterProvider } from 'react-router-dom';
import { StoreProvider } from '@/stores';
import { router } from '@/router';

function App() {
  return (
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}

export default App;
