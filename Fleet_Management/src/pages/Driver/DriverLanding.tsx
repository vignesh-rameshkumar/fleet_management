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
  useFrappeUpdateDoc,
  useFrappeGetCall,
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
  const [totalTime, setTotalTime] = useState<string | null>(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const [startTime, setStartTime] = useState<string | null>(null); // To track start time

  const [qrData, setQrData] = useState(null);
  const [scannerShowPage, setScannerShowPage] = useState(true);
  const [hasShownToast, setHasShownToast] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [parentNameData, setparentNameData] = useState<any>(null);

  // console.log("webcamStream", webcamStream?.map(x)=>XMLDocument.MediaStream);

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

  // END

  // Start Passenger time count
  const handleStart = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setStartTime(currentTime);
    updateRideTime("start");
  };

  const handleStop = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);

    const endTime = Date.now();
    const sessionTimeInSeconds = Math.floor(
      (endTime - startTimeRef.current) / 1000
    ); // Calculate the session time in seconds

    // Convert total time to HH:mm:ss format
    const totalHours = Math.floor(sessionTimeInSeconds / 3600); // Total hours
    const totalMinutes = Math.floor((sessionTimeInSeconds % 3600) / 60); // Total minutes
    const totalSeconds = sessionTimeInSeconds % 60; // Remaining seconds

    // Format hours, minutes, and seconds as HH:mm:ss
    const formattedHours = String(totalHours).padStart(2, "0");
    const formattedMinutes = String(totalMinutes).padStart(2, "0");
    const formattedSeconds = String(totalSeconds).padStart(2, "0");
    const formattedTotalTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    setTotalTime(formattedTotalTime);
    // setTime(0);
    updateRideTime("end");
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

  // Parent and child API

  const { updateDoc } = useFrappeUpdateDoc();

  const handleStopScanner = async () => {
    try {
      if (webcamStream && webcamStream.getTracks) {
        webcamStream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
            console.log(`Track with kind ${track.kind} stopped.`);
          } else {
            console.log(`Track with kind ${track.kind} is already stopped.`);
          }
        });
      } else {
        console.warn("No webcam stream available to stop.");
      }

      if (parentNameData && parentNameData.name) {
        const body = {
          ride_status: "Completed",
        };
        await updateDoc("FM_Travel_Route_Report", parentNameData.name, body);
        toast.success("Ride Completed Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Invalid parent document data");
      }

      // Update component state
      setWebcamStream(null);
      setScannerShowPage(true);
      setHasShownToast(false);

      console.log("Webcam stopped and scanner hidden.");
    } catch (error) {
      console.error("Error in handleStopScanner:", error);
      toast.error(
        error.message || "Failed to stop scanner and update document"
      );
    }
  };

  const { createDoc } = useFrappeCreateDoc();
  const handleStartScanner = () => {
    // setScannerShowPage(false);
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        setWebcamStream(stream);
        console.log("Webcam started:", stream);
      })
      .catch((err) => {
        console.error("Error accessing webcam: ", err);
      });
    createParentDocument();
  };

  const { data: FM_Travel_Route_Report }: any = useFrappeGetDocList(
    "FM_Travel_Route_Report",
    {
      filters: [["route_id", "=", selectedRouteId]],
      fields: ["name", "ride_status"],

      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [oldDataId, setOldDataId] = useState(FM_Travel_Route_Report);

  useEffect(() => {
    setOldDataId(FM_Travel_Route_Report);
  }, [FM_Travel_Route_Report]);

  const createParentDocument = async () => {
    try {
      // First, check if any documents exist with the same route_id
      const existingDocs = oldDataId;

      let parentName;
      let parentResponse;

      if (existingDocs && existingDocs.length > 0) {
        // Find the first document with a ride_status that is not "Completed"
        const ongoingDoc = existingDocs.find(
          (doc) => doc.ride_status !== "Completed"
        );

        if (ongoingDoc) {
          // Continue the existing ride
          parentName = ongoingDoc.name;
          parentResponse = ongoingDoc;
          toast.info("Continuing existing ride.");
        } else {
          const parentBody = {
            ride_starting_point: selectedPickup,
            route_id: selectedRouteId,
          };
          parentResponse = await createDoc(
            "FM_Travel_Route_Report",
            parentBody
          );
          parentName = parentResponse?.name;
          toast.success("New ride started successfully!");
          setScannerShowPage(false);
          setOldDataId((prevData) => [parentResponse, ...prevData]);
        }
      } else {
        const parentBody = {
          ride_starting_point: selectedPickup,
          route_id: selectedRouteId,
        };
        parentResponse = await createDoc("FM_Travel_Route_Report", parentBody);
        parentName = parentResponse?.name;
        toast.success("New ride started successfully!");
        setScannerShowPage(false);
        setOldDataId((prevData) => [parentResponse, ...prevData]);
      }

      if (!parentName) {
        throw new Error("Failed to create or retrieve parent document");
      }

      setparentNameData(parentResponse);
      return parentName;
    } catch (error) {
      console.error("Error in createParentDocument:", error);
      toast.error(error.message || "Failed to start or continue ride");
    }
  };

  const handleScanResult = async (result) => {
    if (result) {
      const scannedCode = result.text;
      setQrData(scannedCode);
    }
  };

  const { data: Travel_route, error } = useFrappeGetCall(
    "fleet_management.custom_function.update_attendance",
    {
      document_name: parentNameData?.name, // Ensure this is set
      employee_email: qrData,
    }
  );
  // if(Travel_route.message )
  // console.log("Travel_route", Travel_route);

  const toastShownRef = useRef(false);
  const [responseProcessed, setResponseProcessed] = useState(false);

  useEffect(() => {
    // console.log("Travel_route", Travel_route);
    if (!responseProcessed && (Travel_route || error)) {
      if (error) {
        console.error("Error updating attendance:", error.message);
        if (!toastShownRef.current) {
          toast.error("Failed to update attendance. Please try again.");
          toastShownRef.current = true;
          // setQrData(null);
        }
      } else if (
        Travel_route &&
        Travel_route?.message &&
        Travel_route?.message?.message
      ) {
        if (Travel_route.message.message === "Attendance updated to Present") {
          console.log(
            "Attendance updated successfully:",
            Travel_route.message.child_doc_name
          );
          // setQrData(null);
          if (!toastShownRef.current) {
            toast.success("Successfully scanned and Enjoy your Ride!");
            toastShownRef.current = true;
          }
          setQrData(null);
        } else {
          console.log("Unexpected message:", Travel_route.message.message);
          if (!toastShownRef.current) {
            toast.info(Travel_route.message.message);
            toastShownRef.current = true;
          }
        }
      }
      setResponseProcessed(true);
    }
  }, [Travel_route, error, setQrData, responseProcessed]);

  // Reset the toast flag when qrData changes
  useEffect(() => {
    toastShownRef.current = false;
    setResponseProcessed(false);
  }, [qrData]);

  const vehicle = userEmailId.slice(0, userEmailId.indexOf("@"));
  // console.log("userEmailId", userEmailId, vehicle);

  const { data: FM_Vehicle_Task }: any = useFrappeGetDocList(
    "FM_Vehicle_Task",
    {
      fields: ["*"],
      filters: [
        ["vehicle_no", "LIKE", vehicle],
        ["task_ride_status", "=", "Pending"], // Fetch Pending and Completed tasks
      ],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc", // Sorting by the latest modified task
      },
    }
  );

  const [taskData, setTaskData] = useState<any[]>([]);

  useEffect(() => {
    if (FM_Vehicle_Task && FM_Vehicle_Task.length > 0) {
      const filteredTasks = FM_Vehicle_Task.filter(
        (task: any) =>
          task.approved_date_time && task.approved_date_time.trim() !== ""
      );

      filteredTasks.sort((a: any, b: any) => {
        const dateA = new Date(a.approved_date_time).getTime();
        const dateB = new Date(b.approved_date_time).getTime();
        return dateA - dateB;
      });
      const nextTask = filteredTasks.find(
        (task: any) => task.task_ride_status === "Pending"
      );

      if (nextTask) {
        setTaskData([nextTask]);
      } else {
        const completedTask = filteredTasks.find(
          (task: any) => task.task_ride_status === "Completed"
        );

        if (completedTask) {
          setTaskData([completedTask]);
        } else {
          setTaskData([]);
        }
      }
    }
  }, [FM_Vehicle_Task]);

  const employeeName = taskData?.map((x: any) => x.employee_name);
  const Pickuppoint = taskData?.map((x: any) => x.from_location);
  const Droppoint = taskData?.map((x: any) => x.to_location);
  const Pointime = taskData?.map((x: any) => x.approved_date_time);

  const Vehicletask = async () => {
    let doctypename = "FM_Vehicle_Task";
    let id = taskData?.map((x: any) => x.name).join("");
    let updateData = {
      task_ride_status: "Completed",
    };

    try {
      await updateDoc(doctypename, id, updateData);
      setTaskData((prevAllData) => {
        return prevAllData.map((item) => {
          if (item.doctypename === doctypename && item.name === id) {
            return { ...item, ...updateData };
          }
          return item;
        });
      });

      toast.success("Approved Successfully");
    } catch (error) {
      toast.error(`Error Approved doc: ${error.message}`);
    }
  };

  const updateRideTime = async (updateType: "start" | "end") => {
    const doctypename = taskData?.map((x: any) => x.doctypename).join("");
    const id = taskData?.map((x: any) => x.name).join("");

    const currentDateTime = new Date();
    const day = String(currentDateTime.getDate()).padStart(2, "0");
    const month = String(currentDateTime.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = currentDateTime.getFullYear();
    const hours = String(currentDateTime.getHours()).padStart(2, "0");
    const minutes = String(currentDateTime.getMinutes()).padStart(2, "0");
    const formattedDate = `${day}-${month}-${year}`;
    const formattedTime = `${hours}:${minutes}`;
    const currentDateTimeString = `${formattedDate} ${formattedTime}`;

    const updateData =
      updateType === "start"
        ? { ride_start_time: currentDateTimeString }
        : { ride_end_time: currentDateTimeString };

    try {
      await updateDoc(doctypename, id, updateData);

      toast.success(
        `${updateType === "start" ? "Ride started" : "Ride ended"} successfully`
      );
      if (updateType === "end") {
        Vehicletask();
        setDriverShow(true);
        setPassengerShow(false);
        window.location.reload();
      }
    } catch (error) {
      toast.error(`Error updating ride time: ${error.message}`);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "10px",
        }}
      >
        {/* {JSON.stringify(totalTime)} */}
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
                    fontSize: "22px",
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    if (taskData.length > 0) {
                      setDriverShow(false);
                      setDailyShow(false);
                      setPassengerShow(true);
                      toast.success("Welcome to Agnikul,Start your ride");
                    } else {
                      toast.info("No ride assigned. Contact Fleet Manager.");
                    }
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
                    fontSize: "22px",
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setDriverShow(false);
                    setDailyShow(true);
                    setPassengerShow(false);
                    setScannerShowPage(true);
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
                    fontSize: "18px",
                    flex: 1,
                    maxWidth: { xs: "100%", md: "60%" },
                  }}
                >
                  <img
                    src={pic4}
                    alt="Passenger Ride"
                    style={{ width: "80%", height: "auto" }}
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
                      fontSize: "16px",
                    }}
                  >
                    <p>
                      {language === "English"
                        ? "Passenger Name :"
                        : "பயணியின் பெயர் :"}{" "}
                      <b> {employeeName}</b>
                    </p>
                    <p>
                      {language === "English"
                        ? " Pickup Point :"
                        : "ஏறும் இடம் :"}{" "}
                      <b>{Pickuppoint}</b>
                    </p>
                    <p>
                      {language === "English"
                        ? "Drop Point : "
                        : "இறங்கும் இடம் :"}{" "}
                      <b>{Droppoint}</b>
                    </p>
                    <p>
                      {language === "English"
                        ? "Pickup Point Time : "
                        : "ஏறும் நேரம் :"}{" "}
                      <b>{Pointime}</b>
                    </p>

                    {startTime && (
                      <p>
                        {language === "English"
                          ? "Ride start Time : "
                          : "பயணம் தொடங்கும் நேரம் :"}{" "}
                        <b>{startTime}</b>
                      </p>
                    )}
                  </Box>
                  <br />
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
                    <Button
                      // sx={{ fontSize: "20px ! important" }}
                      className="deleteBtn"
                      onClick={handleStop}
                    >
                      Stop Ride
                    </Button>
                  ) : (
                    <Button
                      // sx={{ fontSize: "20px ! important" }}
                      className="saveBtn"
                      onClick={handleStart}
                    >
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
                    fontSize: "22px",
                    maxWidth: { xs: "100%", md: "60%" },
                    cursor: "pointer",
                  }}
                >
                  {scannerShowPage ? (
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
                                  setSelectedPickUp(null);
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
                                Select Start Point {""}
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
                                    Select Start Point {""}
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
                        </ThemeProvider>
                      </LocalizationProvider>
                      <Button
                        // sx={{ fontSize: "20px ! important" }}
                        className="saveBtn"
                        disabled={!selectedPickup || !selectedRouteId}
                        onClick={async () => {
                          // const parentName = await createParentDocument();
                          handleStartScanner();
                        }}
                      >
                        Start Ride
                      </Button>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>Route Id : {selectedRouteId}</span>
                        <span>Start Point : {selectedPickup}</span>
                      </Box>

                      <QrReader
                        onResult={handleScanResult}
                        onError={handleError}
                        style={{ width: "100%", height: "auto" }}
                      />
                      <Box mt={2}>
                        <p>Scanned QR Data: {qrData}</p>
                      </Box>
                      <Button
                        // sx={{ fontSize: "20px ! important" }}
                        className="deleteBtn"
                        onClick={handleStopScanner}
                      >
                        Stop Ride
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </div>
          </>
        )}
        <br /> <br /> <br />
      </div>
    </>
  );
};

export default DriverLanding;
