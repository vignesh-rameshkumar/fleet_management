import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import porter from "../../assets/porter.png";
import danzo from "../../assets/danzo.png";
interface ExternalServicesProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const ExternalServices: React.FC<ExternalServicesProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  const handleCardClick = (url: string) => {
    window.location.href = url;
  };
  const buttonStyle = {
    backgroundColor: "#5e8d57", // Common green color for both buttons
    color: "#fff",
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    textTransform: "none",
    fontSize: "16px",
    marginTop: "15px",
  };
  return (
    <Box
      sx={{
        backgroundColor: darkMode ? "#222222" : "#fff",
        padding: "80px 10px",
        width: "100%",
      }}
    >
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: darkMode ? "#333" : "#f5f5f5",
              borderRadius: "10px",
              boxShadow: darkMode
                ? "0 0 10px rgba(255, 255, 255, 0.1)"
                : "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardActionArea
              onClick={() => handleCardClick("https://porter.in/")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",

                  padding: "10px",
                  width: "100%",
                }}
              >
                <img
                  src={porter}
                  alt="Porter"
                  style={{ width: "100%", height: "auto" }}
                />
                <Button style={buttonStyle}>Porter</Button>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              backgroundColor: darkMode ? "#333" : "#f5f5f5",
              borderRadius: "10px",
              boxShadow: darkMode
                ? "0 0 10px rgba(255, 255, 255, 0.1)"
                : "0 0 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardActionArea
              onClick={() => handleCardClick("https://www.dunzo.com/")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                  width: "100%",
                }}
              >
                <img
                  src={danzo}
                  alt="Dunzo"
                  style={{ width: "100%", height: "auto" }}
                />
                <Button style={buttonStyle}>Dunzo</Button>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExternalServices;
