import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
  useMediaQuery,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import { useFrappeGetDoc } from "frappe-react-sdk";
// Icons
import { PiCoinsLight } from "react-icons/pi";

import { FaCar } from "react-icons/fa";
import { MdOutlineManageAccounts } from "react-icons/md";

import { MdOutlineDashboard } from "react-icons/md";
import { LiaCarSideSolid } from "react-icons/lia";

import { MdOutlineRoute } from "react-icons/md";
import { RiFocus3Line } from "react-icons/ri";
import { GoNote } from "react-icons/go";
import { IoCalendarOutline } from "react-icons/io5";
import { MdGroups3 } from "react-icons/md";

import { AiOutlineBars } from "react-icons/ai";
import { IoHomeOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BsBookmarkCheck } from "react-icons/bs";
import { IoCarSportOutline } from "react-icons/io5";

// Pages
import Passenger from "../pages/BookRide/Passenger";
import Goods from "../pages/BookRide/Goods";
import Equipment from "../pages/BookRide/Equipment";
import GroupRide from "../pages/BookRide/GroupRide";
import TravelRoute from "../pages/BookRide/TravelRoute";

interface SideBarProps {
  onCloseDrawer: () => void;
  children: React.ReactNode;
  darkMode: boolean;
  isOpenMenu: boolean;
  toggleMenu: () => void;
  userEmailId: string;
  reportemail: string;
  reportDepartment: string;
  reportDepartmentSuperAdmin: string;
}

