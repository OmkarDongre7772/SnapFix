import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./context/userContext.jsx";
import { FeedProvider } from "./context/feedContext.jsx"
import { ReportProvider } from "./context/reportContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <FeedProvider>
        <ReportProvider>
          <App/>
        </ReportProvider>
      </FeedProvider>
    </UserProvider>
  </StrictMode>
);
