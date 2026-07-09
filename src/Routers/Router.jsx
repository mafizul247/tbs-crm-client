import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import CreateClient from "../pages/CRM/CreateClient/CreateClient";
import Clients from "../pages/CRM/Clients/Clients";
import ViewClient from "../pages/CRM/ViewClient/ViewClient";
import UpdateClient from "../pages/CRM/UpdateClient/UpdateClient";
import CreateLead from "../pages/CRM/CreateLead/CreateLead";
import Leads from "../pages/CRM/Leads/Leads";
import CRMDashboard from "../pages/CRM/CRMDashboard/CRMDashboard";
import ViewLead from "../pages/CRM/ViewLead/ViewLead";
import UpdateLead from "../pages/CRM/UpdateLead/UpdateLead";
import NewClient from "../pages/CRM/CreateClient/NewClient";

const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            {
                index: true,
                path: '/',
                element: <PrivateRoute><Home /> </PrivateRoute>
            },
            {
                path: 'register',
                element: <Register />
            },
            {
                path: 'crm-dashboard',
                element: <CRMDashboard />
            },
            {
                path: "clients",
                element: <Clients />
            },
            {
                path: "clients/:id",
                element: <ViewClient />
            },
            {
                path: "create-client",
                element: <CreateClient />
            },
            {
                path: "new-client",
                element: <NewClient />
            },
            {
                path: 'update-client/:id',
                element: <UpdateClient />
            },
            {
                path: "leads",
                element: <Leads />
            },
            {
                path: 'create-lead',
                element: <CreateLead />
            },
            {
                path: 'leads/:id',
                element: <ViewLead />
            },
            {
                path: 'edit-lead/:id',
                element: <UpdateLead />
            }
        ]
    },
    {
        path: 'login',
        Component: Login
    }
])

export default router;