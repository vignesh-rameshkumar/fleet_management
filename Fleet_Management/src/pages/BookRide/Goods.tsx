import React from "react";

import {
  Box,
  Button,
  TextField,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { useFrappeCreateDoc, useFrappeGetDocList } from "frappe-react-sdk";

import dayjs from "dayjs";
interface GoodsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Goods: React.FC<GoodsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const ThemeColor = createTheme({
    palette: {
      primary: {
        main: darkMode ? "#d1d1d1" : "#2D5831",
      },
    },
    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            "& fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "",
              color: darkMode ? "#d1d1d1" : "#000",
            },
            "&:hover fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "#3f9747",
            },
            "&.Mui-focused fieldset": {
              borderColor: darkMode ? "#d1d1d1" : "#3f9747",
            },
            "& input::placeholder": {
              color: darkMode ? "#d1d1d1" : "#000",
            },
            "& input": {
              color: darkMode ? "#d1d1d1" : "#5b5b5b",
            },
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            backgroundColor: "#EFFFEF !important",
            color: darkMode ? "#5b5b5b" : "#5b5b5b",
            "&:hover": {
              backgroundColor: "#4D8C52 !important",
              color: "#fff !important",
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          input: {
            "&::placeholder": {
              color: darkMode ? "#d1d1d1" : "#000",
            },
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },

      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: darkMode ? "#d1d1d1" : "#5b5b5b",
          },
        },
      },
      MuiRadio: {
        styleOverrides: {
          root: {
            "&$checked": {
              color: "#d1d1d1",
            },
          },
        },
      },
    },
  });
  const handleCancel = () => {
    onCloseDrawer();
  };
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box>
          <div className="m-4">
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                flexGrow={1}
                className="drawerTitle"
                sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
              >
                Goods
              </Box>
              <Button
                className="closeX"
                sx={{
                  color: darkMode ? "#d1d1d1" : "#5b5b5b",
                }}
                onClick={onCloseDrawer}
              >
                X
              </Button>
            </Box>
            <br />
            <br />

            <Box display="flex" flexDirection="column" alignItems="center">
              <ThemeProvider theme={ThemeColor}>
                <Box
                  width={{ xs: "100%", sm: "100%", md: "90%" }}
                  marginBottom="16px"
                  textAlign={"center"}
                >
                  <DatePicker
                    label={
                      <Typography>
                        From <code className="CodeStar">*</code>
                      </Typography>
                    }
                    // value={fromDate}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "100%",
                        md: "90%",
                      },
                    }}
                    views={["year", "month"]}
                    format="MMMM YYYY"
                    // minDate={minDate}
                    // maxDate={maxDate}
                    // onChange={handleFromDateChange}
                    renderInput={(params) => (
                      <TextField {...params} variant="outlined" />
                    )}
                    disableFuture
                  />
                </Box>
              </ThemeProvider>
              <Box sx={{ display: "flex" }}>
                <Button className="cancelBtn" onClick={handleCancel}>
                  Cancel
                </Button>

                <Button
                  className="saveBtn"
                  //  onClick={handleCreateRaiseRequest}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </div>
        </Box>
      </LocalizationProvider>
    </>
  );
};

export default Goods;
