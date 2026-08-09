import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store.js";

import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import JobListings from "./pages/JobListings.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostJob from "./pages/PostJob.jsx";
import TopMatchesPage from "./pages/TopMatchesPage.jsx"; // 1. IMPORT THE NEW PAGE


const router = createBrowserRouter([
   {
   path: "/",
   element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/jobs",
        element: <JobListings />,
      },
      {
        path: "/login/:type",
        element: <Login />,
      },
      {
        path: "/register/:type",
        element: <Register />,
      },
      {
        path: "/post-job",
        element: <PostJob />,
      },
        // 2. ADD THE NEW ROUTE HERE
        {
          path: "/top-matches",
          element: <TopMatchesPage />,
        },
         
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);