import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
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
  MenuItem,
  TextField,
  FormControlLabel,
  Select,
  Radio,
  RadioGroup,
  Modal,
  Dialog,
  DialogContent,
} from "@mui/material";

import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeCreateDoc,
  useFrappeFileUpload,
} from "frappe-react-sdk";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ThemeProvider, createTheme } from "@mui/material";
import { HiPlusSm, HiMinusSm } from "react-icons/hi";
import { red } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";

interface LogsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Logs: React.FC<LogsProps> = ({
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
  //state
  const [table, setTable] = useState(true);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [view, setView] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeLog, setActiveLog] = useState("fineLog");
  const [fineLog, setFineLog] = useState(false);
  const [fuelLog, setFuelLog] = useState(false);
  const [accidentLog, setAccidentLog] = useState(false);
  const [maintenanceLog, setMaintenanceLog] = useState(false);
  const [subHeadingLog, setSubHeadingLog] = useState(true);
  const [incidentDate, setIncidentDate] = useState(null);
  const [incidentDateError, setIncidentDateError] = useState(false);
  const [incidentDateHelperText, setIncidentDateHelperText] = useState("");
  const [location, setLocation] = useState<string>("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [fineAmount, setFineAmount] = useState("");
  const [fineAmountError, setFineAmountError] = useState("");
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [isFineBillModalOpen, setIsFineBillModalOpen] =
    useState<boolean>(false);
  const [fineBillPreviewUrl, setFineBillPreviewUrl] = useState<string | null>(
    null
  );
  const [fineBillFile, setFineBillFile] = useState<File | null>(null);
  const [driverName, setDriverName] = useState("");
  const [driverError, setDriverError] = useState(false);
  const [driverHelperText, setDriverHelperText] = useState("");
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [licensePlateError, setLicensePlateError] = useState(false);
  const [licensePlateHelperText, setLicensePlateHelperText] = useState("");

  const fineLogColumns = [
    // Columns for fineLog
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
    {
      key: "driver_name",
      label: "Driver Name",
      _style: {
        width: "10%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "vehicle_number",
      label: "Vehicle Number",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "location",
      label: "Location",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "incident_date",
      label: "Incident Date",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "action",
      label: "View Details",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];
  const fuelLogColumns = [
    // Columns for fuelLog
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
    {
      key: "date",
      label: "Date",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "vehicle_no",
      label: "Vehicle Number",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "fuel_in_litres",
      label: "Fuel Litres",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "price_per_litre",
      label: "Litres Price",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "action",
      label: "View Details",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];
  const accidentLogColumns = [
    // Columns for fuelLog
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
    {
      key: "accident_date",
      label: "Accident Date",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "driver_name",
      label: "Driver Name",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "vehicle_no",
      label: "Vehicle Number",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "police_station_noname",
      label: "Police Station No./Name",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "action",
      label: "View Details",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];
  const maintenanceLogColumns = [
    // Columns for fuelLog
    {
      key: "S_no",
      label: "S.No",
      _style: {
        width: "7%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopLeftRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
    {
      key: "date_of_service",
      label: "Date of Services",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "vehicle_number",
      label: "Vehicle Number",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "service_type",
      label: "Service Type",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "total_cost",
      label: "Total Cost",
      _style: {
        width: "15%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "action",
      label: "View Details",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
        borderTopRightRadius: "5px",
      },
      filter: false,
      sorter: false,
    },
  ];
  const [tableData, setTableData] = useState<any[]>([]);
  const [columns, setColumns] = useState(fineLogColumns);
  const [doctypeName, setDoctypeName] = useState("FM_Fine_Log");
  const { data: LogData, isLoading: LogsDataLoading } = useFrappeGetDocList(
    doctypeName,
    {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: 10000,
    }
  );

  // Set table data when the fetched data changes
  useEffect(() => {
    if (LogData) {
      setTableData(LogData);
    }
  }, [LogData, doctypeName]);
  // handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };
  const handleLogClick = (logType) => {
    setActiveLog(logType);
    if (logType === "fineLog") {
      setDoctypeName("FM_Fine_Log");
      setColumns(fineLogColumns);
    } else if (logType === "fuelLog") {
      setDoctypeName("FM_Fuel_Log");
      setColumns(fuelLogColumns);
    } else if (logType === "accidentLog") {
      setDoctypeName("FM_Accident_Log");
      setColumns(accidentLogColumns);
      //   setTableData(fuelLogData);
    } else if (logType === "maintenanceLog") {
      setDoctypeName("FM_Maintenance_Log");
      setColumns(maintenanceLogColumns);
    }
    // Add more conditions if you have other log types
  };
  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };
  const handleCancel = () => {
    setFineBillFile(null);
    setIncidentDate(null);
    setLocation(" ");
    setFineAmount(" ");
    setReason(" ");
    setDriverName(" ");
    setSelectedEmployee(null);
    setLicensePlateNumber("");
    setTable(true);
    setFineLog(false);
  };
  // over all useEffect
  useEffect(() => {
    if (drawerDetails) {
      setIncidentDate(drawerDetails.incident_date || null);
      setLocation(drawerDetails.location || " ");
      setFineAmount(drawerDetails.fine_amount || " ");
      setReason(drawerDetails.reason || " ");
      setFineBillFile(drawerDetails.fine_bill_copy || null);
      setSelectedEmployee(drawerDetails.driver_employee_id || null);
      setDriverName(drawerDetails.driver_name || " ");
      setLicensePlateNumber(drawerDetails.vehicle_number || " ");
    }
  }, [drawerDetails]);
  // api
  const { upload } = useFrappeFileUpload();

  const {
    createDoc,
    loading: fineLoading,
    isCompleted,
    error,
    reset,
  } = useFrappeCreateDoc();
  const uploadFile = async (file, options) => {
    if (file) {
      const response = await upload(file, options);
      return response.file_url;
    }
    return null;
  };
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  };
  const CreateFineLogDetails = async () => {
    try {
      // File uploads
      const fineImageUrl = await uploadFile(fineBillFile, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "vehicle_image",
      });

      // Base request body
      const requestBody = {
        fine_bill_copy: fineImageUrl,
        incident_date: formatDate(incidentDate),
        location: location,
        fine_amount: fineAmount,
        reason: reason,
        driver_employee_id: selectedEmployee,
        driver_name: driverName,
        vehicle_number: licensePlateNumber,
      };

      // Create the document
      await createDoc("FM_Fine_Log", requestBody);
      handleCancel();

      reset;
      // Reset form if contractor process is completed

      toast.success("Request Created Successfully");
    } catch (error) {
      handleRequestError(error);
      console.log("error", error);
    }
  };
  // Helper function to handle errors
  const handleRequestError = (error) => {
    if (error.response) {
      const statusCode = error.response.status;
      const serverMessage = error.response.data?._server_messages;

      switch (statusCode) {
        case 400:
          toast.error("Bad request. Please check your input.");
          break;
        case 401:
          toast.error("Unauthorized. Please log in.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          break;
        default:
          if (serverMessage) {
            const parsedMessages = JSON.parse(serverMessage);
            const errorMessage = parsedMessages
              .map((msg) => JSON.parse(msg).message)
              .join(", ");
            toast.error(errorMessage);
          } else {
            toast.error(`Error: ${statusCode}`);
          }
      }
    } else if (error.request) {
      toast.error("No response received from server. Please try again later.");
    } else {
      toast.error(`${error.exception}`);
    }
  };
  const { data: Employee, isLoading: employeeDetailsLoading } =
    useFrappeGetDocList("Employee", {
      fields: ["*"],
      // filters: [["owner", "=", userEmailId]],

      orderBy: {
        field: "modified",
        order: "desc",
      },
    });
  const [employeeDetails, setEmployeeDetails] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Set table data when the fetched data changes
  useEffect(() => {
    if (Employee) {
      setEmployeeDetails(Employee);
    }
  }, [Employee]);
  //handle change
  const [fineBillDialogOpen, setFineBillDialogOpen] = useState(false);

  const handleFineDialogOpen = () => {
    setFineBillDialogOpen(true);
  };

  const handleFineDialogClose = () => {
    setFineBillDialogOpen(false);
  };
  const handleDownloadFineCopy = () => {
    if (drawerDetails.fine_bill_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.fine_bill_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("fine_bill_copy.pdf");
      };
    } else {
      alert("No license copy available for download.");
    }
  };
  const validateLicensePlateNumber = (value: string) => {
    // Remove spaces from the input value
    const trimmedValue = value.replace(/\s+/g, "");

    // Regular expression for Indian license plate numbers without spaces
    const validPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/i;

    if (trimmedValue === "") {
      // If the field is empty, do not show an error message
      setLicensePlateError(false);
      setLicensePlateHelperText("");
    } else if (!validPattern.test(trimmedValue)) {
      // If the field is not empty but does not match the pattern
      setLicensePlateError(true);
      setLicensePlateHelperText(
        "Invalid license plate number. Format should be XXYYZZZZ (e.g., MH12AB1234)."
      );
    } else {
      // If the field is valid
      setLicensePlateError(false);
      setLicensePlateHelperText("");
    }
  };
  const handleEmployeeChange = (event, newValue) => {
    if (newValue) {
      setSelectedEmployee(newValue.name); // Set employee ID
      setDriverName(newValue.employee_name); // Set driver name
    } else {
      setSelectedEmployee(null);
      setDriverName("");
    }
  };

  // Handle selection from driver name autocomplete
  const handleDriverNameChange = (event, newValue) => {
    const matchedEmployee = employeeDetails.find(
      (emp) => emp.employee_name === newValue
    );
    if (matchedEmployee) {
      setDriverName(newValue);
      setSelectedEmployee(matchedEmployee.name); // Set employee ID
    } else {
      setDriverName(newValue);
      setSelectedEmployee(null);
    }
  };

  const handleFileChangeFineBill = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setFineBillFile(file);
      setFineBillPreviewUrl(URL.createObjectURL(file));
    }
  };

  const closeFineBillPreview = () => {
    setIsFineBillModalOpen(false);
  };

  const openFineBillPreview = () => {
    setIsFineBillModalOpen(true);
  };
  const handleReasonChange = (e) => {
    const newValue = e.target.value;
    // Allow text input with a maximum length
    if (newValue.length <= 1000) {
      setReason(newValue);
      setReasonError(""); // Clear error if the input is valid
    } else {
      setReasonError("Reason should be less than 1000 characters.");
    }
  };
  const handleFineAmountChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setFineAmount(newValue);
      setFineAmountError(""); // Clear error if the input is valid
    } else {
      setFineAmountError("Enter a valid number with up to two decimal places.");
    }
  };
  const validateLocation = (loc: string) => {
    if (!loc) {
      setLocationError("Location is required.");
    } else if (!/^[a-zA-Z\s]+$/.test(loc)) {
      setLocationError("Location should contain only letters and spaces.");
    } else {
      setLocationError(null);
    }
    setLocation(loc);
  };

  const handleIncidentDateChange = (date) => {
    setIncidentDate(date);
    validateDates(date);
  };

  const validateDates = (date) => {
    // Check if the date is null or undefined
    if (!date) {
      setIncidentDateError(true);
      setIncidentDateHelperText("Incident Date is required");
    } else {
      setIncidentDateError(false);
      setIncidentDateHelperText("");
    }
  };

  const { updateDoc } = useFrappeUpdateDoc();
  //   console.log("finelog", fineLog);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFF",
          backgroundColor: "#4D8C52",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "18px",
          fontWeight: 600,
          marginBottom: "10px",
        }}
      >
        Logs Details
      </Box>
      {subHeadingLog && (
        <>
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                gap: "5px",
                margin: "10px",
              }}
            >
              <Typography
                onClick={() => handleLogClick("fineLog")}
                sx={{
                  backgroundColor:
                    activeLog === "fineLog" ? "#E5F3E6" : "#f5f5f5",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "4px 4px 0 0",
                  width: "20vw",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: activeLog === "fineLog" ? "#375d33" : "#A1A1A1",
                  borderBottom:
                    activeLog === "fineLog"
                      ? "3px solid #487644"
                      : "3px solid transparent",
                }}
              >
                Fine Log
              </Typography>
              <Typography
                onClick={() => handleLogClick("fuelLog")}
                sx={{
                  backgroundColor:
                    activeLog === "fuelLog" ? "#E5F3E6" : "#f5f5f5",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "4px 4px 0 0",
                  width: "20vw",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: activeLog === "fuelLog" ? "#375d33" : "#A1A1A1",
                  borderBottom:
                    activeLog === "fuelLog"
                      ? "3px solid #487644"
                      : "3px solid transparent",
                }}
              >
                Fuel Log
              </Typography>
              <Typography
                onClick={() => handleLogClick("accidentLog")}
                sx={{
                  backgroundColor:
                    activeLog === "accidentLog" ? "#E5F3E6" : "#f5f5f5",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "4px 4px 0 0",
                  width: "20vw",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: activeLog === "accidentLog" ? "#375d33" : "#A1A1A1",
                  borderBottom:
                    activeLog === "accidentLog"
                      ? "3px solid #487644"
                      : "3px solid transparent",
                }}
              >
                Accident Log
              </Typography>
              <Typography
                onClick={() => handleLogClick("maintenanceLog")}
                sx={{
                  backgroundColor:
                    activeLog === "maintenanceLog" ? "#E5F3E6" : "#f5f5f5",
                  cursor: "pointer",
                  padding: "10px",
                  borderRadius: "4px 4px 0 0",
                  width: "20vw",
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: activeLog === "maintenanceLog" ? "#375d33" : "#A1A1A1",
                  borderBottom:
                    activeLog === "maintenanceLog"
                      ? "3px solid #487644"
                      : "3px solid transparent",
                }}
              >
                Maintenance Log
              </Typography>
            </Box>
          </div>
        </>
      )}

      {table && (
        <>
          {/* {JSON.stringify(drawerDetails)} */}
          <div
            style={{
              backgroundColor: darkMode ? "#222222" : "#fff",
              padding: "15px",
            }}
          >
            <Box
              sx={{
                color: "#000",
                backgroundColor: "#a5d0a9",
                padding: "10px 20px",
                borderRadius: "5px",
                float: "right",
                marginBottom: "5px",
                fontSize: "15px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                handleCancel();
                setTable(false);
                setSubHeadingLog(false);
                switch (activeLog) {
                  case "fineLog":
                    setFineLog(true);
                    setFuelLog(false);
                    setAccidentLog(false);
                    setMaintenanceLog(false);
                    break;
                  case "fuelLog":
                    setFuelLog(true);
                    setFineLog(false);
                    setAccidentLog(false);
                    setMaintenanceLog(false);
                    break;
                  case "accidentLog":
                    setAccidentLog(true);
                    setFineLog(false);
                    setFuelLog(false);
                    setMaintenanceLog(false);
                    break;
                  case "maintenanceLog":
                    setMaintenanceLog(true);
                    setFineLog(false);
                    setFuelLog(false);
                    setAccidentLog(false);
                    break;
                  default:
                    setFineLog(false);
                    setFuelLog(false);
                    setAccidentLog(false);
                    setMaintenanceLog(false);
                    break;
                }
              }}
            >
              <AddIcon sx={{ marginRight: "8px" }} />
              {activeLog === "fineLog"
                ? "Add Fine Details"
                : activeLog === "fuelLog"
                ? "Add Fuel Log"
                : activeLog === "accidentLog"
                ? "Add Accident Log"
                : activeLog === "maintenanceLog"
                ? "Add Maintenance Log"
                : ""}
            </Box>

            <CSmartTable
              cleaner
              clickableRows
              columns={columns}
              columnFilter
              columnSorter
              items={tableData}
              itemsPerPageSelect
              itemsPerPage={10}
              pagination
              tableFilter
              tableProps={{
                className: "add-this-class red-border",
                responsive: true,
                striped: true,
                hover: true,
              }}
              onRowClick={(item) => handleRowClick(item)}
              tableBodyProps={{
                className: "align-middle tableData",
              }}
              scopedColumns={{
                S_no: (_item, index) => <td>{index + 1}</td>,
                incident_date: (item: any) => {
                  const date = new Date(item.creation);
                  const formattedDate = `${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.getFullYear()}`;
                  return <td>{formattedDate}</td>;
                },
                action: (item) => (
                  <td className="ActionData">
                    <div className="viewicon">
                      <MdOutlineVisibility
                        size={20}
                        onClick={() => {
                          toggleDrawer(true);
                          setView(true);
                          setDrawerDetails(item);
                        }}
                      />
                    </div>
                  </td>
                ),
              }}
            />
          </div>

          <Drawer
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: darkMode ? "#222222" : "#FFF",
                color: darkMode ? "#fff" : "#000",
                width: "50%",
                "@media (max-width: 1024px)": {
                  width: "85%",
                },
                "@media (max-width: 600px)": {
                  width: "80%",
                },
              },
            }}
            anchor="right"
            open={isOpen}
            onClose={handleCloseDrawer}
          >
            {view && (
              <Box sx={{ padding: "20px" }}>
                <Box>
                  <div className="m-4">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box
                        flexGrow={1}
                        className="drawerTitle"
                        sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      >
                        Request Type - {activeLog}
                      </Box>
                      <Button
                        className="closeX"
                        sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                        onClick={handleCloseDrawer}
                      >
                        X
                      </Button>
                    </Box>
                  </div>
                  {activeLog === "fineLog" && (
                    <>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            backgroundColor: "#B3CCB3",
                            padding: 1,
                            flexGrow: 1,
                            colour: "#454545",
                            borderRadius: 1,
                            // margin: 2,
                          }}
                        >
                          Driver Details:
                        </Typography>
                      </Box>

                      <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        {/* {JSON.stringify(drawerDetails)} */}
                        {/* Add your Grid content here */}
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Driver Name
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.driver_name || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Employee Id
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.driver_employee_id || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            backgroundColor: "#B3CCB3",
                            padding: 1,
                            flexGrow: 1,
                            colour: "#454545",
                            borderRadius: 1,
                            // margin: 2,
                          }}
                        >
                          Fine Details:
                        </Typography>
                      </Box>
                      <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            incident date
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.incident_date || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                              padding: 1,
                              color: "#848484",
                              height: "auto",
                              textAlign: "left",
                              // marginBottom: 2,
                            }}
                          >
                            Location
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.location || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                              padding: 1,
                              color: "#848484",
                              height: "auto",
                              textAlign: "left",
                              // marginBottom: 2,
                            }}
                          >
                            Fine Amount
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.fine_amount || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              width: { xs: "100%", sm: "100%", md: "90%" },
                              padding: 1,
                              color: "#848484",
                              height: "auto",
                              textAlign: "left",
                              // marginBottom: 2,
                            }}
                          >
                            Reason
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.reason || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Fine Bill Copy
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.fine_bill_copy || "N/A"}
                            </Typography>
                            {drawerDetails.fine_bill_copy && (
                              <>
                                <IconButton
                                  sx={{ marginLeft: 1 }}
                                  onClick={handleFineDialogOpen}
                                >
                                  <VisibilityIcon />
                                </IconButton>
                                <IconButton
                                  sx={{ marginLeft: 1 }}
                                  onClick={handleDownloadFineCopy}
                                >
                                  <DownloadIcon />
                                </IconButton>
                              </>
                            )}
                          </Box>

                          {/* Preview Dialog */}
                          <Dialog
                            open={fineBillDialogOpen}
                            onClose={handleFineDialogClose}
                            maxWidth="md"
                            fullWidth
                          >
                            <DialogContent>
                              <IconButton
                                edge="end"
                                color="inherit"
                                onClick={handleFineDialogClose}
                                aria-label="close"
                                sx={{ position: "absolute", top: 8, right: 8 }}
                              >
                                <CloseIcon />
                              </IconButton>
                              {drawerDetails.fine_bill_copy ? (
                                <Box
                                  component="img"
                                  src={drawerDetails.fine_bill_copy.replace(
                                    "/private",
                                    ""
                                  )}
                                  alt="License Copy Image"
                                  sx={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    objectFit: "contain",
                                  }}
                                />
                              ) : (
                                <Typography>No image available</Typography>
                              )}
                            </DialogContent>
                          </Dialog>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Typography
                          sx={{
                            backgroundColor: "#B3CCB3",
                            padding: 1,
                            flexGrow: 1,
                            colour: "#454545",
                            borderRadius: 1,
                            // margin: 2,
                          }}
                        >
                          Vehicle Details:
                        </Typography>
                      </Box>
                      <Grid container spacing={2} sx={{ marginTop: 2 }}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#848484",
                            }}
                          >
                            Vehicle Number
                          </Typography>
                          <Typography
                            sx={{
                              padding: 1,
                              color: "#000",
                            }}
                          >
                            {drawerDetails.vehicle_number || "N/A"}{" "}
                            {/* Display the type or "N/A" if not available */}
                          </Typography>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Drawer>
        </>
      )}
      <Box
        sx={{
          backgroundColor: "#fff",
        }}
      >
        {fineLog && (
          <>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  backgroundColor: "#B3CCB3",
                  // padding: 1,
                  flexGrow: 1,
                  colour: "#454545",
                  borderRadius: 1,
                  margin: 2,
                }}
              >
                <IconButton
                  onClick={() => {
                    setFineLog(false);
                    setTable(true);
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Add Fine Details:
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: "10px",
                padding: "20px",
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label={
                    <span>
                      Incident Date <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={incidentDate}
                  onChange={handleIncidentDateChange}
                  sx={{
                    width: "90%",
                    "& .MuiInputBase-root": {
                      height: "auto",
                    },
                    "& .MuiInputLabel-root": {
                      lineHeight: "40px",
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={incidentDateError}
                      helperText={incidentDateHelperText}
                    />
                  )}
                  format="DD/MM/YYYY"
                />
                {incidentDateError && (
                  <span
                    style={{
                      color: "red",
                      position: "absolute",
                      top: "100%",
                      left: 0,
                    }}
                  >
                    {incidentDateHelperText}
                  </span>
                )}
              </LocalizationProvider>
              <TextField
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  height: "auto",
                  textAlign: "left",
                  marginBottom: 2,
                }}
                label={
                  <span>
                    Location <span style={{ color: "red" }}>*</span>
                  </span>
                }
                value={location}
                onChange={(e) => validateLocation(e.target.value)}
                error={!!locationError}
                helperText={locationError}
              />
              <TextField
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  height: "auto",
                  textAlign: "left",
                  marginBottom: 2,
                }}
                label="Fine Amount"
                value={fineAmount}
                onChange={handleFineAmountChange}
                error={!!fineAmountError}
                helperText={fineAmountError}
                type="number"
                inputProps={{ step: "0.01" }}
              />
              <TextField
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  height: "auto",
                  textAlign: "left",
                  marginBottom: 2,
                }}
                label="Reason"
                value={reason}
                onChange={handleReasonChange}
                error={!!reasonError}
                helperText={reasonError}
                multiline
                rows={4}
              />
              {/* Modal for Fine Bill Preview */}
              <Modal
                open={isFineBillModalOpen}
                onClose={closeFineBillPreview}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                  }}
                >
                  <IconButton
                    aria-label="close"
                    onClick={closeFineBillPreview}
                    sx={{ position: "absolute", top: 8, right: 16 }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography id="modal-title" variant="h6" component="h2">
                    Fine Bill Copy Preview
                  </Typography>
                  {fineBillFile?.type.startsWith("image/") ? (
                    <img
                      src={fineBillPreviewUrl || ""}
                      alt="Fine Bill Copy Preview"
                      style={{ width: "100%", marginTop: 16 }}
                    />
                  ) : (
                    <iframe
                      src={fineBillPreviewUrl || ""}
                      style={{ width: "100%", height: "500px", marginTop: 16 }}
                    />
                  )}
                </Box>
              </Modal>

              {/* Fine Bill File Upload Field */}
              <Box
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  margin: "10 auto",
                }}
              >
                <TextField
                  sx={{ margin: "0 auto" }}
                  label="Fine Bill Copy"
                  value={fineBillFile ? fineBillFile.name : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    const fileInput = document.getElementById(
                      "fileInputFineBill"
                    ) as HTMLInputElement;
                    if (fileInput) {
                      fileInput.click();
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {!fineBillFile && (
                          <UploadFileIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              const fileInput = document.getElementById(
                                "fileInputFineBill"
                              ) as HTMLInputElement;
                              if (fileInput) {
                                fileInput.click();
                              }
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        )}
                        {fineBillFile && (
                          <VisibilityIcon
                            onClick={(e) => {
                              e.stopPropagation();
                              openFineBillPreview();
                            }}
                            style={{ cursor: "pointer", marginLeft: "8px" }}
                          />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "100%" },
                    marginBottom: 2,
                  }}
                />
                <input
                  type="file"
                  id="fileInputFineBill"
                  name="fineBill"
                  accept="image/*,.pdf,.doc,.docx"
                  style={{ display: "none" }}
                  onChange={handleFileChangeFineBill}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  backgroundColor: "#B3CCB3",
                  padding: 1,
                  flexGrow: 1,
                  colour: "#454545",
                  borderRadius: 1,
                  margin: 2,
                }}
              >
                Add Driver Details:
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: "10px",
                padding: "20px",
              }}
            >
              <Autocomplete
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  margin: "10 auto",
                }}
                options={employeeDetails || []}
                getOptionLabel={(option) => option.name}
                value={
                  employeeDetails.find(
                    (emp) => emp.name === selectedEmployee
                  ) || null
                }
                onChange={handleEmployeeChange}
                renderInput={(params) => (
                  <TextField {...params} label="Driver ID" variant="outlined" />
                )}
              />
              <Autocomplete
                freeSolo
                options={employeeDetails.map((emp) => emp.employee_name) || []}
                value={driverName}
                onInputChange={(event, newValue) =>
                  handleDriverNameChange(event, newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Driver Name"
                    variant="outlined"
                    error={driverError}
                    helperText={driverHelperText}
                  />
                )}
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  backgroundColor: "#B3CCB3",
                  padding: 1,
                  flexGrow: 1,
                  colour: "#454545",
                  borderRadius: 1,
                  margin: 2,
                }}
              >
                Add Vehicle Details:
              </Typography>
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr",
                },
                gap: "10px",
                padding: "20px",
              }}
            >
              <TextField
                sx={{
                  width: { xs: "100%", sm: "100%", md: "90%" },
                  height: "auto",
                  textAlign: "left",
                }}
                label={<span>Vehicle Number</span>}
                value={licensePlateNumber}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setLicensePlateNumber(newValue);
                  validateLicensePlateNumber(newValue);
                }}
                error={licensePlateError}
                helperText={licensePlateHelperText}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <Button
                className="saveBtn"
                disabled={
                  !location ||
                  !incidentDate ||
                  //   !incidentDateError
                  //    ||
                  locationError ||
                  fineAmountError ||
                  reasonError
                }
                onClick={CreateFineLogDetails}
              >
                {fineLoading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </>
        )}
        {fuelLog && <>fuel log</>}
        {accidentLog && <>accident log</>}
        {accidentLog && <>accident log</>}
        {maintenanceLog && <>maintenance log</>}
      </Box>
    </>
  );
};

export default Logs;
