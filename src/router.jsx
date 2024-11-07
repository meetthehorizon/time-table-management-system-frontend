import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AllUser from "./pages/AllUser";
import Schools from "./pages/Schools";
import SchoolUsers from "./pages/SchoolUsers";
import Subjects from "./pages/Subjects";
import ErrorPage from "./pages/ErrorPage";
import SchoolDetails from './pages/SchoolDetails';
import Sections from './pages/Sections';
import SubjectRequirements from './pages/SubjectRequirement';
import TeacherReq from './pages/TeacherReq';
import Students from './pages/Students';
import Courses from './pages/Courses';
import SubjectRequirement from './pages/SubjectRequirement';
import TimeTable from "./pages/TimeTable";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Registration />,
        errorElement: <ErrorPage />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/home",
        element: <Home />,
    },
    {
        path: "/dashboard",
        element: <Dashboard />,
    },
    {
        path: "/admin/all",
        element: <AllUser />,
    },
    {
        path: "/schools",
        element: <Schools />,
    },
    {
        path: "/school/:id/users",
        element: <SchoolUsers />,
    },
    {
        path: "/subjects",
        element: <Subjects />,
    },
    {
        path: "/school/:id/details",
        element: <SchoolDetails />,
    },
    {
        path: "/school/:schoolId/sections",
        element: <Sections />,
    },
    {
        path: "/school/:id/subject-req",
        element: <SubjectRequirements />,
    },
    {
        path: "/school/:id/teacher-req",
        element: <TeacherReq />,
    },
    {
        path: "/school/:id/students",
        element: <Students />,
    },
    {
        path: "/school/:id/courses",
        element: <Courses />,
    },
    {
        path: "/subject-req",
        element: <SubjectRequirement />,
    },
    {
        path: "/school/:schoolId/sections/:sectionId",
        element: <TimeTable />,
    }

]);
