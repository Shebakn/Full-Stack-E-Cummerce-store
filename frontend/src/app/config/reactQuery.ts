// React Query congi
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // إعدادات عامة مفيدة للمتجر الإلكتروني
      staleTime: 1000 * 60 * 5, // البيانات تبقى "طازجة" لمدة 5 دقائق قبل إعادة الطلب
      retry: 1, // في حال فشل الطلب، يحاول مرة واحدة إضافية فقط
      refetchOnWindowFocus: false, // لا يعيد الطلب لمجرد أنك نقرت على نافذة المتصفح
    },
  },
});