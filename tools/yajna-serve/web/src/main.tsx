// The notebook's web app (ADR-0041).

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient, takeToken } from './api';
import { RouterProvider, useRoute } from './router';
import { Changes } from './changes';
import { Files } from './files';
import { Collection, LogScreen, Missing, Overview, PageView, Reviews, Tasks } from './screens';

function App() {
  const r = useRoute();
  switch (r.name) {
    case 'home':
      return <Overview />;
    case 'page':
      return <PageView key={r.id} id={r.id} />;
    case 'collection':
      return <Collection key={r.type} type={r.type} />;
    case 'log':
      return <LogScreen />;
    case 'tasks':
      return <Tasks />;
    case 'reviews':
      return <Reviews />;
    case 'changes':
      return <Changes search={r.search} />;
    case 'files':
      return <Files key={r.path} path={r.path} />;
    default:
      return <Missing path={r.path} />;
  }
}

takeToken();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider>
        <App />
      </RouterProvider>
    </QueryClientProvider>
  </StrictMode>,
);
