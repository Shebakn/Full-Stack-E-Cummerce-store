import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './App.css'
import "bootstrap/dist/css/bootstrap.min.css";
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // اختيارية لكن مهمة جداً
import { queryClient } from '@/app/config/reactQuery';

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider client={queryClient}>
      <App />
      
      {/* أداة المطورين: تظهر لك حالة البيانات في الزاوية (تختفي تلقائياً في الإنتاج) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
)
