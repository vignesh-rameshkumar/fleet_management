import React, { useState, useEffect } from "react";
import { Box, Drawer } from "@mui/material";
import { bgcolor, border, display, margin, padding, width } from "@mui/system";

import Bg from "../../assets/Bg.png";
import { FaArrowRight } from "react-icons/fa6";
import { BsJustify } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { toast } from "react-toastify";
import Passenger from "../BookRide/Passenger";
import TravelRoute from "../BookRide/TravelRoute";
import GroupRide from "../BookRide/GroupRide";
import Equipment from "../BookRide/Equipment";
interface QuickAccessProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const QuickAccess: React.FC<QuickAccessProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentDrawer, setCurrentDrawer] = useState<string>("");

  const toggleDrawer = (open: boolean, drawerType: string) => {
    setIsOpen(open);
    setCurrentDrawer(drawerType);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false, "");
  };

  const handleCome = () => {
    toast.warning("Coming Soon...");
  };

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return "Good Morning";
    } else if (currentHour < 18) {
      return "Good Afternoon";
    } else if (currentHour < 21) {
      return "Good Evening";
    } else {
      return "Good Night";
    }
  };
  const greeting = getGreeting();

  const quotes = [
    "Life is 10% what happens to us and 90% how we react to it - DENNIS P. KIMBRO",
    "Hard work beats talent if talent doesn't work hard - Tim Notke",
    "If you’re not failing every now and again, it's a sign you're not doing anything very innovative - Woody Allen",
    "The secret of success is to do the common things uncommonly well - John D Rockefeller",
    "Either you run the day or the day runs you - Jim Rohn",
    "Tough times don't last. Tough teams do.",
    "Act as if what you do makes a difference. It does. - William James",
    "There are no shortcuts to any place worth going - Beverly Sills",
    "Life begins at the end of your comfort zone - Neale Donald Walsh",
  ];

  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    const updateQuote = () => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    };

    updateQuote();

    const intervalId = setInterval(updateQuote, 3600000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Box
        sx={{
          padding: "10px 20px",
          color: darkMode ? "#FFF" : "#000",
          textAlign: { xs: "center", md: "left" }, // Center text on small screens, align left on medium screens
          backgroundColor: darkMode ? "#222222" : "#fff",
        }}
      >
        <br />
        <div>
          <Box className="title">
            {greeting}{" "}
            <Box
              component="span"
              sx={{
                display: "inline-block",
                animation: "zoomInOut 2s ease infinite",
              }}
            >
              {userName}
            </Box>{" "}
          </Box>

          <Box
            className="Subtitle"
            sx={{
              color: darkMode ? "#FFF" : "",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            {/* Life is 10% what happens to us and 90% how we react to it{" "}
            <span className="titleAut">- DENNIS P. KIMBRO</span> */}
            {currentQuote}
          </Box>
          <br />

          <Box>
            <p className="QA">Quick Links</p>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ width: "40%", padding: "10px" }}>
                <Box>
                  <Box
                    className="QL"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow:
                        "0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001C",
                      padding: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleDrawer(true, "TravelRoute")}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Travel Route QR
                    </Box>

                    <FaArrowRightLong
                      size={20}
                      style={{ marginRight: "20px" }}
                    />
                  </Box>
                  <Box
                    className="QL"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow:
                        "0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001C",
                      padding: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleDrawer(true, "GroupRide")}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Book Ride - Group Ride
                    </Box>

                    <FaArrowRightLong
                      size={20}
                      style={{ marginRight: "20px" }}
                    />
                  </Box>
                  <Box
                    className="QL"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow:
                        "0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001C",
                      padding: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleDrawer(true, "Passenger")}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Book Ride - Passenger
                    </Box>

                    <FaArrowRightLong
                      size={20}
                      style={{ marginRight: "20px" }}
                    />
                  </Box>
                  <Box
                    className="QL"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow:
                        "0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001C",
                      padding: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleDrawer(true, "Equipment")}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Book Ride - Equipment
                    </Box>

                    <FaArrowRightLong
                      size={20}
                      style={{ marginRight: "20px" }}
                    />
                  </Box>
                  <Box
                    className="QL"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      boxShadow:
                        "0px 3.2px 7.2px 0px #00000021, 0px 0.6px 1.8px 0px #0000001C",
                      padding: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                    onClick={() => handleCome()}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Coins
                    </Box>

                    <FaArrowRightLong
                      size={20}
                      style={{ marginRight: "20px" }}
                    />
                  </Box>
                </Box>
              </Box>
              <Box sx={{ width: "60%", padding: "10px" }}>
                <img src={Bg} style={{ float: "right" }} />
              </Box>
            </Box>
          </Box>
        </div>
        <br /> <br />
      </Box>

      {/* Drawer */}

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
          {/* {currentDrawer === "Goods" && (
            <Goods
              darkMode={darkMode}
              onCloseDrawer={handleCloseDrawer}
              userEmailId={userEmailId}
              employeeID={employeeID}
              userName={userName}
            />
          )} */}
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
    </>
  );
};

export default QuickAccess;
