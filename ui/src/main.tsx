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
import LoginPage from "./pages/LoginPage.tsx";
import App from "./App.tsx";
import PrivateRoute from "./components/PrivateRoute.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import ChirpFeed from "./pages/Chirp/ChirpFeed.tsx";
import ReplyingPage from "./pages/Chirp/ReplyingPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import ConversationsPage from "./pages/Messages/ConversationsPage.tsx";
import { Chat } from "./components/Chat.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<Homepage />}>
          <Route path="/" element={<ChirpFeed />} />
          <Route path="/chirp/:id" element={<ReplyingPage />} />
          <Route path="/chirpr/:id" element={<ProfilePage />} />
          <Route path="/messages" element={<ConversationsPage />} />
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
