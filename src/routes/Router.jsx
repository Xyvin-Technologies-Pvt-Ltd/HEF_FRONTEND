import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout/Layout";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import MemberPage from "../pages/Members/MemberPage";
import EventsListPage from "../pages/Events/EventsListPage";
import ApprovalPage from "../pages/Approvals/ApprovalPage";
import PromotionPage from "../pages/Promotions/PromotionPage";
import NotificationPage from "../pages/Notifications/NotificationPage";
import NewsPage from "../pages/News/NewsPage";
import SettingPage from "../pages/Settings/SettingPage";
import LogoutPage from "../pages/Logout/LogoutPage";
import AddMemberPage from "../pages/Members/AddMemberPage";
import EventSinglePage from "../pages/Events/EventSinglePage";
import EditEvent from "../pages/Events/EditEvent";
import Createpromotion from "../pages/Promotions/CreatePromotion";
import MemberView from "../pages/Members/MemberView";
import AddAdminPage from "../pages/Settings/AddAdminPage";
import AddRolePage from "../pages/Settings/AddRolePage";
import LoginPage from "../pages/LoginPage";
import EditNews from "../pages/News/EditNews";
import EditPromotion from "../pages/Promotions/EditPromotion";
import PaymentPage from "../pages/payments/PaymentPage";
import QRPage from "../pages/QRPage";
import { PrivateRoute } from "./PrivateRouter";
import ReportPage from "../pages/Reports/ReportPage";
import CreateNews from "../pages/News/CreateNews";
import BusinessPage from "../pages/Activity/BusinessPage";
import LevelPage from "../pages/Level/LevelPage";
import AddLevelPage from "../pages/Level/AddLevel";
import AddEventPage from "../pages/Events/AddEventPage";
import AddProductPage from "../pages/Members/AddProductPage";
import AddActivityPage from "../pages/Activity/AddActivityPage";
import GroupPage from "../pages/Group/GroupPage";
import AddGroupPage from "../pages/Group/AddGroupPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/user/:id",
    element: <QRPage />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <Layout>
          <DashboardPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/members",
    element: (
      <PrivateRoute>
        <Layout>
          <MemberPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/members/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <MemberView />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/members/member",
    element: (
      <PrivateRoute>
        <Layout>
          <AddMemberPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/activity",
    element: (
      <PrivateRoute>
        <Layout>
          <BusinessPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/activity/activity",
    element: (
      <PrivateRoute>
        <Layout>
          <AddActivityPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/levels",
    element: (
      <PrivateRoute>
        <Layout>
          <LevelPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/levels/level",
    element: (
      <PrivateRoute>
        <Layout>
          <AddLevelPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/events/list",
    element: (
      <PrivateRoute>
        <Layout>
          <EventsListPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/events/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <EventSinglePage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/events/edit/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <EditEvent />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/events/add",
    element: (
      <PrivateRoute>
        <Layout>
          <AddEventPage />
        </Layout>
      </PrivateRoute>
    ),
  },

  {
    path: "/approvals",
    element: (
      <PrivateRoute>
        <Layout>
          <ApprovalPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <PrivateRoute>
        <Layout>
          <ReportPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/promotions",
    element: (
      <PrivateRoute>
        <Layout>
          <PromotionPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/promotions/promotion",
    element: (
      <PrivateRoute>
        <Layout>
          <Createpromotion />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/promotions/edit/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <EditPromotion />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/subscriptions",
    element: (
      <PrivateRoute>
        <Layout>
          <PaymentPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/products/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <AddProductPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <PrivateRoute>
        <Layout>
          <ReportPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/notifications",
    element: (
      <PrivateRoute>
        <Layout>
          <NotificationPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/news",
    element: (
      <PrivateRoute>
        <Layout>
          <NewsPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/groups",
    element: (
      <PrivateRoute>
        <Layout>
          <GroupPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/groups/group",
    element: (
      <PrivateRoute>
        <Layout>
          <AddGroupPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/news/add",
    element: (
      <PrivateRoute>
        <Layout>
          <CreateNews />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/news/edit/:id",
    element: (
      <PrivateRoute>
        <Layout>
          <EditNews />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <Layout>
        <SettingPage />
      </Layout>
    ),
  },
  {
    path: "/settings/add-admin",
    element: (
      <PrivateRoute>
        <Layout>
          <AddAdminPage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/settings/add-role",
    element: (
      <PrivateRoute>
        <Layout>
          <AddRolePage />
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/logout",
    element: (
      <PrivateRoute>
        <Layout>
          <LogoutPage />
        </Layout>
      </PrivateRoute>
    ),
  },
]);

export default router;
