import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Suspense, lazy } from 'react';
import { FormProvider } from './contexts/FormContext';
import Layout from './components/templates/Layout';
import Loading from './components/atoms/Loading';
import NotFound from './pages/NotFound.jsx'

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateForm = lazy(() => import('./pages/CreateForm'));
const FillForm = lazy(() => import('./pages/FillForm'));
const ViewResponses = lazy(() => import('./pages/ViewResponses'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
   
        <FormProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route
                  index
                  element={
                    <Suspense fallback={<Loading />}>
                      <Dashboard />
                    </Suspense>
                  }
                />
                  <Route
                  path='*'
                  element={
                    <Suspense fallback={<Loading />}>
                      <NotFound />
                    </Suspense>
                  }
                />
                
                <Route
                  path="create"
                  element={
                    <Suspense fallback={<Loading />}>
                      <CreateForm />
                    </Suspense>
                  }
                />
                <Route
                  path="form/:id"
                  element={
                    <Suspense fallback={<Loading />}>
                      <FillForm />
                    </Suspense>
                  }
                />
                <Route
                  path="responses/:id"
                  element={
                    <Suspense fallback={<Loading />}>
                      <ViewResponses />
                    </Suspense>
                  }
                />
              </Route>
              


            </Routes>
          </div>
        </FormProvider>
   
    </QueryClientProvider>
  );
}

export default App;
