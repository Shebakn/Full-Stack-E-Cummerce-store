// App.tsx

import { AppProviders } from "./app/providers/AppProviders";
import { useInitAuth } from "./app/auth/auth.init";

function App() {
  const { isInitializing } = useInitAuth();

  

  // ⏳ ننتظر التحقق الأولي من المستخدم
  if (isInitializing) {
    return <div>Loading...</div>;
  }

  const user = localStorage.getItem("auth-storage");
  console.log(user);
  
  // ✅ التطبيق جاهز
  return <AppProviders />;
}

export default App;