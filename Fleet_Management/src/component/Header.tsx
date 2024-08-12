import React, { useState, useEffect, useContext } from "react";
import { IconButton, Box, Avatar } from "@mui/material";
import { CiLight } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useFrappeGetDocList, useFrappeDeleteDoc } from "frappe-react-sdk";
import { IoMoonOutline } from "react-icons/io5";
import Logo from "../assets/LogoAgnikul.png";
import LogoSmall from "../assets/agnikul 8.png";
import { useFrappeAuth } from "frappe-react-sdk";

interface HeaderProps {
  darkMode: boolean;
  isOpenMenu: boolean;
  toggleDarkMode: () => void;
  userEmailId: string;
  userName: string;
  empID: string;
  reportemail: string;
  reportDepartment: string;
  reportDepartmentSuperAdmin: string;
}

const Header: React.FC<HeaderProps> = ({
  toggleDarkMode,
  isOpenMenu,
  darkMode,
  userEmailId,
  userName,
  empID,
  userImage,
}) => {
  // const { empdetail, setEmpdetail, role, setRole } = useContext(locateContext);.......

  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useFrappeAuth();
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      window.location.href = "/login";
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const dropdownMenu = document.querySelector(".profile-dropdown");
      if (isOpen && dropdownMenu && !dropdownMenu.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscKeyPress = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKeyPress);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const navigate = useNavigate();

  // Employee
  const { data: Employee }: any = useFrappeGetDocList("Employee", {
    fields: ["company_email", "qr_url"],
    filters: [["company_email", "=", userEmailId]],

    orderBy: {
      field: "modified",
      order: "desc",
    },
    limit: 100000,
  });

  const [employeeData, setEmployeeData] = useState(Employee);

  useEffect(() => {
    setEmployeeData(Employee);
  }, [Employee]);

  //-------------------------------------------
  return (
    <Box
      className="HeaderWrapper"
      sx={{
        bgcolor: darkMode ? "#222222" : "#fff",
        color: darkMode ? "#eeeeed" : "",
        animation: "fadeIn 1s ease forwards",
        boxShadow: isOpenMenu
          ? "rgba(0, 0, 0, 0.24) 262px 3px 8px"
          : "rgba(0, 0, 0, 0.24) 50px 3px 8px",
      }}
    >
      <Box
        sx={{ display: isOpenMenu ? "block" : "none", position: "relative" }}
      >
        <div style={{ width: "200px" }}>
          <Link to="/Payroll_Management">
            <img
              className="largeLogo"
              src={Logo}
              alt="Logo"
              width="100%"
              onClick={() => window.location.reload()}
            />
            <div className="logoLine"></div>
          </Link>
        </div>
      </Box>

      <Box sx={{ display: isOpenMenu ? "none" : "block" }}>
        <Link to="/Payroll_Management">
          <img
            src={LogoSmall}
            alt="Small Logo"
            className="largeLogo"
            width="25px"
            onClick={() => window.location.reload()}
          />
        </Link>
      </Box>
      <Box
        className="payrollText"
        sx={{
          color: darkMode ? "#fff" : "#323232",
          display: { xs: "none", sm: "block" },
          animation: "fadeIn 2s ease forwards", // Apply fadeIn animation
        }}
      >
        Fleet Management
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: darkMode ? "#222222" : "#fff",
            color: darkMode ? "#eeeeed" : "",
            animation: "fadeIn 3s ease forwards",
          }}
        >
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              color: darkMode ? "#eeeeed" : "",
            }}
          >
            {darkMode ? <CiLight size={25} /> : <IoMoonOutline size={20} />}
          </IconButton>
          <IconButton sx={{ color: darkMode ? "#eeeeed" : "" }}></IconButton>
        </Box>

        <Box sx={{ padding: "6px", fontWeight: 500 }}>{userName}</Box>
        <Box className="avatarpic" sx={{ position: "relative" }}>
          <Avatar src={userImage} alt="Avatar" onClick={toggleDropdown} />

          {isOpen && (
            <Box
              className="profile-dropdown"
              sx={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                zIndex: 9999,
                border: "1px solid #d1d1d1",
                borderRadius: "4px",
                boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                minWidth: "150px",
                cursor: "pointer",
                bgcolor: darkMode ? "#222222" : "#fff",
              }}
            >
              <Box
                sx={{
                  p: 1,
                  "&:hover": { bgcolor: darkMode ? "#333333" : "#f0f0f0" },
                }}
                onClick={() => {
                  navigate("/app/new-home-page");
                  window.location.reload();
                }}
              >
                <span style={{ marginRight: "8px" }}>Switch Desk</span>
              </Box>
              <Box
                sx={{
                  p: 1,
                  "&:hover": { bgcolor: darkMode ? "#333333" : "#f0f0f0" },
                }}
                onClick={handleLogout}
              >
                <span style={{ marginRight: "8px" }}>Log Out</span>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
