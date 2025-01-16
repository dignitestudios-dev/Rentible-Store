import { Route, Routes } from "react-router-dom";
import "./App.css";
import { auth } from "./routes/auth";
import { onboarding } from "./routes/onboarding";
import Splash from "./pages/authentication/Splash";
import { app } from "./routes/app";
import Refresh from "./pages/onboarding/Refresh";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      {auth?.map((route) => {
        return (
          <Route key={route?.title} path={route?.url} element={route?.page} />
        );
      })}
      {onboarding?.map((route) => {
        return (
          <Route key={route?.title} path={route?.url} element={route?.page} />
        );
      })}
      {app?.map((route) => {
        return (
          <Route key={route?.title} path={route?.url} element={route?.page} />
        );
      })}

      <Route path="/refresh" element={<Refresh />} />
    </Routes>
  );
}

export default App;
