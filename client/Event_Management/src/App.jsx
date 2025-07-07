import React from "react";
import { useRoutes } from "react-router-dom";
import HomePage from "./Pages/Home";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import InstitutionResourcesPage from "./Pages/Institution/InstitutionResourcesPage";
import EducatorLayout from "./Pages/Educator/EducatorLayout";
import EducatorDashboardPage from "./Pages/Educator/EducatorDashboradPage";
import ManageSessionsPage from "./Pages/Educator/ManageSessionsPage";
import FeedbackPage from "./Pages/Educator/FeedbackPage";
import EducatorProfile from "./Pages/Educator/EducatorProfile";
import InstitutionLayout from "./Pages/Institution/Institution";
import InstitutionDashboardPage from "./Pages/Institution/InstitutionDashboardPage";
import InstitutionEventsPage from "./Pages/Institution/InstitutionManageEventPage";
import InstitutionProfile from "./Pages/Institution/InstitutionProfile";
import StudentLayout from "./Pages/Student/StudentLayout";
import StudentProfile from "./Pages/Student/StudentProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import InstitutionEventDetailsPage from "./Pages/Institution/InstitutionEventDetailsPage";
import CreateEventPage from "./Pages/Institution/CreateEventPage";
import AddResourcePage from "./Pages/Institution/AddResourcePage";
import AssignResourcePage from "./Pages/Institution/AssignResourcePage";
import InstitutionEducatorsPage from "./Pages/Institution/InstitutionEducatorPage";
import AssignEducatorPage from "./Pages/Institution/AssignEducatorPage";
import AssignedEventPage from "./Pages/Educator/AssignedEventPage ";
import RequestEventPage from "./Pages/Student/RequestEventPage";
import MyEventRequestsPage from "./Pages/Student/MyEventRequestsPage";
import InstitutionEventRequestsPage from "./Pages/Institution/EventRequestsPage ";
import StudentHomePage from "./Pages/Student/StudentHomePage";
import EventRegisterPage from "./Pages/Student/EventRegisterPage";
const App = () => {
  return <Router />;
};

const Router = () => {
  const router = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/register", element: <Register /> },
    { path: "/login", element: <Login /> },

    {
      path: "/institution",
      element: (
        <ProtectedRoute allowedRoles={["institution"]}>
          <InstitutionLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <InstitutionDashboardPage /> },
        { path: "events", element: <InstitutionEventsPage /> },
        { path: "resources", element: <InstitutionResourcesPage /> },
        { path: "profile", element: <InstitutionProfile /> },
        { path:"/institution/events/:id",element:<InstitutionEventDetailsPage /> },
        {path:'/institution/events/create',element:<CreateEventPage/>},
        {path:'create-event/:requestId',element:<CreateEventPage/>},
        {path:'add/resource',element:<AddResourcePage/>},
        {path:'assign-resource',element:<AssignResourcePage/>},
        {path:'educators',element:<InstitutionEducatorsPage/>},
        {path:'assign-educator',element:<AssignEducatorPage/>},
        {path:'event-requests',element:<InstitutionEventRequestsPage/>} //
      ],
    },
    {
      path: "/educator",
      element: (
        <ProtectedRoute allowedRoles={["educator"]}>
          <EducatorLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <EducatorDashboardPage /> },
        { path: "sessions", element: <ManageSessionsPage /> },
        { path: "feedback", element: <FeedbackPage /> },
        { path: "profile", element: <EducatorProfile /> },
        {path:"events/:eventId",element:<AssignedEventPage/>}
      ],
    },
    {
      path: "/student",
      element: (
        <ProtectedRoute allowedRoles={["student"]}>
          <StudentLayout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <StudentHomePage/> },
        { path: "request", element: <RequestEventPage /> },
        {path:"dashBoard",element:<MyEventRequestsPage/>},
        {path:'event-register/:eventId',element:<EventRegisterPage/>},
        { path: "profile", element: <StudentProfile /> },
      ],
    },
    { path: "*", element: <HomePage /> },
  ]);

  return router;
};

export default App;
