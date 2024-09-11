import React, { useState, useEffect, useContext } from "react";
import "./style/mystyle.css";
import "./style/animation.css";
import "@coreui/coreui-pro/dist/css/coreui.min.css";
import "@coreui/coreui-pro/dist/css/coreui.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FrappeProvider } from "frappe-react-sdk";
import Header from "./component/Header.tsx";
import SideBar from "./component/SideBar.tsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./Auth.tsx";
import { createContext } from "react";
export const locateContext = createContext({});
import Preloader from "./component/Preloader.tsx";
import QuickAccess from "./pages/QuickAccess/QuickAccess.tsx";
// Pages
import GroupRide from "./pages/BookRide/GroupRide.tsx";
import Logs from "./pages/FM/Logs.tsx";
import Reports from "./pages/FM/Reports.tsx";
import RequestApproval from "./pages/PL/RequestApproval.tsx";
import RequestApprovalDL from "./pages/DL/RequestApprovalDL.tsx";
import NotFoundPage from "./component/NotFoundPage.tsx";
import TrackRequest from "./pages/TrackRequest/TrackRequest.tsx";
import Bills from "./pages/User/Bills.tsx";
import RequestApprovalFM from "./pages/FM/RequestApprovalFM.tsx";
import Vehicle from "./pages/FM/Vehicle.tsx";
import Driver from "./pages/FM/Driver.tsx";
import ExternalServices from "./pages/FM/ExternalServices.tsx";
import Dashboard from "./pages/FM/Dashboard.tsx";
import VehicleTracking from "./pages/FM/VehicleTracking.tsx";
import Coin from "./pages/User/Coin.tsx";
import YourSpends from "./pages/PL&DL Coins/Your Spends.tsx";
import ProjectSpends from "./pages/PL&DL Coins/ProjectSpends.tsx";
import DepartmentSpends from "./pages/PL&DL Coins/DepartmentSpends.tsx";
import CreateCoins from "./pages/FM/Coins/CreateCoins.tsx";
import CoinsDashBoard from "./pages/FM/Coins/CoinsDashBoard.tsx";
import GenerateBills from "./pages/FM/Coins/GenerateBills.tsx";
import TrackBills from "./pages/FM/Coins/TrackBills.tsx";
import DriverLanding from "../src/pages/Driver/DriverLanding.tsx";

import Calendar from "./component/CalendarComponent.tsx";

interface EmployeeData {
  empID: string;
  report: string;
  reportemail: string;
}

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentDrawer, setCurrentDrawer] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [empdetail, setEmpdetail] = useState({
    employee_id: "",
    employee_name: "",
    user_id: "",
    role: "",
  });
  const [role, setRole] = React.useState("");
  const [loading, setLoading] = useState(true);

  const [employeeID, setEmployeeID] = useState<EmployeeData>({
    empID: "",
    reportsToEmail: "",
  });
  const handleEmpIDChange = (data: EmployeeData) => {
    setEmployeeID(data);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const toggleMenu = () => {
    setIsOpenMenu((prevMenuState) => !prevMenuState);
  };

  // Dark Mode Function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(newDarkMode));
  };

  // If Darkmode means no change Refreshing time
  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode !== null) {
      const parsedDarkMode = JSON.parse(storedDarkMode);
      setDarkMode(parsedDarkMode);
    }
  }, []);

  const cookiesArray = document.cookie.split("; ");
  const cookieData: { [key: string]: string } = {};
  cookiesArray.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookieData[key.trim()] = decodeURIComponent(value);
  });

  const userEmailId = cookieData["user_id"];
  const userName = cookieData["full_name"];
  const userImage = cookieData["user_image"];
  const toggleDrawer = (open: boolean, drawerType: string) => {
    setIsOpen(open);
    setCurrentDrawer(drawerType);
  };
  const handleCloseDrawer = () => {
    toggleDrawer(false, "");
  };
  return (
    <FrappeProvider socketPort={import.meta.env.VITE_SOCKET_PORT ?? ""}>
      {loading && <Preloader />}
      {/* <ServicePage onEmpIDChange={handleEmpIDChange} /> */}
      <BrowserRouter>
        <locateContext.Provider
          value={{
            empdetail: empdetail,

            setEmpdetail: setEmpdetail,
            role: role,
            setRole: setRole,
          }}
        >
          {/* <Route component={NotFoundPage} /> */}
          <Header
            darkMode={darkMode}
            isOpenMenu={isOpenMenu}
            toggleDarkMode={toggleDarkMode}
            userEmailId={userEmailId}
            userName={userName}
            employeeID={employeeID}
            userImage={userImage}
          />

          <SideBar
            darkMode={darkMode}
            isOpenMenu={isOpenMenu}
            toggleMenu={toggleMenu}
            userEmailId={userEmailId}
            userName={userName}
            employeeID={employeeID}
          >
            <Routes>
              {userName === "Guest" ? (
                <Route path="*" element={<NotFoundPage />} />
              ) : (
                <>
                  <Route path="/Auth" element={<Auth />} />
                  <Route
                    path="/"
                    element={
                      <QuickAccess
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />{" "}
                  <Route
                    path="/Fleet_Management"
                    element={
                      <QuickAccess
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/quickaccess"
                    element={
                      <QuickAccess
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/trackrequest"
                    element={
                      <TrackRequest
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                        onCloseDrawer={handleCloseDrawer}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/bills"
                    element={
                      <Bills
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/coins"
                    element={
                      <Coin
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/calendar"
                    element={
                      <Calendar
                        // darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  {/* Project Lead */}
                  <Route
                    path="/Fleet_Management/groupride"
                    element={
                      <GroupRide
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/requestapproval"
                    element={
                      <RequestApproval
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/requestapprovaldl"
                    element={
                      <RequestApprovalDL
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/Coins/yourspends"
                    element={
                      <YourSpends
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/Coins/projectspends"
                    element={
                      <ProjectSpends
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/Coins/departmentpends"
                    element={
                      <DepartmentSpends
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  {/* Fleet manager */}
                  <Route
                    path="/Fleet_Management/dashboard"
                    element={
                      <Dashboard
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/requestapprovalfm"
                    element={
                      <RequestApprovalFM
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/managefleet/vehicle"
                    element={
                      <Vehicle
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/managefleet/driver"
                    element={
                      <Driver
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/managefleet/logs"
                    element={
                      <Logs
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/managefleet/reports"
                    element={
                      <Reports
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/externalservice"
                    element={
                      <ExternalServices
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/fm/coins/createcoins"
                    element={
                      <CreateCoins
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/fm/coins/coinsdashboard"
                    element={
                      <CoinsDashBoard
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/fm/coins/generatebills"
                    element={
                      <GenerateBills
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/Fleet_Management/fm/coins/trackbills"
                    element={
                      <TrackBills
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                  <Route
                    path="/tracking/:vehicleNumber"
                    element={VehicleTracking}
                  />
                  {/* Driver section */}
                  <Route
                    path="/Fleet_Management/driver"
                    element={
                      <DriverLanding
                        darkMode={darkMode}
                        userEmailId={userEmailId}
                        userName={userName}
                        employeeID={employeeID}
                      />
                    }
                  />
                </>
              )}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </SideBar>

          <ToastContainer />
        </locateContext.Provider>
      </BrowserRouter>
    </FrappeProvider>
  );
};
export default App;
