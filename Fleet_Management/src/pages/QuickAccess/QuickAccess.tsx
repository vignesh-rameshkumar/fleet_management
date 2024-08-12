import { Box } from "@mui/material";
import { bgcolor, border, display, margin, padding, width } from "@mui/system";
import React from "react";
import Bg from "../../assets/Bg.png";
import { FaArrowRight } from "react-icons/fa6";
import { BsJustify } from "react-icons/bs";
import { MdDashboardCustomize } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";

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
              color: darkMode ? "#FFF" : "", // Conditionally apply color based on dark mode
              textAlign: { xs: "center", md: "left" }, // Center text on small screens, align left on medium screens
            }}
          >
            Life is 10% what happens to us and 90% how we react to it{" "}
            <span className="titleAut">- DENNIS P. KIMBRO</span>
          </Box>
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
                    }}
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
                    }}
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
                    }}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Book Ride - Travel Within Office
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
                    }}
                  >
                    <span style={{ background: "#88AB8A", padding: "5px" }}>
                      <MdDashboardCustomize size={40} color="#fff" />
                    </span>

                    <Box
                      sx={{ flex: 1, textAlign: "left", paddingLeft: "20px" }}
                    >
                      Update Travel Route
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
                    }}
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
      </Box>
    </>
  );
};

export default QuickAccess;
