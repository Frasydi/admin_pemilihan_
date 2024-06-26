import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Layout from "./views/layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DataKandidat from "./pages/Data/Kandidat";
import DataPemilih from "./pages/Data/Pemilih";
import Navigator from "./utils/Navigator";
import DPTData from "./pages/Data/DPT";
import { SingleKandidat } from "./pages/Data/Kandidat/id";
import KandidatTimKecamatan from "./pages/Data/Kandidat/id/Tim";
import AnggotaTim from "./pages/Data/Kandidat/id/Tim/Anggota";
import Recap from "./pages/Rekap";
import UserProfile from "./pages/Profile";
import User from "./pages/User";
import NotifikasiPage from "./pages/Notifikasi";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />
      },
      
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/data",
        children: [
          {
            index: true,
            element: <Navigator to={"/"} />,

          },

          {
            path: "/data/kandidat",
            children : [
              {
                index : true,
                element : <DataKandidat />
              },
              {
                path : "/data/kandidat/:id",
                element : <SingleKandidat/>
              }
            ]
          },
          {
            path: "/data/pemilih",
            element: <DataPemilih />
          },
          {
            path : "/data/dpt",
            element : <DPTData/>
          },
        ]
      },
      {
        path : "/tim",
        children : [
          {
            index : true,
            element : <Navigator to={"/"}/>
          },
          {
            path : "/tim/:id",
            element : <KandidatTimKecamatan />
          },
          
        ]
      },
      {
        path : "/anggota",
        children : [
          {
            index : true,
            element : <Navigator to={"/"}/>
          },
          {
            path : "/anggota/:id",
            element : <AnggotaTim/>
          }
        ]
      },
      {
        path : "/rekap",
        children : [
          {
            index : true,
            element : <Recap/>
          }
        ]
      },
      {
        path : "/profile",
        element : <UserProfile/>
      },
      {
        path : "/users",
        element : <User/>
      },
      {
        path : "/notifikasi",
        element : <NotifikasiPage/>
      }
    ]
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}