import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../layouts/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [

    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
