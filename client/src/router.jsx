import { createBrowserRouter } from 'react-router-dom'

// import Chat from './Chat'
import LoginPage from './components/LoginComponents/LoginPage.jsx'
import Layout from './components/layout/Layout.jsx'
import MainContent from './components/home/MainContent.jsx'
import Profile from './components/ProfileComponents/Profile.jsx'
import TweetDetail from './components/TweetDetailComponents/TweetDetail.jsx'
import RegisterPage from './components/RegisterComponents/RegisterPage.jsx'
import BookMark from './components/BookmarkComponent/BookMark.jsx'
import ForgotPasswordPage from './components/ForgotPasswordComponents/ForgotPasswordPage.jsx'
import Message from './components/MessageComponent/Message.jsx'
import Search from '../src/components/SearchComponent/Search.jsx'
import Admin from './components/AdminComponent/Admin.jsx'
import Notifications from './components/Notifications/Notifications.jsx'
import ResetPassword from './components/ResetPasswordComponent/resetpassword.jsx'
import VerifyForgotpassword from './components/ResetPasswordComponent/veriforgotpassword.jsx'
import VerifyEmail from './components/RegisterComponents/VerifyEmail.jsx'
import ProfilePage from './components/ProfileComponents/ProfilePage.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },

  {
    path: 'home',
    element: (
      <Layout>
        <MainContent />
      </Layout>
    )
  },
  {
    path: 'bookmark',
    element: (
      <Layout>
        <BookMark />
      </Layout>
    )
  },
  {
    path: 'tweet/:id',
    element: (
      <Layout>
        <TweetDetail />
      </Layout>
    )
  },
  {
    path: '/notifications',
    element: (
      <Layout>
        <Notifications />
      </Layout>
    )
  },
  {
    path: '/message',
    element: (
      <Layout>
        <Message />
      </Layout>
    )
  },
  {
    path: '/',
    element: (
      <Layout>
        <MainContent />
      </Layout>
    )
  },
  {
    path: '/search',
    element: (
      <Layout>
        <Search />
      </Layout>
    )
  },
  {
    path: '/profile',
    element: (
      <Layout>
        <Profile />
      </Layout>
    )
  },
  {
    path: '/profile/:user_id',
    element: (
      <Layout>
        <ProfilePage />
      </Layout>
    )
  },
  {
    path: 'Admin',
    element: <Admin />
  },
  {
    path: '/reset-password',
    element: <ResetPassword />
  },
  {
    path: '/verify-forgot-password',
    element: <VerifyForgotpassword />
  },
  {
    path: '/verify-email',
    element: <VerifyEmail />
  }
])

export default router