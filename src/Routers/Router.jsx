import { createBrowserRouter } from "react-router";
import MainLayout from "../Layout/MainLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home/Home";
import Leads from "../pages/CRM/Leads/Leads";
import CRMDashboard from "../pages/CRM/CRMDashboard/CRMDashboard";
import Users from "../pages/Users/Users";
import UpdateUser from "../pages/UpdateUser/UpdateUser";
import DetailsUser from "../pages/DetailsUser/DetailsUser";
import Organizations from "../pages/MasterData/Organizations/Organizations";
import CreateOrganization from "../pages/MasterData/Organizations/CreateOrganization";
import DetailsOrganization from "../pages/MasterData/Organizations/DetailsOrganization";
import UpdateOrganization from "../pages/MasterData/Organizations/UpdateOrganization";
import CreateLead from "../pages/CRM/Leads/CreateLead";
import DetailsLead from "../pages/CRM/Leads/DetailsLead";
import UpdateLead from "../pages/CRM/Leads/UpdateLead";
import FollowUpList from "../pages/CRM/FollowUpList/FollowUpList";

const router = createBrowserRouter([
    {
        path: '/',
        Component: MainLayout,
        children: [
            { path: '/', element: <PrivateRoute><Home /> </PrivateRoute> },
            { path: 'users', element: <Users /> },
            { path: 'register', element: <Register /> },
            { path: 'update-user/:id', element: <UpdateUser /> },
            { path: 'users/:id', element: <DetailsUser /> },
            { path: 'crm-dashboard', element: <CRMDashboard /> },
            { path: 'follow-up-list', element: <FollowUpList /> },
            { path: "leads", element: <Leads /> },
            { path: 'create-lead', element: <CreateLead /> },
            { path: 'leads/:id', element: <DetailsLead /> },
            { path: 'leads/update/:id', element: <UpdateLead/> },
            { path: 'organizations', element: <Organizations /> },
            { path: 'create-organization', element: <CreateOrganization /> },
            { path: 'organizations/:id', element: <DetailsOrganization /> },
            { path: 'organizations/update/:id', element: <UpdateOrganization /> }
        ]
    },
    { path: 'login', Component: Login },
])

export default router;