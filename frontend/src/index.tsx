import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ErrorPage } from './error-page';
import { Login } from './login';
import { Register } from './register';
import { UpdatePassword } from './update-password';
import { Dash } from './dash';
import { UpdateInfo } from './update-userinfo';
import { UserManage } from './user-manage';

const routes = [
  {
    path: "/",
    element: <Dash></Dash>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'update-userinfo',
        element: <UpdateInfo></UpdateInfo>
      },
      {
        path: 'user-manage',
        element: <UserManage></UserManage>
      },
    ]
  },
  {
    path: 'login',
    element: <Login />
  },
  {
    path: 'register',
    element: <Register />
  },
  {
    path: 'update-password',
    element: <UpdatePassword />
  }
]

const router = createBrowserRouter(routes)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(<RouterProvider router={router}></RouterProvider>)