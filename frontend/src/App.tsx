// App.tsx

import { AppProviders } from "./app/providers/AppProviders";
import { useAuthUser } from "@/features/auth/hooks/auth-user";

function App() {
  const { isLoading, isUser } = useAuthUser();

  console.log({ isLoading, isUser});
  // ⏳ ننتظر التحقق الأولي من المستخدم
  if (isLoading) {
    return <div>Loading...</div>;
  }


  return <AppProviders />;
}

export default App;