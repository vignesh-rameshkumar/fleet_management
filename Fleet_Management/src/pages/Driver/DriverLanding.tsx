import React, { useState, useEffect, useRef } from "react";
import pic1 from "../../assets/car1.png";
import pic2 from "../../assets/bus1.png";
import pic3 from "../../assets/freepik--Character--inject-4.png";
import pic4 from "../../assets/Car driving-bro 1.png";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  FormControl,
  InputAdornment,
  DialogContentText,
  MenuItem,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  ListSubheader,
  InputLabel,
} from "@mui/material";
import { QrReader } from "react-qr-reader";

import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { toast } from "react-toastify";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MdDeleteOutline } from "react-icons/md";
import { FiArrowLeft } from "react-icons/fi";

import {
  useFrappeCreateDoc,
  useFrappeGetDocList,
  useFrappeGetDoc,
  useFrappeDeleteDoc,
} from "frappe-react-sdk";

import dayjs from "dayjs";
interface DriverProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}
const DriverLanding: React.FC<DriverProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("selectedLanguage") || "English";
  });
  const [driverShow, setDriverShow] = useState(true);
  const [passengerShow, setPassengerShow] = useState(false);
  const [dailyShow, setDailyShow] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState();
  const [time, setTime] = useState(0); // Keeps track of elapsed time in seconds
  const [isRunning, setIsRunning] = useState(false); // Controls the timer's running state
  const [totalTime, setTotalTime] = useState(0); // Accumulates total time in seconds
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const [qrData, setQrData] = useState(null);
  const [scannerShow, setScannerShow] = useState(true);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [scannedCodes, setScannedCodes] = useState(new Set());

  const handleStartscanner = () => {
    setScannerShow(false);
  };

  const handleStopscanner = () => {
    setScannerShow(true);
  };

  const handleScanResult = () => {
    if (qrData) {
      const scannedCode = qrData;
      setQrData(scannedCode);

      if (scannedCodes.has(scannedCode)) {
        if (!hasShownToast) {
          toast.info("QR code has already been scanned.");
          setHasShownToast(true);
        }
      } else {
        toast.success("QR code scanned successfully!");
        setScannedCodes((prevCodes) => new Set(prevCodes).add(scannedCode));
        setHasShownToast(false); // Reset the toast state for new scans
      }
    }
  };

  const handleError = (error) => {
    console.error("QR Scan Error:", error);
  };
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

  // Language Change
  const handleLanguageChange = (event: any) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);
    localStorage.setItem("selectedLanguage", selectedLanguage); // Store language in localStorage
  };

  useEffect(() => {
    const storedLanguage = localStorage.getItem("selectedLanguage");
    if (storedLanguage && storedLanguage !== language) {
      setLanguage(storedLanguage);
    }
  }, [language]);

  // Route ID API Start ---------------

  const { data: FM_Route_ID }: any = useFrappeGetDocList("FM_Route_ID", {
    fields: ["*"],
    filters: [["enabled", "=", true]],
    limit: 100000,
    orderBy: {
      field: "modified",
      order: "desc",
    },
  });

  const [routeId, setRouteId] = useState(FM_Route_ID);

  useEffect(() => {
    setRouteId(FM_Route_ID);
  }, [FM_Route_ID]);

  const handleRouteId = (event: any) => {
    setSelectedRouteId(event.target.value);
    setPickup([]);
    setDropPoint([]);
    setDailyShow(true);
    setPassengerShow(false);
    setDriverShow(false);
    setSelectedDropPoint(null);
    setSelectedPickUp(null);
  };

  const { data: pickup } = useFrappeGetDoc("FM_Route_ID", selectedRouteId);
  const [pickUp, setPickup] = useState([]);

  useEffect(() => {
    if (pickup && pickup?.route) {
      const routeList = pickup?.route?.map((x) => x.location_name);
      setPickup(routeList);
    }
  }, [pickup]);

  const [selectedPickup, setSelectedPickUp] = useState();

  const handlePickId = (event) => {
    setSelectedPickUp(event.target.value);
  };

  const { data: drop } = useFrappeGetDoc("FM_Route_ID", selectedRouteId);
  const [dropPoint, setDropPoint] = useState([]);

  useEffect(() => {
    if (drop && drop?.route) {
      const routeList = drop?.route
        ?.map((x) => x.location_name)
        .filter((location) => location !== selectedPickup); // Filter out the selected pickup location
      setDropPoint(routeList);
    }
  }, [drop, selectedPickup]);

  const [selectedDropPoint, setSelectedDropPoint] = useState("");

  const handleDropId = (event) => {
    const dropPoint = event.target.value;

    if (dropPoint === selectedPickup) {
      toast.warning("The Pickup and Drop locations cannot be the same.");
      setSelectedDropPoint("");
    } else {
      setSelectedDropPoint(dropPoint);
    }
  };

  // END

  // Start Passenger time count
  const handleStart = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now(); // Record the start time
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000); // Increment time every second
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    const endTime = Date.now(); // Record the end time
    const sessionTime = Math.floor((endTime - startTimeRef.current) / 1000); // Calculate the session time in seconds
    setTotalTime((prevTotal) => prevTotal + sessionTime); // Update total time
    setTime(0); // Reset the current timer
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };
  // END -------------
  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        <Box
          sx={{
            margin: "10px 0px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {(passengerShow || dailyShow) && (
            <FiArrowLeft
              size={20}
              className="backArrow"
              onClick={() => {
                setDriverShow(true);
                setPassengerShow(false);
                setDailyShow(false);
                setPickup([]);
                setDropPoint([]);
                setSelectedDropPoint("");
                setSelectedRouteId(null);
              }}
            />
          )}
          <Box></Box>

          <ThemeProvider theme={ThemeColor}>
            <Box
              sx={{
                width: {
                  xs: "30%",
                  sm: "30%",
                  md: "30%",
                },
              }}
            >
              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                }}
              >
                <InputLabel>Select Language</InputLabel>
                <Select
                  label="Select Language"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Tamil">Tamil</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </ThemeProvider>
        </Box>
        <br />
        {driverShow && (
          <>
            <div
              style={{
                backgroundColor: "#fff",
                // minHeight: "70vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                  width: "75%",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    padding: "20px",
                    backgroundColor: "#C1E5CB",
                    color: "#000",
                    textAlign: "center",
                    fontWeight: "600",
                    flex: 1,
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDriverShow(false);
                    setDailyShow(false);
                    setPassengerShow(true);
                  }}
                >
                  <img
                    src={pic1}
                    alt="Passenger Ride"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <span>
                    {" "}
                    {language === "English"
                      ? "Passengers Ride"
                      : "பயணிகள் சவாரி"}{" "}
                  </span>
                </Box>

                <Box
                  sx={{
                    padding: "20px",
                    borderRadius: "5px",
                    backgroundColor: "#C1E5CB",
                    color: "#000",
                    textAlign: "center",
                    fontWeight: "600",
                    flex: 1,
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDriverShow(false);
                    setDailyShow(true);
                    setPassengerShow(false);
                    setScannerShow(true);
                  }}
                >
                  <img
                    src={pic2}
                    alt="Passenger Ride"
                    style={{ width: "100%", height: "auto" }}
                  />

                  <span>
                    {language === "English" ? "Daily Ride" : "தினசரி பயணம்"}
                  </span>
                </Box>
              </Box>
            </div>
          </>
        )}
        {/* Passenger Show Start */}
        {passengerShow && (
          <>
            <div
              style={{
                backgroundColor: "#fff",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%" },

                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    padding: "20px",
                    width: { xs: "100%", sm: "100%", md: "90%" },

                    border: "10px solid #C1E5CB",
                    // backgroundColor: "#C1E5CB",
                    color: "#000",
                    textAlign: "center",
                    fontWeight: "600",
                    flex: 1,
                    maxWidth: { xs: "100%", md: "60%" },
                    //cursor: "pointer",
                  }}
                  // onClick={() => {
                  //   setDriverShow(false);
                  //   setDailyShow(false);
                  //   setPassengerShow(true);
                  // }}
                >
                  <img
                    src={pic4}
                    alt="Passenger Ride"
                    style={{ width: "100%", height: "auto" }}
                  />
                  <span>
                    {" "}
                    {language === "English"
                      ? "Passengers Ride"
                      : "பயணிகள் சவாரி"}{" "}
                  </span>
                  <br />
                  <br />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      fontWeight: 500,
                    }}
                  >
                    <p>
                      {language === "English"
                        ? "Passenger Name :"
                        : "பயணியின் பெயர் :"}{" "}
                      <b>Rajesh </b>
                    </p>
                    <p>
                      {language === "English"
                        ? " Pickup Point :"
                        : "ஏறும் இடம் :"}{" "}
                      <b>Chennai</b>
                    </p>
                    <p>
                      {language === "English"
                        ? "Drop Point : "
                        : "இறங்கும் இடம் :"}{" "}
                      <b>Bangalore</b>
                    </p>
                    <p>
                      {language === "English"
                        ? "Pickup Point Time : "
                        : "ஏறும் நேரம் :"}{" "}
                      <b>10:00 Am</b>
                    </p>
                    <p>
                      {language === "English"
                        ? "Ride start Time : "
                        : "பயணம் தொடங்கும் நேரம் :"}{" "}
                      <b>10:00 Am</b>
                    </p>
                  </Box>
                  <Box
                    sx={{
                      padding: "5px 10px",
                      width: "200px",
                      margin: "0 auto",
                      fontSize: "32px",
                      fontWeight: 600,
                      border: "1px solid #959595",
                      backgroundColor: "#fff",
                      borderRadius: "5px",
                      boxShadow:
                        "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px",
                    }}
                  >
                    {formatTime(time)}
                  </Box>
                  {/* {JSON.stringify(totalTime)}
                  {JSON.stringify(time)} */}

                  {isRunning ? (
                    <Button className="deleteBtn" onClick={handleStop}>
                      Stop Ride
                    </Button>
                  ) : (
                    <Button className="saveBtn" onClick={handleStart}>
                      Start Ride
                    </Button>
                  )}
                </Box>
              </Box>
              <br />
            </div>
          </>
        )}

        {/* travel Show Start */}
        {dailyShow && (
          <>
            <div
              style={{
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "50%" },
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "20px",
                }}
              >
                <Box
                  sx={{
                    borderRadius: "5px",
                    padding: "20px",
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    border: "10px solid #C1E5CB",
                    color: "#000",
                    textAlign: "center",
                    fontWeight: "600",
                    flex: 1,
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                >
                  {scannerShow ? (
                    <>
                      <br /> <br />
                      <img
                        src={pic3}
                        alt="Daily Ride"
                        style={{ width: "100%", height: "auto" }}
                      />
                      <br /> <br />
                      <span>
                        {" "}
                        {language === "English"
                          ? "Daily Ride"
                          : "தினசரி பயணம்"}{" "}
                      </span>
                      <br /> <br />
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <ThemeProvider theme={ThemeColor}>
                          <Box
                            // className="slideFromRight"
                            width={{ xs: "100%", sm: "100%", md: "90%" }}
                            marginBottom="16px"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <FormControl
                              variant="outlined"
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "90%" },
                              }}
                            >
                              <InputLabel>
                                Select Route ID {""}
                                <Typography className="CodeStar" variant="Code">
                                  *
                                </Typography>
                              </InputLabel>
                              <Select
                                value={selectedRouteId}
                                onChange={(event) => {
                                  handleRouteId(event);
                                }}
                                label={
                                  <>
                                    Select Route ID {""}
                                    <Typography
                                      className="CodeStar"
                                      variant="Code"
                                    >
                                      *
                                    </Typography>
                                  </>
                                }
                              >
                                {routeId?.map((x) => (
                                  <MenuItem key={x?.name} value={x.name}>
                                    {x.start_point} - {x.end_point}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          <Box
                            // className="slideFromRight"
                            width={{ xs: "100%", sm: "100%", md: "90%" }}
                            marginBottom="16px"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <FormControl
                              variant="outlined"
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "90%" },
                              }}
                            >
                              <InputLabel>
                                Select Pick Up Point {""}
                                <Typography className="CodeStar" variant="Code">
                                  *
                                </Typography>
                              </InputLabel>
                              <Select
                                value={selectedPickup}
                                disabled={!selectedRouteId}
                                onChange={handlePickId}
                                label={
                                  <>
                                    Select Pick Up Point {""}
                                    <Typography
                                      className="CodeStar"
                                      variant="Code"
                                    >
                                      *
                                    </Typography>
                                  </>
                                }
                              >
                                {pickUp?.map((x) => (
                                  <MenuItem key={x?.name} value={x}>
                                    {x}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>

                          <Box
                            // className="slideFromRight"
                            width={{ xs: "100%", sm: "100%", md: "90%" }}
                            marginBottom="16px"
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <FormControl
                              variant="outlined"
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "90%" },
                              }}
                            >
                              <InputLabel>
                                Select Drop Point{" "}
                                <Typography className="CodeStar" variant="Code">
                                  *
                                </Typography>
                              </InputLabel>
                              <Select
                                value={selectedDropPoint}
                                disabled={!selectedRouteId || !selectedPickup}
                                onChange={handleDropId}
                                label={
                                  <>
                                    Select Drop Point{" "}
                                    <Typography
                                      className="CodeStar"
                                      variant="Code"
                                    >
                                      *
                                    </Typography>
                                  </>
                                }
                              >
                                {dropPoint?.map((x) => (
                                  <MenuItem key={x?.name} value={x}>
                                    {x}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                        </ThemeProvider>
                      </LocalizationProvider>
                      <Button className="saveBtn" onClick={handleStartscanner}>
                        Start Ride
                      </Button>
                    </>
                  ) : (
                    <>
                      <p>Route Id :</p>
                      <QrReader
                        onResult={handleScanResult}
                        onError={handleError} // Add this if your version of react-qr-reader supports it
                        style={{ width: "100%", height: "auto" }}
                      />
                      <Box mt={2}>
                        <p>Scanned QR Data: {qrData}</p>
                      </Box>
                      <Button className="deleteBtn" onClick={handleStopscanner}>
                        Stop Ride
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </div>
          </>
        )}
        <br />
      </div>
    </>
  );
};

export default DriverLanding;
