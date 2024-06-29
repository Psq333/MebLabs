import { useContext } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Layout } from 'antd';

import AuthContext, { AuthStatus } from '../helpers/core/AuthContext';

import ErrorPage from '../components/core/extra/ErrorPage';
import FullpageLoading from '../components/core/extra/FullpageLoading';
import Header from '../components/core/layout/Header';
import Sidebar from '../components/core/layout/Sidebar';

import Login from '../components/core/user/Login';
import ChangePassword from '../components/core/user/ChangePassword';
import Home from './Home';

import AuthRoute from '../components/routes/AuthRoute';
import GuestRoute from '../components/routes/GuestRoute';
import ListDiary from '../components/core/diary/ListDiary';
import FormDiary from '../components/core/diary/FormDiary';

const { Content } = Layout;

const Index = () => {
  const { authStatus } = useContext(AuthContext);

  if (authStatus === AuthStatus.Loading) return <FullpageLoading />;

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout className="min-h-[100vh]">
          <AuthRoute outlet={false}>
            <Header />
            <Layout>
              <Sidebar />
              <Content>
                <Outlet />
              </Content>
            </Layout>
          </AuthRoute>
        </Layout>
      ),
      children: [{ path: '/', index: true, element: <Home /> }]
    },
    {
      path: '/',
      errorElement: <ErrorPage status="404" />,
      element: (
        <Layout className="min-h-[100vh]">
          <Content>
            <Outlet />
          </Content>
        </Layout>
      ),
      children: [
        {
          path: 'login',
          element: (
            <GuestRoute outlet={false}>
              <Login />
            </GuestRoute>
          )
        },
        {
          path: '/changePassword/:email/:token',
          element: (
            <GuestRoute forceLogout outlet={false}>
              <ChangePassword />
            </GuestRoute>
          )
        },
        {
          path: 'list',
          element: (
            <GuestRoute outlet={false}>
              <ListDiary />
            </GuestRoute>
          )
        },
        {
          path: 'formdiary',
          element: (
            <GuestRoute outlet={false}>
              <FormDiary />
            </GuestRoute>
          )
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
};

export default Index;