const SideBar: React.FC<SideBarProps> = ({
  children,
  darkMode,
  isOpenMenu,
  toggleMenu,
  userEmailId,
  employeeID,
  userName,
  onCloseDrawer,
  reportemail,
  reportDepartment,
  reportDepartmentSuperAdmin,
}) => {
  const [rotateIcon, setRotateIcon] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)"); // Define the breakpoint for mobile screens
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [currentDrawer, setCurrentDrawer] = useState<string>("");

  const toggleDrawer = (open: boolean, drawerType: string) => {
    setIsOpen(open);
    setCurrentDrawer(drawerType);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false, "");
  };

  useEffect(() => {
    if (isMobile) {
      closeMenu();
    }
  }, [isMobile]);

  // Function to close the menu
  const closeMenu = () => {
    toggleMenu(); // Calls the toggleMenu function passed as a prop
  };

  //--------------------------------------------------------------------------Role Fetching----------------------------------------------------------------
  const cookiesArray = document.cookie.split("; ");
  const cookieData: { [key: string]: string } = {};

  cookiesArray.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookieData[key] = decodeURIComponent(value);
  });

  const userIdCookie = cookieData.user_id;
  const [roles, setRoles] = useState<string[]>([]);
  const [employeeRole, setEmployeeRole] = useState("");

  const userDocType = "User";
  const parent = userIdCookie;
  const { data } = useFrappeGetDoc(userDocType, parent);

  useEffect(() => {
    if (data && data.roles && data.roles.length > 0) {
      // console.log(data, "useridcookie");

      const temp = data.roles.map((roleObj: any) => roleObj.role);

      setRoles(temp);
    }
  }, [data]);

  useEffect(() => {
    if (roles && roles.length > 0) {
      let role = "User"; // Default role

      switch (true) {
        case roles.includes("Employee") &&
          roles.includes("Project Lead") &&
          roles.includes("Department Head"):
          role = "Department Manager";
          break;
        case roles.includes("Employee") && roles.includes("Project Lead"):
          role = "Project Manager";
          break;
        case roles.includes("Employee") && roles.includes("Department Head"):
          role = "Department Manager";
          break;
        case roles.includes("Employee") && roles.includes("Fleet Manager"):
          role = "Fleet Manager";
          break;
        case roles.includes("Employee") && roles.includes("Driver"):
          role = "Driver";
          break;
        case roles.includes("Employee"):
          role = "User";
          break;
        default:
          role = "User";
          break;
      }

      setEmployeeRole(role);
    }
  }, [roles]);

  // SideBar Menu items for User
  const [usermenuItems, setUserMenuItems] = useState<MenuItem[]>([
    {
      name: "Quick Access",
      path: "/Fleet_Management",
      icon: <IoHomeOutline />,
    },
    {
      name: "Book Ride",
      icon: <IoCarSportOutline />,
      path: "/Fleet_Management",
      submenu: [
        {
          path: "/Fleet_Management",
          name: "Passenger",
          onClick: () => toggleDrawer(true, "Passenger"),
        },
        {
          path: "/Fleet_Management",
          name: "Goods",
          onClick: () => toggleDrawer(true, "Goods"),
        },
        {
          path: "/Fleet_Management",
          name: "Equipment",
          onClick: () => toggleDrawer(true, "Equipment"),
        },
        {
          path: "/Fleet_Management",
          name: "Group Ride",
          onClick: () => toggleDrawer(true, "GroupRide"),
        },
      ],
    },

    {
      path: "/Fleet_Management",
      name: "Travel Route",
      icon: <MdOutlineRoute />,
      onClick: () => toggleDrawer(true, "TravelRoute"),
    },
    {
      path: "/Fleet_Management/trackrequest",
      name: "Track Request",
      icon: <RiFocus3Line />,
    },
    {
      path: "/Fleet_Management/bills",
      name: "Bills",
      icon: <GoNote />,
    },
    {
      path: "/Fleet_Management/calendar",
      name: "Calender",
      icon: <IoCalendarOutline />,
    },
  ]);

  // SideBar Menu items for PL
  const [plmenuItems, setPlMenuItems] = useState<MenuItem[]>([
    {
      name: "Quick Access",
      path: "/Fleet_Management",
      icon: <IoHomeOutline />,
    },
    {
      name: "Book Ride",
      icon: <IoCarSportOutline />,
      path: "/Fleet_Management",
      submenu: [
        {
          path: "/Fleet_Management",
          name: "Passenger",
          onClick: () => toggleDrawer(true, "Passenger"),
        },
        {
          path: "/Fleet_Management",
          name: "Goods",
          onClick: () => toggleDrawer(true, "Goods"),
        },
        {
          path: "/Fleet_Management",
          name: "Equipment",
          onClick: () => toggleDrawer(true, "Equipment"),
        },
        {
          path: "/Fleet_Management",
          name: "Group Ride",
          onClick: () => toggleDrawer(true, "GroupRide"),
        },
      ],
    },

    {
      path: "/Fleet_Management",
      name: "Travel Route",
      icon: <MdOutlineRoute />,
      onClick: () => toggleDrawer(true, "TravelRoute"),
    },
    {
      path: "/Fleet_Management/trackrequest",
      name: "Track Request",
      icon: <RiFocus3Line />,
    },
    {
      path: "/Fleet_Management/requestapproval",
      name: "Request Approval",
      icon: <BsBookmarkCheck />,
    },
    {
      path: "/Fleet_Management/bills",
      name: "Bills",
      icon: <GoNote />,
    },
    {
      path: "/Fleet_Management/calendar",
      name: "Calender",
      icon: <IoCalendarOutline />,
    },
  ]);

  // SideBar Menu items for DL
  const [dlmenuItems, setDlMenuItems] = useState<MenuItem[]>([
    {
      name: "Quick Access",
      path: "/Fleet_Management",
      icon: <IoHomeOutline />,
    },
    {
      name: "Book Ride",
      icon: <IoCarSportOutline />,
      path: "/Fleet_Management",
      submenu: [
        {
          path: "/Fleet_Management",
          name: "Passenger",
          onClick: () => toggleDrawer(true, "Passenger"),
        },
        {
          path: "/Fleet_Management",
          name: "Goods",
          onClick: () => toggleDrawer(true, "Goods"),
        },
        {
          path: "/Fleet_Management",
          name: "Equipment",
          onClick: () => toggleDrawer(true, "Equipment"),
        },
        {
          path: "/Fleet_Management",
          name: "Group Ride",
          onClick: () => toggleDrawer(true, "GroupRide"),
        },
      ],
    },

    {
      path: "/Fleet_Management",
      name: "Travel Route",
      icon: <MdOutlineRoute />,
      onClick: () => toggleDrawer(true, "TravelRoute"),
    },
    {
      path: "/Fleet_Management/trackrequest",
      name: "Track Request",
      icon: <RiFocus3Line />,
    },
    {
      path: "/Fleet_Management/requestapprovaldl",
      name: "Request Approval",
      icon: <BsBookmarkCheck />,
    },
    {
      path: "/Fleet_Management/bills",
      name: "Bills",
      icon: <GoNote />,
    },
    {
      path: "/Fleet_Management/calendar",
      name: "Calender",
      icon: <IoCalendarOutline />,
    },
  ]);

  // SideBar Menu items for FM
  const [fmmenuItems, setFmMenuItems] = useState<MenuItem[]>([
    {
      name: "Quick Access",
      path: "/Fleet_Management",
      icon: <IoHomeOutline />,
    },
    {
      name: "Dashboard",
      path: "/Fleet_Management/dashboard",
      icon: <MdOutlineDashboard />,
    },
    {
      name: "Book Ride",
      icon: <IoCarSportOutline />,
      path: "/Fleet_Management",
      submenu: [
        {
          path: "/Fleet_Management",
          name: "Passenger",
          onClick: () => toggleDrawer(true, "Passenger"),
        },
        {
          path: "/Fleet_Management",
          name: "Goods",
          onClick: () => toggleDrawer(true, "Goods"),
        },
        {
          path: "/Fleet_Management",
          name: "Equipment",
          onClick: () => toggleDrawer(true, "Equipment"),
        },
        {
          path: "/Fleet_Management",
          name: "Group Ride",
          onClick: () => toggleDrawer(true, "GroupRide"),
        },
      ],
    },
    {
      path: "/Fleet_Management",
      name: "Travel Route",
      icon: <MdOutlineRoute />,
      onClick: () => toggleDrawer(true, "TravelRoute"),
    },

    {
      path: "/Fleet_Management/trackrequest",
      name: "Track Request",
      icon: <RiFocus3Line />,
    },
    {
      name: "Manage Fleet",
      icon: <LiaCarSideSolid />,

      submenu: [
        {
          path: "/Fleet_Management/managefleet/vehicle",
          name: "Vehicle",
        },
        {
          path: "/Fleet_Management/managefleet/driver",
          name: "Driver",
        },
        {
          path: "/Fleet_Management/managefleet/logs",
          name: "Logs",
        },
        {
          path: "/Fleet_Management/managefleet/reports",
          name: "Reports",
        },
      ],
    },
    {
      path: "/Fleet_Management/requestapprovalfm",
      name: "Request Approval",
      icon: <BsBookmarkCheck />,
    },
    {
      path: "/Fleet_Management/externalservice",
      name: "External Service",
      icon: <MdOutlineManageAccounts />,
    },
    {
      name: "Coins",
      icon: <PiCoinsLight />,
      submenu: [
        {
          path: "/Fleet_Management",
          name: "Coins Dashboard",
        },
        {
          path: "/Fleet_Management",
          name: "Coins Request",
        },
        {
          path: "/Fleet_Management",
          name: "Generate Bills",
        },
        {
          path: "/Fleet_Management",
          name: "Track Bills",
        },
      ],
    },
    {
      path: "/Fleet_Management/bills",
      name: "Bills",
      icon: <GoNote />,
    },
    {
      path: "/Fleet_Management/calendar",
      name: "Calender",
      icon: <IoCalendarOutline />,
    },
  ]);

  // User Menu Item
  useEffect(() => {
    const activePath = location.pathname;

    setUserMenuItems((prevState) =>
      prevState.map((item) => ({
        ...item,
        isActive: item.path === activePath, // Set isActive true for matching path
      }))
    );
  }, [location]);

  const toggleActiveMenu = (index: number) => {
    sessionStorage.setItem(
      "activeMenuItemIndex",
      JSON.stringify({ type: "user", index })
    );

    setUserMenuItems((prevState) =>
      prevState.map((item, i) => ({
        ...item,
        isActive: i === index, // Set isActive true for clicked item, false for others
      }))
    );
  };

  // Project Manager Menu Item
  useEffect(() => {
    const activePath = location.pathname;

    setPlMenuItems((prevState) =>
      prevState.map((item) => ({
        ...item,
        isActive: item.path === activePath, // Set isActive true for matching path
      }))
    );
  }, [location]);

  const toggleActiveMenuPL = (index: number) => {
    sessionStorage.setItem(
      "activeMenuItemIndex",
      JSON.stringify({ type: "pl", index })
    );

    setPlMenuItems((prevState) =>
      prevState.map((item, i) => ({
        ...item,
        isActive: i === index, // Set isActive true for clicked item, false for others
      }))
    );
  };

  // Department Manager Menu Item
  useEffect(() => {
    const activePath = location.pathname;

    setDlMenuItems((prevState) =>
      prevState.map((item) => ({
        ...item,
        isActive: item.path === activePath, // Set isActive true for matching path
      }))
    );
  }, [location]);

  const toggleActiveMenuDL = (index: number) => {
    sessionStorage.setItem(
      "activeMenuItemIndex",
      JSON.stringify({ type: "dl", index })
    );

    setDlMenuItems((prevState) =>
      prevState.map((item, i) => ({
        ...item,
        isActive: i === index, // Set isActive true for clicked item, false for others
      }))
    );
  };

  // Fleet Manager Menu Item
  useEffect(() => {
    const activePath = location.pathname;

    setFmMenuItems((prevState) =>
      prevState.map((item) => ({
        ...item,
        isActive: item.path === activePath, // Set isActive true for matching path
      }))
    );
  }, [location]);

  const toggleActiveMenuFM = (index: number) => {
    sessionStorage.setItem(
      "activeMenuItemIndex",
      JSON.stringify({ type: "dl", index })
    );

    setFmMenuItems((prevState) =>
      prevState.map((item, i) => ({
        ...item,
        isActive: i === index, // Set isActive true for clicked item, false for others
      }))
    );
  };

  //   -----------------
  const [isOpenSubMenu, setIsOpenSubMenu] = useState(
    new Array(usermenuItems.length).fill(false)
  );
  const toggleSubMenu = (index: number) => {
    setIsOpenSubMenu((prevState) => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // const theme = useTheme();
  // IF Refresh means not change to active menu bgcolor
  useEffect(() => {
    const activeMenu = sessionStorage.getItem("activeMenuItemIndex");
    if (activeMenu !== null) {
      const { type, index } = JSON.parse(activeMenu);
      switch (type) {
        case "user":
          toggleActiveMenu(index);
          break;
        case "pl":
          toggleActiveMenuPL(index);
          break;
        case "dl":
          toggleActiveMenuDL(index);
          break;

        default:
          break;
      }
    }
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        bgcolor: darkMode ? "#222222" : "",
      }}
    >
      <Box
        sx={{
          width: isOpenMenu ? "260px" : "45px",
          transition: "width 0.3s ease",
          bgcolor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "primary.contrastText" : "text.primary",
          position: isMobile ? "absolute" : "fixed",
          top: 0,
          bottom: 0,
          zIndex: 1,
          overflowY: "auto",
          boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        }}
      >
        <div className="top-section">
          <IconButton
            onClick={() => {
              toggleMenu();
            }}
            sx={{
              cursor: "pointer",
              color: darkMode ? "#eeeeed" : "#000000",
              "&:hover": {
                animation: "pulse 1s infinite",
              },
              transform: rotateIcon ? "rotate(90deg)" : "rotate(0deg)", // Rotate the icon based on the state
              transition: "transform 0.4s ease", // Add transition for smooth rotation effect
            }}
          >
            <AiOutlineBars size={22} />
          </IconButton>
        </div>
        {/* User menu items */}
        {employeeRole === "User" && (
          <>
            {usermenuItems.map((item, index) => (
              <div key={index} className="menu" onClick={item.onClick}>
                <Box
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    item.submenu && toggleSubMenu(index);
                    toggleActiveMenu(index);
                  }}
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    textDecoration: "none",
                    // color: "red",
                    bgcolor: item.isActive
                      ? darkMode
                        ? "#4d8c52"
                        : "#4D8C52"
                      : "",
                    "&:hover": {
                      bgcolor: item.isActive
                        ? darkMode
                          ? "#4d8c52d1"
                          : "#4d8c52d1"
                        : darkMode
                        ? "#363636"
                        : "#f0f0f0",
                      // color: darkMode ? "red" : "#000",
                    },
                  }}
                  style={{
                    color: item.isActive
                      ? darkMode
                        ? "#fff"
                        : "#FFF" // Active and darkMode
                      : darkMode
                      ? "#fff"
                      : "#323232", // Normal darkMode: red, Otherwise: black
                  }}
                >
                  <div>
                    {!isOpenMenu ? (
                      <div className="menuicon">{item.icon}</div>
                    ) : (
                      <Box
                        className="menuicons"
                        sx={{
                          padding: "5px",
                          // width: "200px",
                          // backgroundColor: "red",
                          // display: "flex",
                          // justifyContent: "space-evenly",
                          // float: "left",
                          animation: isOpenMenu
                            ? `slideInLeft ${index * 0.2}s ease forwards`
                            : "none",
                        }}
                      >
                        {item.icon}
                        <span className="menuName">{item.name}</span>
                        {item.submenu && (
                          <div className="arrow-container">
                            <MdKeyboardArrowDown
                              className={
                                isOpenSubMenu[index]
                                  ? "arrow-open"
                                  : "arrow-closed"
                              }
                            />
                          </div>
                        )}
                      </Box>
                    )}
                  </div>
                </Box>
                {item.submenu && isOpenSubMenu[index] && isOpenMenu && (
                  <Box
                    className="submenu"
                    sx={{ bgcolor: darkMode ? "#222222" : "#e6fde8" }}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Box
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            bgcolor: darkMode ? "#363636" : "#f0f0f0",
                            color: darkMode ? "#fff" : "#000",
                          },
                        }}
                        onClick={subItem.onClick}
                      >
                        <div className="submenuName1">
                          <span className="submenuName">{subItem.name}</span>
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </>
        )}

        {/* PL menu items */}
        {employeeRole === "Project Manager" && (
          <>
            {plmenuItems.map((item, index) => (
              <div key={index} className="menu" onClick={item.onClick}>
                <Box
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    item.submenu && toggleSubMenu(index);
                    toggleActiveMenuPL(index);
                  }}
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    textDecoration: "none",
                    // color: "red",
                    bgcolor: item.isActive
                      ? darkMode
                        ? "#4d8c52"
                        : "#4D8C52"
                      : "",
                    "&:hover": {
                      bgcolor: item.isActive
                        ? darkMode
                          ? "#4d8c52d1"
                          : "#4d8c52d1"
                        : darkMode
                        ? "#363636"
                        : "#f0f0f0",
                      // color: darkMode ? "red" : "#000",
                    },
                  }}
                  style={{
                    color: item.isActive
                      ? darkMode
                        ? "#fff"
                        : "#FFF" // Active and darkMode
                      : darkMode
                      ? "#fff"
                      : "#323232", // Normal darkMode: red, Otherwise: black
                  }}
                >
                  <div>
                    {!isOpenMenu ? (
                      <div className="menuicon">{item.icon}</div>
                    ) : (
                      <Box
                        className="menuicons"
                        sx={{
                          padding: "5px",
                          // width: "200px",
                          // backgroundColor: "red",
                          // display: "flex",
                          // justifyContent: "space-evenly",
                          // float: "left",
                          animation: isOpenMenu
                            ? `slideInLeft ${index * 0.2}s ease forwards`
                            : "none",
                        }}
                      >
                        {item.icon}
                        <span className="menuName">{item.name}</span>
                        {item.submenu && (
                          <div className="arrow-container">
                            <MdKeyboardArrowDown
                              className={
                                isOpenSubMenu[index]
                                  ? "arrow-open"
                                  : "arrow-closed"
                              }
                            />
                          </div>
                        )}
                      </Box>
                    )}
                  </div>
                </Box>
                {item.submenu && isOpenSubMenu[index] && isOpenMenu && (
                  <Box
                    className="submenu"
                    sx={{ bgcolor: darkMode ? "#222222" : "#e6fde8" }}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Box
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            bgcolor: darkMode ? "#363636" : "#f0f0f0",
                            color: darkMode ? "#fff" : "#000",
                          },
                        }}
                        onClick={subItem.onClick}
                      >
                        <div className="submenuName1">
                          <span className="submenuName">{subItem.name}</span>
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </>
        )}

        {/* DL menu items */}
        {employeeRole === "Department Manager" && (
          <>
            {dlmenuItems.map((item, index) => (
              <div key={index} className="menu" onClick={item.onClick}>
                <Box
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    item.submenu && toggleSubMenu(index);
                    toggleActiveMenuDL(index);
                  }}
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    textDecoration: "none",
                    // color: "red",
                    bgcolor: item.isActive
                      ? darkMode
                        ? "#4d8c52"
                        : "#4D8C52"
                      : "",
                    "&:hover": {
                      bgcolor: item.isActive
                        ? darkMode
                          ? "#4d8c52d1"
                          : "#4d8c52d1"
                        : darkMode
                        ? "#363636"
                        : "#f0f0f0",
                      // color: darkMode ? "red" : "#000",
                    },
                  }}
                  style={{
                    color: item.isActive
                      ? darkMode
                        ? "#fff"
                        : "#FFF" // Active and darkMode
                      : darkMode
                      ? "#fff"
                      : "#323232", // Normal darkMode: red, Otherwise: black
                  }}
                >
                  <div>
                    {!isOpenMenu ? (
                      <div className="menuicon">{item.icon}</div>
                    ) : (
                      <Box
                        className="menuicons"
                        sx={{
                          padding: "5px",
                          // width: "200px",
                          // backgroundColor: "red",
                          // display: "flex",
                          // justifyContent: "space-evenly",
                          // float: "left",
                          animation: isOpenMenu
                            ? `slideInLeft ${index * 0.2}s ease forwards`
                            : "none",
                        }}
                      >
                        {item.icon}
                        <span className="menuName">{item.name}</span>
                        {item.submenu && (
                          <div className="arrow-container">
                            <MdKeyboardArrowDown
                              className={
                                isOpenSubMenu[index]
                                  ? "arrow-open"
                                  : "arrow-closed"
                              }
                            />
                          </div>
                        )}
                      </Box>
                    )}
                  </div>
                </Box>
                {item.submenu && isOpenSubMenu[index] && isOpenMenu && (
                  <Box
                    className="submenu"
                    sx={{ bgcolor: darkMode ? "#222222" : "#e6fde8" }}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Box
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            bgcolor: darkMode ? "#363636" : "#f0f0f0",
                            color: darkMode ? "#fff" : "#000",
                          },
                        }}
                        onClick={subItem.onClick}
                      >
                        <div className="submenuName1">
                          <span className="submenuName">{subItem.name}</span>
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </>
        )}
        {/* Fleet M menu items */}
        {employeeRole === "Fleet Manager" && (
          <>
            {fmmenuItems.map((item, index) => (
              <div key={index} className="menu" onClick={item.onClick}>
                <Box
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    item.submenu && toggleSubMenu(index);
                    toggleActiveMenuFM(index);
                  }}
                  sx={{
                    display: "flex",

                    alignItems: "center",
                    textDecoration: "none",
                    // color: "red",
                    bgcolor: item.isActive
                      ? darkMode
                        ? "#4d8c52"
                        : "#4D8C52"
                      : "",
                    "&:hover": {
                      bgcolor: item.isActive
                        ? darkMode
                          ? "#4d8c52d1"
                          : "#4d8c52d1"
                        : darkMode
                        ? "#363636"
                        : "#f0f0f0",
                      // color: darkMode ? "red" : "#000",
                    },
                  }}
                  style={{
                    color: item.isActive
                      ? darkMode
                        ? "#fff"
                        : "#FFF" // Active and darkMode
                      : darkMode
                      ? "#fff"
                      : "#323232", // Normal darkMode: red, Otherwise: black
                  }}
                >
                  <div>
                    {!isOpenMenu ? (
                      <div className="menuicon">{item.icon}</div>
                    ) : (
                      <Box
                        className="menuicons"
                        sx={{
                          padding: "5px",
                          // width: "200px",
                          // backgroundColor: "red",
                          // display: "flex",
                          // justifyContent: "space-evenly",
                          // float: "left",
                          animation: isOpenMenu
                            ? `slideInLeft ${index * 0.2}s ease forwards`
                            : "none",
                        }}
                      >
                        {item.icon}
                        <span className="menuName">{item.name}</span>
                        {item.submenu && (
                          <div className="arrow-container">
                            <MdKeyboardArrowDown
                              className={
                                isOpenSubMenu[index]
                                  ? "arrow-open"
                                  : "arrow-closed"
                              }
                            />
                          </div>
                        )}
                      </Box>
                    )}
                  </div>
                </Box>
                {item.submenu && isOpenSubMenu[index] && isOpenMenu && (
                  <Box
                    className="submenu"
                    sx={{ bgcolor: darkMode ? "#222222" : "#e6fde8" }}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Box
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                          "&:hover": {
                            bgcolor: darkMode ? "#363636" : "#f0f0f0",
                            color: darkMode ? "#fff" : "#000",
                          },
                        }}
                        onClick={subItem.onClick}
                      >
                        <div className="submenuName1">
                          <span className="submenuName">{subItem.name}</span>
                        </div>
                      </Box>
                    ))}
                  </Box>
                )}
              </div>
            ))}
          </>
        )}
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          //   background: "#effaef",
          bgcolor: darkMode ? "#222222" : "#effaef",
          paddingTop: "64px",
          paddingLeft: isOpenMenu ? (isMobile ? "20px" : "230px") : "20px",
          overflowY: "auto",
        }}
      >
        <main
          style={{
            background: darkMode ? "#494949" : "",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          {children}
        </main>
      </Box>

      <Drawer
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: darkMode ? "#222222" : "#FFF",
            color: darkMode ? "#fff" : "#000",
            width: "50%",
          },
          "@media (max-width: 600px)": {
            "& .MuiPaper-root": {
              width: "80%",
            },
          },
          "@media (max-width: 1024px)": {
            "& .MuiPaper-root": {
              width: "85%",
            },
          },
        }}
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false, "")}
      >
        <Box sx={{ padding: "20px" }}>
          {currentDrawer === "Passenger" && (
            <Passenger
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )}
          {currentDrawer === "Goods" && (
            <Goods
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )}
          {currentDrawer === "Equipment" && (
            <Equipment
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )}
          {currentDrawer === "GroupRide" && (
            <GroupRide
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )}
          {currentDrawer === "TravelRoute" && (
            <TravelRoute
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideBar;
