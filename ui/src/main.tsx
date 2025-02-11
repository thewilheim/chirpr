import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import App from "./App.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import ChirpFeed from "./pages/Chirp/Feed.tsx";
import ReplyingPage from "./pages/Chirp/Reply.tsx";
import RegisterPage from "./pages/Register/RegisterPage.tsx";
import ProfilePage from "./pages/Profile/ProfilePage.tsx";
import ConversationsPage from "./pages/Messages/ConversationsPage.tsx";
import NotificationPage from "./pages/Notifications/NotificationPage.tsx";
import { Chat } from "./components/Chat.tsx";
import SettingsPage from "./pages/Settings/SettingsPage.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<Homepage />}>
          <Route path="/" element={<ChirpFeed />} />
          <Route path="/chirp/:id" element={<ReplyingPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/messages" element={<ConversationsPage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/messages/:conversationId" element={<Chat />} />
        </Route>
      </Route>
    </Route>
  )
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
