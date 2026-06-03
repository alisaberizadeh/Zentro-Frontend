import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Authcheck from "./components/Authcheck";
import Guestcheck from "./components/Guestcheck";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import EditProfile from "./pages/EditProfile";
import Post from "./pages/Post";
import User from "./pages/User";
import CreatePost from "./pages/CreatePost";
import Saved from "./pages/Saved";
import CreateStory from "./pages/CreateStory";
import Explore from "./pages/Explore";
import Search from "./pages/Search";
import Notifications from "./pages/Notifications";
import Users from "./pages/Users";
import Conversation from "./pages/Conversation";
import Messages from "./pages/Messages";

function App() {
  const queryClient = new QueryClient()

  return (

    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="App">
          <ToastContainer />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="/" element={<Authcheck><Home /></Authcheck>} />
              <Route path="/profile" element={<Authcheck><Profile /></Authcheck>} />
              <Route path="/profile/edit" element={<Authcheck><EditProfile /></Authcheck>} />
              <Route path="/user/:id" element={<Authcheck><User /></Authcheck>} />
              <Route path="/feed/:id" element={<Authcheck><Post /></Authcheck>} />
              <Route path="/feed/create" element={<Authcheck><CreatePost /></Authcheck>} />
              <Route path="/saved" element={<Authcheck><Saved /></Authcheck>} />
              <Route path="/story/create" element={<Authcheck><CreateStory /></Authcheck>} />
              <Route path="/explore" element={<Authcheck><Explore /></Authcheck>} />
              <Route path="/search" element={<Authcheck><Search /></Authcheck>} />
              <Route path="/notificatios" element={<Authcheck><Notifications /></Authcheck>} />
              <Route path="/community" element={<Authcheck><Users /></Authcheck>} />
              <Route path="/conversation" element={<Authcheck><Messages /></Authcheck>} />
              <Route path="/conversation/:id" element={<Authcheck><Conversation /></Authcheck>} />

            </Route>


            <Route path="/login" element={<Guestcheck><Login /></Guestcheck>} />
            <Route path="/register" element={<Guestcheck><Register /></Guestcheck>} />
          </Routes>
        </div>

      </AuthProvider>
    </QueryClientProvider>



  );
}

export default App;
