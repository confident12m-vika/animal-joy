import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Routes, Route, useLocation } from 'react-router-dom'
import { SUPPORTED_LANGUAGES } from './i18n/index.js'
import { AuthProvider } from './context/AuthContext.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import ArticlePage from './pages/ArticlePage.jsx'
import HappyStories from './pages/HappyStories.jsx'
import LaughAndSmile from './pages/LaughAndSmile.jsx'
import MomentJoke from './pages/MomentJoke.jsx'
import AmazingAnimals from './pages/AmazingAnimals.jsx'
import PetLife from './pages/PetLife.jsx'
import Gallery from './pages/Gallery.jsx'
import BestFinds from './pages/BestFinds.jsx'
import UrbanSoulVibe from './pages/UrbanSoulVibe.jsx'
import Account from './pages/Account.jsx'
import LostFound from './pages/LostFound.jsx'
import LostPetForm from './pages/LostPetForm.jsx'
import LostPetDetail from './pages/LostPetDetail.jsx'
import ContactUs from './pages/ContactUs.jsx'
import NotFound from './pages/NotFound.jsx'

import Login from './admin/Login.jsx'
import ProtectedRoute from './admin/ProtectedRoute.jsx'
import AdminLayout from './admin/AdminLayout.jsx'
import HomeSettings from './admin/HomeSettings.jsx'
import ArticlesDashboard from './admin/ArticlesDashboard.jsx'
import JokesDashboard from './admin/JokesDashboard.jsx'
import ArticleForm from './admin/ArticleForm.jsx'
import JokeForm from './admin/JokeForm.jsx'
import GalleryManager from './admin/GalleryManager.jsx'
import UrbanSoulVibeSettings from './admin/UrbanSoulVibeSettings.jsx'
import UsersDashboard from './admin/UsersDashboard.jsx'
import NotificationsManager from './admin/NotificationsManager.jsx'
import LostFoundDashboard from './admin/LostFoundDashboard.jsx'
import LostPetAdminForm from './admin/LostPetAdminForm.jsx'
import MessagesDashboard from './admin/MessagesDashboard.jsx'

function PublicSite() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:id" element={<ArticlePage />} />
          <Route path="/happy-stories" element={<HappyStories />} />
          <Route path="/laugh-and-smile" element={<LaughAndSmile />} />
          <Route path="/moment-joke" element={<MomentJoke />} />
          <Route path="/amazing-animals" element={<AmazingAnimals />} />
          <Route path="/pet-life" element={<PetLife />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/best-finds" element={<BestFinds />} />
          <Route path="/urban-soul-vibe" element={<UrbanSoulVibe />} />
          <Route path="/account" element={<Account />} />
          <Route path="/lost-and-found" element={<LostFound />} />
          <Route path="/lost-and-found/new" element={<LostPetForm />} />
          <Route path="/lost-and-found/:id" element={<LostPetDetail />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

function AdminSite() {
  return (
    <Routes>
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomeSettings />} />
        <Route path="articles" element={<ArticlesDashboard />} />
        <Route path="articles/new" element={<ArticleForm />} />
        <Route path="articles/:id" element={<ArticleForm />} />
        <Route path="jokes" element={<JokesDashboard />} />
        <Route path="jokes/new" element={<JokeForm />} />
        <Route path="jokes/:id" element={<JokeForm />} />
        <Route path="gallery" element={<GalleryManager />} />
        <Route path="urban-soul-vibe" element={<UrbanSoulVibeSettings />} />
        <Route path="users" element={<UsersDashboard />} />
        <Route path="notifications" element={<NotificationsManager />} />
        <Route path="lost-and-found" element={<LostFoundDashboard />} />
        <Route path="lost-and-found/:id" element={<LostPetAdminForm />} />
        <Route path="messages" element={<MessagesDashboard />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  const { i18n } = useTranslation()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === i18n.language) || SUPPORTED_LANGUAGES[0]
    document.documentElement.lang = lang.code
    document.documentElement.dir = lang.dir
  }, [i18n.language])

  // The admin panel is always LTR / English UI, regardless of the visitor-facing language.
  useEffect(() => {
    if (isAdmin) {
      document.documentElement.dir = 'ltr'
    }
  }, [isAdmin])

  return <AuthProvider>{isAdmin ? <AdminSite /> : <PublicSite />}</AuthProvider>
}
