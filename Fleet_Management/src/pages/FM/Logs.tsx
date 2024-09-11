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
  Alert,
  InputLabel,
  FormHelperText,
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
import { Document, Page } from "react-pdf";
import jsPDF from "jspdf";
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
  const [billCopyDialogOpen, setBillCopyDialogOpen] = useState(false);
  // State for FIR copy dialog
  const [warrantyCopyDialogOpen, setWarrantyCopyDialogOpen] = useState(false);
  const [firDialogOpen, setFirDialogOpen] = useState(false);
  const [maintenanceBillCopy, setMaintenanceBillCopy] = useState<File | null>(
    null
  );
  const [maintenanceBillCopyPreviewUrl, setMaintenanceBillCopyPreviewUrl] =
    useState<string | null>(null);
  const [isMaintenanceBillCopyModalOpen, setIsMaintenanceBillCopyModalOpen] =
    useState(false);
  const [warrantyCopy, setWarrantyCopy] = useState<File | null>(null);
  const [warrantyCopyPreviewUrl, setWarrantyCopyPreviewUrl] = useState<
    string | null
  >(null);
  const [isWarrantyCopyModalOpen, setIsWarrantyCopyModalOpen] = useState(false);
  const [maintenanceDate, setMaintenanceDate] = useState(null);
  const [maintenanceDateError, setMaintenanceDateError] = useState(false);
  const [maintenanceDateHelperText, setMaintenanceDateHelperText] =
    useState("");
  const [totalCost, setTotalCost] = useState("");
  const [totalCostError, setTotalCostError] = useState("");
  const [warrantyInfo, setWarrantyInfo] = useState("");
  const [warrantyInfoError, setWarrantyInfoError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [partsReplaced, setPartsReplaced] = useState("");
  const [partsReplacedError, setPartsReplacedError] = useState("");
  const [billDialogOpen, setBillDialogOpen] = useState(false);
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
  const [edit, setEdit] = useState(true);
  const [editFuel, setEditFuel] = useState(true);
  const [editAccdient, setEditAccdient] = useState(true);
  const [editMaintenance, setEditMaintenance] = useState(true);
  const [fuelDate, setFuelDate] = useState(null);
  const [fuelDateError, setFuelDateError] = useState<boolean>(false);
  const [fuelDateHelperText, setFuelDateHelperText] = useState<string>("");
  const [fuelAmount, setFuelAmount] = useState<string>("");
  const [fuelAmountError, setFuelAmountError] = useState<string>("");
  // State for Current Odometer Reading
  const [currentOdometer, setCurrentOdometer] = useState<string>("");
  const [currentOdometerError, setCurrentOdometerError] = useState<string>("");
  const [fuelLiters, setFuelLiters] = useState<string>("");
  const [fuelLitersError, setFuelLitersError] = useState<string>("");
  const [supplierName, setSupplierName] = useState<string>("");
  const [supplierNameError, setSupplierNameError] = useState<string>("");
  const [pricePerLiter, setPricePerLiter] = useState<string>("");
  const [pricePerLiterError, setPricePerLiterError] = useState<string>("");
  const [fuelBillFile, setFuelBillFile] = useState<File | null>(null);
  const [fuelBillPreviewUrl, setFuelBillPreviewUrl] = useState<string | null>(
    null
  );
  const [isFuelBillModalOpen, setIsFuelBillModalOpen] =
    useState<boolean>(false);
  const [accidentDate, setAccidentDate] = useState(null);
  const [accidentDateError, setAccidentDateError] = useState(false);
  const [accidentDateHelperText, setAccidentDateHelperText] = useState("");
  const [policeStationNumber, setPoliceStationNumber] = useState("");
  const [policeStationNumberError, setPoliceStationNumberError] = useState("");
  const [accidentReason, setAccidentReason] = useState("");
  const [accidentReasonError, setAccidentReasonError] = useState("");
  const [damageDescription, setDamageDescription] = useState("");
  const [damageDescriptionError, setDamageDescriptionError] = useState("");
  const [accidentDescription, setAccidentDescription] = useState("");
  const [accidentDescriptionError, setAccidentDescriptionError] = useState("");
  const [firCopyImage, setFirCopyImage] = useState<File | null>(null);
  const [firCopyPreviewUrl, setFirCopyPreviewUrl] = useState<string | null>(
    null
  );
  const [isFirCopyModalOpen, setIsFirCopyModalOpen] = useState(false);
  const [firCopyError, setFirCopyError] = useState<string>("");
  const [accidentImage, setAccidentImage] = useState<File | null>(null);
  const [accidentImagePreviewUrl, setAccidentImagePreviewUrl] = useState<
    string | null
  >(null);
  const [isAccidentModalOpen, setIsAccidentModalOpen] = useState(false);
  const [accidentError, setAccidentError] = useState<string>("");
  const [serviceDate, setServiceDate] = useState(null);
  const [serviceDateError, setServiceDateError] = useState("");
  const [serviceDateHelperText, setServiceDateHelperText] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [serviceTypeError, setServiceTypeError] = useState("");
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
        width: "5%",
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
      key: "police_station_noname",
      label: "Police Station No./Name",
      _style: {
        width: "17%",
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
        width: "7%",
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
    // setFineBillFile(null);
    // setIncidentDate(null);
    setLocation(" ");
    setAccidentReason(" ");
    setAccidentDate(null);
    setAccidentDescription(" ");
    setFineAmount(" ");
    setReason(" ");
    setDriverName(" ");
    setDamageDescription(" ");
    setSelectedEmployee(null);
    setLicensePlateNumber("");
    setFirCopyImage(null);
    setAccidentImage(null);
    setPoliceStationNumber(" ");
    setSubHeadingLog(true);
    setTable(true);
    setFineLog(false);
  };
  // over all useEffect
  useEffect(() => {
    if (drawerDetails) {
      //   setIncidentDate(drawerDetails.incident_date || null);
      setLocation(drawerDetails.location || " ");
      setFineAmount(drawerDetails.fine_amount || " ");
      setReason(drawerDetails.reason || " ");
      setFineBillFile(drawerDetails.fine_bill_copy || null);
      setSelectedEmployee(drawerDetails.driver_employee_id || null);
      setDriverName(drawerDetails.driver_name || " ");
      setLicensePlateNumber(drawerDetails.vehicle_number || " ");
      setFuelAmount(drawerDetails.fuel_amount || "");
      setCurrentOdometer(drawerDetails.current_odometer_reading || " ");
      setFuelAmount(drawerDetails.bill_amount || "");
      setFuelLiters(drawerDetails.fuel_in_litres || " ");
      setSupplierName(drawerDetails.supplier_name || "");
      setPricePerLiter(drawerDetails.price_per_litre || " ");
      setAccidentReason(drawerDetails.accident_reason || " ");
      setAccidentDescription(drawerDetails.accident_description || "");
      setDamageDescription(drawerDetails.damage_description || " ");
      setPoliceStationNumber(drawerDetails.police_station_noname || "");
      setAccidentReason(drawerDetails.reason || " ");
      setServiceType(drawerDetails.service_type || "");
      setDescription(drawerDetails.description || "");
      setPartsReplaced(drawerDetails.parts_replaced || "");
      setTotalCost(drawerDetails.total_cost || "");
      setWarrantyInfo(drawerDetails.warranty_information || "");
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
  const {
    updateDoc,
    loading: updatingLoading,
    error: updatingError,
  } = useFrappeUpdateDoc();
  const uploadFile = async (file, options) => {
    try {
      if (file && file instanceof File) {
        const response = await upload(file, options);
        return response.file_url;
      } else {
        throw new Error("Invalid file type or file not provided.");
      }
    } catch (error) {
      //   console.error("File upload error:", error);
      //   toast.error("Failed to upload file.");
      return null;
    }
  };
  const formatDate = (date) => {
    if (!date) return null; // Ensure date is not null or undefined
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  };
  const CreateFineLogDetails = async () => {
    try {
      // File uploads
      const fineImageUrl = await uploadFile(fineBillFile, {
        isPrivate: true,
        doctype: "FM_Fine_Log",
        fieldname: "fine_bill_copy",
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
  const CreateFuelLogDetails = async () => {
    try {
      // File uploads
      const fuelImageUrl = await uploadFile(fuelBillFile, {
        isPrivate: true,
        doctype: "FM_Fuel_Log",
        fieldname: "bill_copy",
      });

      // Base request body
      const requestBody = {
        bill_copy: fuelImageUrl,
        date: formatDate(fuelDate),
        vehicle_number: licensePlateNumber,
        current_odometer_reading: currentOdometer,
        bill_amount: fuelAmount,
        fuel_in_litres: fuelLiters,
        supplier_name: supplierName,
        price_per_litre: pricePerLiter,
      };

      // Create the document
      await createDoc("FM_Fuel_Log", requestBody);
      handleCancel();
      setFuelLog(false);

      reset;
      // Reset form if contractor process is completed

      toast.success("Request Created Successfully");
    } catch (error) {
      handleRequestError(error);
      console.log("error", error);
    }
  };
  const CreateAccidentLogDetails = async () => {
    try {
      // File uploads
      const firImageUrl = await uploadFile(firCopyImage, {
        isPrivate: true,
        doctype: "FM_Accident_Log",
        fieldname: "fir_copy",
      });
      const accidentImageUrl = await uploadFile(accidentImage, {
        isPrivate: true,
        doctype: "FM_Accident_Log",
        fieldname: "images",
      });

      // Base request body
      const requestBody = {
        reason: accidentReason,
        accident_date: formatDate(accidentDate),
        vehicle_number: licensePlateNumber,
        accident_description: accidentDescription,
        damage_description: damageDescription,
        images: accidentImageUrl,
        fir_copy: firImageUrl,
        police_station_noname: policeStationNumber,
        driver_employee_id: selectedEmployee,
        driver_name: driverName,
      };

      // Create the document
      await createDoc("FM_Accident_Log", requestBody);
      handleCancel();
      setAccidentLog(false);

      reset;
      // Reset form if contractor process is completed

      toast.success("Request Created Successfully");
    } catch (error) {
      handleRequestError(error);
      console.log("error", error);
    }
  };
  const CreateMaintenanceLogDetails = async () => {
    try {
      // File uploads
      const warrantyImageUrl = await uploadFile(warrantyCopy, {
        isPrivate: true,
        doctype: "FM_Maintenance_Log",
        fieldname: "warranty_copy",
      });
      const maintenanceBillImageUrl = await uploadFile(maintenanceBillCopy, {
        isPrivate: true,
        doctype: "FM_Maintenance_Log",
        fieldname: "bill_copy",
      });

      // Base request body
      const requestBody = {
        service_type: serviceType,
        date_of_service: formatDate(serviceDate),
        vehicle_number: licensePlateNumber,
        description: description,
        parts_replaced: partsReplaced,
        total_cost: totalCost,
        bill_copy: maintenanceBillImageUrl,
        warranty_information: warrantyInfo,
        warranty_copy: warrantyImageUrl,
        next_scheduled_maintenance_date: formatDate(maintenanceDate),
      };

      // Create the document
      await createDoc("FM_Maintenance_Log", requestBody);
      handleCancel();
      setMaintenanceLog(false);
      //   setTable(true);
      //   setSubHeadingLog(true);

      reset;
      // Reset form if contractor process is completed

      toast.success("Request Created Successfully");
    } catch (error) {
      handleRequestError(error);
      console.log("error", error);
    }
  };
  const handleUpdate = async (status) => {
    try {
      // File uploads
      const fineImageUrl = await uploadFile(fineBillFile, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "vehicle_image",
      });
      const fuelImageUrl = await uploadFile(fuelBillFile, {
        isPrivate: true,
        doctype: "FM_Fuel_Log",
        fieldname: "bill_copy",
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
      // Update the document
      await updateDoc("FM_Fine_Log", drawerDetails.name, requestBody);
      toast.success("Updated successfully");
      setFineLog(false);
      setSubHeadingLog(true);
      setTable(true);
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Error:", error);
    }
  };
  const handleUpdateFuel = async (status) => {
    try {
      // File uploads

      const fuelImageUrl = await uploadFile(fuelBillFile, {
        isPrivate: true,
        doctype: "FM_Fuel_Log",
        fieldname: "bill_copy",
      });

      // Base request body
      const requestBody = {
        bill_copy: fuelImageUrl,
        date: formatDate(fuelDate),
        vehicle_number: licensePlateNumber,
        current_odometer_reading: currentOdometer,
        bill_amount: fuelAmount,
        fuel_in_litres: fuelLiters,
        supplier_name: supplierName,
        price_per_litre: pricePerLiter,
      };
      // Update the document
      await updateDoc("FM_Fuel_Log", drawerDetails.name, requestBody);
      toast.success("Updated successfully");
      setFuelLog(false);
      setSubHeadingLog(true);
      setTable(true);
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Error:", error);
    }
  };
  const handleUpdateAccident = async (status) => {
    try {
      // File uploads

      const firImageUrl = await uploadFile(firCopyImage, {
        isPrivate: true,
        doctype: "FM_Accident_Log",
        fieldname: "fir_copy",
      });
      const accidentImageUrl = await uploadFile(accidentImage, {
        isPrivate: true,
        doctype: "FM_Accident_Log",
        fieldname: "images",
      });

      // Base request body
      const requestBody = {
        reason: accidentReason,
        accident_date: formatDate(accidentDate),
        vehicle_number: licensePlateNumber,
        accident_description: accidentDescription,
        damage_description: damageDescription,
        images: accidentImageUrl,
        fir_copy: firImageUrl,
        police_station_noname: policeStationNumber,
        driver_employee_id: selectedEmployee,
        driver_name: driverName,
      };
      // Update the document
      await updateDoc("FM_Accident_Log", drawerDetails.name, requestBody);
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Error:", error);
    }
  };
  const handleUpdateMaintenance = async (status) => {
    try {
      // File uploads
      const warrantyImageUrl = await uploadFile(warrantyCopy, {
        isPrivate: true,
        doctype: "FM_Maintenance_Log",
        fieldname: "warranty_copy",
      });
      const maintenanceBillImageUrl = await uploadFile(maintenanceBillCopy, {
        isPrivate: true,
        doctype: "FM_Maintenance_Log",
        fieldname: "bill_copy",
      });

      // Base request body
      const requestBody = {
        service_type: serviceType,
        date_of_service: formatDate(serviceDate),
        vehicle_number: licensePlateNumber,
        description: description,
        parts_replaced: partsReplaced,
        total_cost: totalCost,
        bill_copy: maintenanceBillImageUrl,
        warranty_information: warrantyInfo,
        warranty_copy: warrantyImageUrl,
        next_scheduled_maintenance_date: formatDate(maintenanceDate),
      };
      // Update the document
      await updateDoc("FM_Maintenance_Log", drawerDetails.name, requestBody);
      toast.success("Updated successfully");
      setMaintenanceLog(false);
      setSubHeadingLog(true);
      setTable(true);
    } catch (error) {
      toast.error("Failed to update data.");
      console.error("Error:", error);
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
      filters: [
        ["department", "Like", "Transportation - ACPL"],
        ["designation", "=", "Driver"],
        ["status", "=", "Active"],
      ],

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
  // Handlers for Maintenance Bill Copy
  const handleBillCopyDialogOpen = () => {
    setBillCopyDialogOpen(true);
  };

  const handleBillCopyDialogClose = () => {
    setBillCopyDialogOpen(false);
  };
  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Vehicle Number";
    }
  }, []);
  const handleDownloadBillCopyMaintenance = () => {
    if (drawerDetails.bill_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.bill_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("maintenance_bill_copy.pdf");
      };
    } else {
      alert("No maintenance bill copy available for download.");
    }
  };
  const handleWarrantyCopyDialogOpen = () => {
    setWarrantyCopyDialogOpen(true);
  };

  const handleWarrantyCopyDialogClose = () => {
    setWarrantyCopyDialogOpen(false);
  };

  const handleDownloadWarrantyCopy = () => {
    if (drawerDetails.warranty_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.warranty_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("warranty_copy.pdf");
      };
    } else {
      alert("No warranty copy available for download.");
    }
  };
  const handleFirDialogOpen = () => {
    setFirDialogOpen(true);
  };
  const handleFirDialogClose = () => {
    setFirDialogOpen(false);
  };

  const handleDownloadFirCopy = () => {
    if (drawerDetails.fir_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.fir_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("fir_copy.pdf");
      };
    } else {
      alert("No FIR copy available for download.");
    }
  };
  const [accidentImagesDialogOpen, setAccidentImagesDialogOpen] =
    useState(false);

  // Handlers for Accident Images
  const handleAccidentImagesDialogOpen = () => {
    setAccidentImagesDialogOpen(true);
  };

  const handleAccidentImagesDialogClose = () => {
    setAccidentImagesDialogOpen(false);
  };

  const handleDownloadAccidentImages = () => {
    if (drawerDetails.images) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.images.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("accident_images.pdf");
      };
    } else {
      alert("No accident images available for download.");
    }
  };
  const handleFileChangeMaintenanceBillCopy = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setMaintenanceBillCopy(file);
      const previewUrl = URL.createObjectURL(file);
      setMaintenanceBillCopyPreviewUrl(previewUrl);
    }
  };
  const openMaintenanceBillCopyPreview = () => {
    if (maintenanceBillCopyPreviewUrl) {
      setIsMaintenanceBillCopyModalOpen(true);
    }
  };

  // Close the modal
  const closeMaintenanceBillCopyPreview = () =>
    setIsMaintenanceBillCopyModalOpen(false);
  const handleFileChangeWarrantyCopy = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setWarrantyCopy(file);
      const previewUrl = URL.createObjectURL(file);
      setWarrantyCopyPreviewUrl(previewUrl);
    }
  };

  // Open the modal
  const openWarrantyCopyPreview = () => {
    if (warrantyCopyPreviewUrl) {
      setIsWarrantyCopyModalOpen(true);
    }
  };

  // Close the modal
  const closeWarrantyCopyPreview = () => setIsWarrantyCopyModalOpen(false);
  const handleMaintenanceDateChange = (date) => {
    // Validate the selected date if needed
    // For example, ensure the date is in the future
    if (date && date.isBefore(new Date())) {
      setMaintenanceDateError(true);
      setMaintenanceDateHelperText("The date must be in the future.");
    } else {
      setMaintenanceDateError(false);
      setMaintenanceDateHelperText("");
    }
    setMaintenanceDate(date);
  };
  const handleTotalCostChange = (event) => {
    const value = event.target.value;
    setTotalCost(value);

    // Example validation logic for Total Cost
    if (value && isNaN(Number(value))) {
      setTotalCostError("Total Cost must be a number.");
    } else {
      setTotalCostError("");
    }
  };

  const handleWarrantyInfoChange = (event) => {
    const value = event.target.value;
    setWarrantyInfo(value);

    // Example validation logic for Warranty Information
    if (value.length > 500) {
      // Example validation rule: max 500 characters
      setWarrantyInfoError(
        "Warranty Information cannot exceed 500 characters."
      );
    } else {
      setWarrantyInfoError("");
    }
  };
  const handlePartsReplacedChange = (event) => {
    const value = event.target.value;
    setPartsReplaced(value);

    // Example validation logic (adjust as needed)
    if (value.length > 500) {
      // Example validation rule: max 500 characters
      setPartsReplacedError("Parts Replaced cannot exceed 500 characters.");
    } else {
      setPartsReplacedError("");
    }
  };
  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    setDescription(value);

    // Example validation logic (adjust as needed)
    if (value.length > 500) {
      // Example validation rule: max 500 characters
      setDescriptionError("Description cannot exceed 500 characters.");
    } else {
      setDescriptionError("");
    }
  };
  const handleServiceTypeChange = (event) => {
    setServiceType(event.target.value);
    // Optionally validate the service type if needed
    // validateServiceType(event.target.value);
  };
  const handleServiceDateChange = (date) => {
    setServiceDate(date);
    // Optionally validate the date if needed
    // validateServiceDate(date);
  };
  const handleAccidentImageFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png"];
      const validFileTypes = ["application/pdf", ...validImageTypes];
      if (!validFileTypes.includes(fileType)) {
        setAccidentError("Please upload a valid file (pdf, jpg, jpeg, png).");
        setAccidentImage(null);
        setAccidentImagePreviewUrl(null);
      } else {
        setAccidentError("");
        setAccidentImage(file);
        const previewUrl = URL.createObjectURL(file);
        setAccidentImagePreviewUrl(previewUrl);
        setIsAccidentModalOpen(true); // Open the preview modal
      }
    } else {
      setAccidentError("No file selected.");
      setAccidentImage(null);
      setAccidentImagePreviewUrl(null);
    }
  };

  const closeAccidentImagePreview = () => setIsAccidentModalOpen(false);
  const handleFirCopyFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validFileTypes.includes(fileType)) {
        setFirCopyError(
          "Please upload a valid file (pdf, jpg, jpeg, png, doc)."
        );
        setFirCopyImage(null);
        setFirCopyPreviewUrl(null);
      } else {
        setFirCopyError("");
        setFirCopyImage(file);
        const previewUrl = URL.createObjectURL(file);
        setFirCopyPreviewUrl(previewUrl);
        setIsFirCopyModalOpen(true); // Open the preview modal
      }
    } else {
      setFirCopyError("No file selected.");
      setFirCopyImage(null);
      setFirCopyPreviewUrl(null);
    }
  };
  const closeFirCopyImagePreview = () => setIsFirCopyModalOpen(false);

  const handleAccidentDescriptionChange = (e) => {
    const value = e.target.value;
    setAccidentDescription(value);
    validateAccidentDescription(value);
  };

  const validateAccidentDescription = (value) => {
    // Example validation: Check for minimum length if needed
    if (value.length > 0 && value.length < 10) {
      // Example validation logic
      setAccidentDescriptionError(
        "Accident description should be at least 10 characters long."
      );
    } else {
      setAccidentDescriptionError("");
    }
  };

  const handleDamageDescriptionChange = (e) => {
    const value = e.target.value;
    setDamageDescription(value);
    validateDamageDescription(value);
  };
  const handleAccidentReasonChange = (e) => {
    const value = e.target.value;
    setAccidentReason(value);
    validateAccidentReason(value);
  };

  const validateAccidentReason = (value) => {
    // Example validation logic
    if (value.length > 0 && value.length < 5) {
      // Example: Minimum length of 5
      setAccidentReasonError(
        "Accident reason should be at least 5 characters long."
      );
    } else {
      setAccidentReasonError("");
    }
  };

  const validateDamageDescription = (value) => {
    // Example validation: Check if length is less than 10
    if (value.length > 0 && value.length < 10) {
      setDamageDescriptionError(
        "Damage description should be at least 10 characters long."
      );
    } else {
      setDamageDescriptionError("");
    }
  };
  const validatePoliceStationNumber = (value) => {
    // Allow only numeric characters
    if (value.length > 0 && !/^\d+$/.test(value)) {
      setPoliceStationNumberError(
        "Please enter a valid police station number (numbers only)."
      );
    } else {
      setPoliceStationNumberError("");
    }
    setPoliceStationNumber(value);
  };

  const handleBillDialogOpen = () => {
    setBillDialogOpen(true);
  };
  const handleAccidentDateChange = (date) => {
    setAccidentDate(date);
    validateDates(date); // You may want to adjust this validation function for Accident Date if needed
  };

  const handleBillDialogClose = () => {
    setBillDialogOpen(false);
  };
  const handleDownloadBillCopy = () => {
    if (drawerDetails.bill_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.bill_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("Fuel_Bill_Copy.pdf");
      };
    } else {
      alert("No fuel bill copy available for download.");
    }
  };
  const handleFileChangeFuelBill = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFuelBillFile(file);
      // Set a preview URL for image files only
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setFuelBillPreviewUrl(URL.createObjectURL(file));
      } else {
        setFuelBillPreviewUrl(null); // No preview for non-image files
      }
    }
  };
  const openFuelBillPreview = () => {
    setIsFuelBillModalOpen(true);
  };

  const closeFuelBillPreview = () => {
    setIsFuelBillModalOpen(false);
  };
  const handlePricePerLiterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setPricePerLiter(newValue);
      setPricePerLiterError(""); // Clear error if the input is valid
    } else {
      setPricePerLiterError(
        "Enter a valid number with up to two decimal places."
      );
    }
  };

  const handleSupplierNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only alphabetic characters and spaces
    if (/^[a-zA-Z\s]*$/.test(newValue)) {
      setSupplierName(newValue);
      setSupplierNameError(""); // Clear error if input is valid
    } else {
      setSupplierNameError("Enter a valid name using only letters and spaces.");
    }
  };

  const handleFuelLitersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setFuelLiters(newValue);
      setFuelLitersError(""); // Clear error if the input is valid
    } else {
      setFuelLitersError("Enter a valid number with up to two decimal places.");
    }
  };

  const handleCurrentOdometerChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    // Allow only non-negative numeric input
    if (/^\d*$/.test(newValue)) {
      setCurrentOdometer(newValue);
      setCurrentOdometerError(""); // Clear error if the input is valid
    } else {
      setCurrentOdometerError("Enter a valid non-negative number.");
    }
  };

  const handleFuelAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setFuelAmount(newValue);
      setFuelAmountError(""); // Clear error if the input is valid
    } else {
      setFuelAmountError("Enter a valid number with up to two decimal places.");
    }
  };
  const handleFuelDateChange = (newValue: Dayjs | null) => {
    // Set the selected fuel date
    setFuelDate(newValue);

    // Reset error states and helper text since the field is non-mandatory
    setFuelDateError(false);
    setFuelDateHelperText("");
  };

  const [fineBillDialogOpen, setFineBillDialogOpen] = useState(false);
  const [fuelBillDialogOpen, setFuelBillDialogOpen] = useState(false);
  const handleFineDialogOpen = () => {
    setFineBillDialogOpen(true);
  };
  const handleFuelDialogOpen = () => {
    setFuelBillDialogOpen(true);
  };
  const handleFineDialogClose = () => {
    setFineBillDialogOpen(false);
  };
  const handleFuelDialogClose = () => {
    setFuelBillDialogOpen(false);
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
      alert("No fine bill copy available for download.");
    }
  };
  const handleDownloadFuelCopy = () => {
    if (drawerDetails.bill_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.bill_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("bill_copy.pdf");
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
    const file = event.target.files?.[0];
    if (file) {
      setFineBillFile(file);
      // Set a preview URL for image files only
      const fileType = file.type;
      if (fileType.startsWith("image/")) {
        setFineBillPreviewUrl(URL.createObjectURL(file));
      } else {
        setFineBillPreviewUrl(null); // No preview for non-image files
      }
    }
  };

  const openFineBillPreview = () => {
    setIsFineBillModalOpen(true);
  };
  const closeFineBillPreview = () => {
    setIsFineBillModalOpen(false);
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

  //   console.log("finelog", fineLog);
  return (
    <>
      <ThemeProvider theme={ThemeColor}>
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
                    color:
                      activeLog === "maintenanceLog" ? "#375d33" : "#A1A1A1",
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
                  date: (item: any) => {
                    const date = new Date(item.creation);
                    const formattedDate = `${date
                      .getDate()
                      .toString()
                      .padStart(2, "0")}-${(date.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${date.getFullYear()}`;
                    return <td>{formattedDate}</td>;
                  },
                  accident_date: (item: any) => {
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
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
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
                                    alt="Fine Bill Copy Image"
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

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography
                            //   className="saveBtn"
                            onClick={() => {
                              setTable(false);
                              handleCloseDrawer();
                              setFineLog(true);
                              setEdit(false);
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#71a375",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 600,
                              padding: "9px 29px",
                              margin: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            Edit
                          </Typography>
                        </Box>
                      </>
                    )}
                    {activeLog === "fuelLog" && (
                      <>
                        <Grid container spacing={2} sx={{ marginTop: 2 }}>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.date || "N/A"}{" "}
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
                              Vehicle No
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
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Bill Amount
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.bill_amount || "N/A"}{" "}
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
                              Current Odometer Reading
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.current_odometer_reading || "N/A"}{" "}
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
                              Fuel in Litres
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.fuel_in_litres || "N/A"}{" "}
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
                              Supplier Name
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.supplier_name || "N/A"}{" "}
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
                              Price per Litre
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.price_per_litre || "N/A"}{" "}
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
                              Fuel Bill Copy
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
                                {drawerDetails.bill_copy || "N/A"}
                              </Typography>
                              {drawerDetails.bill_copy && (
                                <>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleBillDialogOpen}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownloadBillCopy}
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </>
                              )}
                            </Box>

                            {/* Preview Dialog */}
                            <Dialog
                              open={billDialogOpen}
                              onClose={handleBillDialogClose}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogContent>
                                <IconButton
                                  edge="end"
                                  color="inherit"
                                  onClick={handleBillDialogClose}
                                  aria-label="close"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                {drawerDetails.bill_copy ? (
                                  <Box
                                    component="img"
                                    src={drawerDetails.bill_copy.replace(
                                      "/private",
                                      ""
                                    )}
                                    alt="Fuel Bill Copy Image"
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

                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography
                            onClick={() => {
                              setTable(false);
                              handleCloseDrawer();
                              setFuelLog(true);
                              setEditFuel(false);
                              setSubHeadingLog(false);
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#71a375",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 600,
                              padding: "9px 29px",
                              margin: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            Edit
                          </Typography>
                        </Box>
                      </>
                    )}
                    {activeLog === "accidentLog" && (
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
                            Accident Details:
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
                              Accident Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.accident_date || "N/A"}{" "}
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
                              Police Station No./Name
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.police_station_noname || "N/A"}{" "}
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
                              Accident Description
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.accident_description || "N/A"}{" "}
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
                              Damage Description
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.damage_description || "N/A"}{" "}
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
                                width: { xs: "100%", sm: "100%", md: "90%" },
                                padding: 1,
                                color: "#848484",
                                height: "auto",
                                textAlign: "left",
                                // marginBottom: 2,
                              }}
                            >
                              Vehicle No
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
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              FIR Copy
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
                                {drawerDetails.fir_copy || "N/A"}
                              </Typography>
                              {drawerDetails.fir_copy && (
                                <>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleFirDialogOpen}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownloadFirCopy}
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </>
                              )}
                            </Box>

                            {/* FIR Copy Preview Dialog */}
                            <Dialog
                              open={firDialogOpen}
                              onClose={handleFirDialogClose}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogContent>
                                <IconButton
                                  edge="end"
                                  color="inherit"
                                  onClick={handleFirDialogClose}
                                  aria-label="close"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                {drawerDetails.fir_copy ? (
                                  <Box
                                    component="img"
                                    src={drawerDetails.fir_copy.replace(
                                      "/private",
                                      ""
                                    )}
                                    alt="FIR Copy Image"
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
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Accident Images
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
                                {drawerDetails.images || "N/A"}
                              </Typography>
                              {drawerDetails.images && (
                                <>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleAccidentImagesDialogOpen}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownloadAccidentImages}
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </>
                              )}
                            </Box>

                            {/* Accident Images Preview Dialog */}
                            <Dialog
                              open={accidentImagesDialogOpen}
                              onClose={handleAccidentImagesDialogClose}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogContent>
                                <IconButton
                                  edge="end"
                                  color="inherit"
                                  onClick={handleAccidentImagesDialogClose}
                                  aria-label="close"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                {drawerDetails.images ? (
                                  <Box
                                    component="img"
                                    src={drawerDetails.images.replace(
                                      "/private",
                                      ""
                                    )}
                                    alt="Accident Images"
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
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Typography
                            //   className="saveBtn"
                            onClick={() => {
                              setTable(false);
                              handleCloseDrawer();
                              setAccidentLog(true);
                              setEdit(false);
                              setSubHeadingLog(false);
                            }}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: "#71a375",
                              color: "#ffffff",
                              fontSize: "14px",
                              fontWeight: 600,
                              padding: "9px 29px",
                              margin: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            Edit
                          </Typography>
                        </Box>
                      </>
                    )}
                    {activeLog === "maintenanceLog" && (
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
                            Maintenance Details:
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
                              Date of Service
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.date_of_service || "N/A"}{" "}
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
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Service Type
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.service_type || "N/A"}{" "}
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
                              Description
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.description || "N/A"}{" "}
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
                              Parts Replaced
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.parts_replaced || "N/A"}{" "}
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
                              Total Cost
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.total_cost || "N/A"}{" "}
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
                              Warranty Information
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.warranty_information || "N/A"}{" "}
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
                              Next Scheduled Maintenance Date
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerDetails.next_scheduled_maintenance_date ||
                                "N/A"}{" "}
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
                              Warranty Copy
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
                                {drawerDetails.warranty_copy || "N/A"}
                              </Typography>
                              {drawerDetails.warranty_copy && (
                                <>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleWarrantyCopyDialogOpen}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownloadWarrantyCopy}
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </>
                              )}
                            </Box>

                            {/* Warranty Copy Preview Dialog */}
                            <Dialog
                              open={warrantyCopyDialogOpen}
                              onClose={handleWarrantyCopyDialogClose}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogContent>
                                <IconButton
                                  edge="end"
                                  color="inherit"
                                  onClick={handleWarrantyCopyDialogClose}
                                  aria-label="close"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                {drawerDetails.warranty_copy ? (
                                  <Box
                                    component="img"
                                    src={drawerDetails.warranty_copy.replace(
                                      "/private",
                                      ""
                                    )}
                                    alt="Warranty Copy Image"
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
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Maintenance Bill Copy
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
                                {drawerDetails.bill_copy || "N/A"}
                              </Typography>
                              {drawerDetails.bill_copy && (
                                <>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleBillCopyDialogOpen}
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                  <IconButton
                                    sx={{ marginLeft: 1 }}
                                    onClick={handleDownloadBillCopyMaintenance}
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                </>
                              )}
                            </Box>

                            {/* Maintenance Bill Copy Preview Dialog */}
                            <Dialog
                              open={billCopyDialogOpen}
                              onClose={handleBillCopyDialogClose}
                              maxWidth="md"
                              fullWidth
                            >
                              <DialogContent>
                                <IconButton
                                  edge="end"
                                  color="inherit"
                                  onClick={handleBillCopyDialogClose}
                                  aria-label="close"
                                  sx={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                                {drawerDetails.bill_copy ? (
                                  <Box
                                    component="img"
                                    src={drawerDetails.bill_copy.replace(
                                      "/private",
                                      ""
                                    )}
                                    alt="Maintenance Bill Copy Image"
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
                      setSubHeadingLog(true);
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
                  rows={2}
                />
                {/* Modal for Fine Bill Preview */}
                <Modal
                  open={isFineBillModalOpen}
                  onClose={closeFineBillPreview}
                  aria-labelledby="fine-bill-modal-title"
                  aria-describedby="fine-bill-modal-description"
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
                    <Typography
                      id="fine-bill-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Fine Bill Copy Preview
                    </Typography>
                    {fineBillPreviewUrl ? (
                      <img
                        src={fineBillPreviewUrl}
                        alt="Fine Bill Copy Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 2 }}
                      >
                        No preview available for this file type.
                      </Typography>
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
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
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
                  />
                  <input
                    type="file"
                    id="fileInputFineBill"
                    name="fineBill"
                    accept=".png,.jpg,.jpeg,.pdf,.doc"
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
                    <TextField
                      {...params}
                      label="Driver ID"
                      variant="outlined"
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  options={
                    employeeDetails.map((emp) => emp.employee_name) || []
                  }
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
              {edit && (
                <>
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

              {!edit && (
                <>
                  {updatingLoading ? ( // Show loading spinner while updating
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Button
                        className="saveBtn"
                        onClick={handleUpdate}
                        disabled={updatingLoading}
                      >
                        Update
                      </Button>
                    </Box>
                  )}

                  {updatingError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Alert severity="error">
                        {updatingError.message || "Failed to update data."}
                      </Alert>
                    </Box>
                  )}
                </>
              )}
            </>
          )}

          {fuelLog && (
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
                      setFuelLog(false);
                      setTable(true);
                      setSubHeadingLog(true);
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  Add Fuel Details:
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
                    label={<span>Fuel Date</span>}
                    value={fuelDate}
                    onChange={handleFuelDateChange}
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
                        error={fuelDateError}
                        helperText={fuelDateHelperText}
                      />
                    )}
                    format="DD/MM/YYYY"
                  />
                  {fuelDateError && (
                    <span
                      style={{
                        color: "red",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                      }}
                    >
                      {fuelDateHelperText}
                    </span>
                  )}
                </LocalizationProvider>
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
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label="Fuel Amount"
                  value={fuelAmount}
                  onChange={handleFuelAmountChange}
                  error={!!fuelAmountError}
                  helperText={fuelAmountError}
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
                  label="Current Odometer Reading"
                  value={currentOdometer}
                  onChange={handleCurrentOdometerChange}
                  error={!!currentOdometerError}
                  helperText={currentOdometerError}
                  type="number"
                  inputProps={{ min: "0", step: "1" }} // Ensure only non-negative integers
                />
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label="Fuel Liters"
                  value={fuelLiters}
                  onChange={handleFuelLitersChange}
                  error={!!fuelLitersError}
                  helperText={fuelLitersError}
                  type="number"
                  inputProps={{ step: "0.01" }} // Ensure only numbers with up to two decimal places
                />
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label="Supplier Name"
                  value={supplierName}
                  onChange={handleSupplierNameChange}
                  error={!!supplierNameError}
                  helperText={supplierNameError}
                />
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label="Price per Liters"
                  value={pricePerLiter}
                  onChange={handlePricePerLiterChange}
                  error={!!pricePerLiterError}
                  helperText={pricePerLiterError}
                  type="number"
                  inputProps={{ step: "0.01" }} // Ensure only numbers with up to two decimal places
                />
                <Modal
                  open={isFuelBillModalOpen}
                  onClose={closeFuelBillPreview}
                  aria-labelledby="fuel-bill-modal-title"
                  aria-describedby="fuel-bill-modal-description"
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
                      onClick={closeFuelBillPreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      id="fuel-bill-modal-title"
                      variant="h6"
                      component="h2"
                    >
                      Fuel Bill Copy Preview
                    </Typography>
                    {fuelBillPreviewUrl ? (
                      <img
                        src={fuelBillPreviewUrl}
                        alt="Fuel Bill Copy Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 2 }}
                      >
                        No preview available for this file type.
                      </Typography>
                    )}
                  </Box>
                </Modal>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{ margin: "0 auto" }}
                    label="Fuel Bill Copy"
                    value={fuelBillFile ? fuelBillFile.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      const fileInput = document.getElementById(
                        "fileInputFuelBill"
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!fuelBillFile && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileInput = document.getElementById(
                                  "fileInputFuelBill"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.click();
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {fuelBillFile && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                openFuelBillPreview();
                              }}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    id="fileInputFuelBill"
                    name="fuelBill"
                    accept=".png,.jpg,.jpeg,.pdf,.doc"
                    style={{ display: "none" }}
                    onChange={handleFileChangeFuelBill}
                  />
                </Box>
              </Box>
              {editFuel && (
                <>
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
                        fuelDateError ||
                        fuelAmountError ||
                        currentOdometerError ||
                        fuelLitersError ||
                        supplierNameError ||
                        pricePerLiterError ||
                        licensePlateError
                      }
                      onClick={CreateFuelLogDetails}
                    >
                      {fineLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </>
              )}
              {!editFuel && (
                <>
                  {updatingLoading ? ( // Show loading spinner while updating
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Button
                        className="saveBtn"
                        onClick={handleUpdateFuel}
                        disabled={updatingLoading}
                      >
                        Update
                      </Button>
                    </Box>
                  )}

                  {updatingError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Alert severity="error">
                        {updatingError.message || "Failed to update data."}
                      </Alert>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
          {accidentLog && (
            <>
              {" "}
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
                      setAccidentLog(false);
                      setTable(true);
                      setSubHeadingLog(true);
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  Add Accident Details:
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
                        Accident Date <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={accidentDate}
                    onChange={handleAccidentDateChange}
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
                        error={accidentDateError}
                        helperText={accidentDateHelperText}
                      />
                    )}
                    format="DD/MM/YYYY"
                  />
                  {accidentDateError && (
                    <span
                      style={{
                        color: "red",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                      }}
                    >
                      {accidentDateHelperText}
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
                  label={<span>Police Station Number</span>}
                  value={policeStationNumber}
                  onChange={(e) => validatePoliceStationNumber(e.target.value)}
                  error={!!policeStationNumberError}
                  helperText={policeStationNumberError}
                />
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{
                      margin: "0 auto",
                      width: { xs: "100%", sm: "100%", md: "100%" },
                    }}
                    label={<Typography>Fir Copy</Typography>}
                    value={firCopyImage ? firCopyImage.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("fileInputFirCopy")?.click();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!firCopyImage && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputFirCopy")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {firCopyImage && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsFirCopyModalOpen(true);
                              }}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    id="fileInputFirCopy"
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleFirCopyFileChange}
                  />
                  {firCopyError && (
                    <span className="ErrorMsg">{firCopyError}</span>
                  )}

                  <Modal
                    open={isFirCopyModalOpen}
                    onClose={closeFirCopyImagePreview}
                    aria-labelledby="fir-copy-modal-title"
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
                        onClick={closeFirCopyImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="fir-copy-modal-title" variant="h6">
                        Fir Copy Preview
                      </Typography>
                      <img
                        src={firCopyPreviewUrl || ""}
                        alt="Fir Copy Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    </Box>
                  </Modal>
                </Box>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{
                      margin: "0 auto",
                      width: { xs: "100%", sm: "100%", md: "100%" },
                    }}
                    label={
                      <Typography>
                        Accident Image <span style={{ color: "red" }}>*</span>
                      </Typography>
                    }
                    value={accidentImage ? accidentImage.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById("fileInputAccidentImage")
                        ?.click();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!accidentImage && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputAccidentImage")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {accidentImage && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAccidentModalOpen(true);
                              }}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    id="fileInputAccidentImage"
                    accept=".jpg,.jpeg,.png,.pdf"
                    style={{ display: "none" }}
                    onChange={handleAccidentImageFileChange}
                  />
                  {accidentError && (
                    <span className="ErrorMsg">{accidentError}</span>
                  )}

                  <Modal
                    open={isAccidentModalOpen}
                    onClose={closeAccidentImagePreview}
                    aria-labelledby="accident-image-modal-title"
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
                        onClick={closeAccidentImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="accident-image-modal-title" variant="h6">
                        Accident Image Preview
                      </Typography>
                      {accidentImage &&
                      accidentImage.type === "application/pdf" ? (
                        <Document file={accidentImagePreviewUrl}>
                          <Page pageNumber={1} />
                        </Document>
                      ) : (
                        <img
                          src={accidentImagePreviewUrl || ""}
                          alt="Accident Image Preview"
                          style={{ width: "100%", marginTop: 16 }}
                        />
                      )}
                    </Box>
                  </Modal>
                </Box>
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label={
                    <span>
                      Accident Reason <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={accidentReason}
                  onChange={handleAccidentReasonChange}
                  error={!!accidentReasonError}
                  helperText={accidentReasonError}
                  multiline
                  rows={2}
                />{" "}
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label={
                    <span>
                      Damage Description <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={damageDescription}
                  onChange={handleDamageDescriptionChange}
                  error={!!damageDescriptionError}
                  helperText={damageDescriptionError}
                  multiline
                  rows={2}
                />
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                    marginBottom: 2,
                  }}
                  label="Accident Description"
                  value={accidentDescription}
                  onChange={handleAccidentDescriptionChange}
                  error={!!accidentDescriptionError}
                  helperText={accidentDescriptionError}
                  multiline
                  rows={2}
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
                    <TextField
                      {...params}
                      label="Driver ID"
                      variant="outlined"
                    />
                  )}
                />
                <Autocomplete
                  freeSolo
                  options={
                    employeeDetails.map((emp) => emp.employee_name) || []
                  }
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
                  label={
                    <span>
                      Vehicle Number <span style={{ color: "red" }}>*</span>
                    </span>
                  }
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
              {editAccdient && (
                <>
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
                        !accidentDate ||
                        !accidentReason ||
                        policeStationNumberError ||
                        firCopyError ||
                        accidentReasonError ||
                        !damageDescription ||
                        damageDescriptionError ||
                        licensePlateNumber ||
                        accidentDescriptionError ||
                        licensePlateError ||
                        !accidentImage
                      }
                      onClick={CreateAccidentLogDetails}
                    >
                      {fineLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </>
              )}
              {!editAccdient && (
                <>
                  {updatingLoading ? ( // Show loading spinner while updating
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Button
                        className="saveBtn"
                        onClick={handleUpdateAccident}
                        disabled={updatingLoading}
                      >
                        Update
                      </Button>
                    </Box>
                  )}

                  {updatingError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Alert severity="error">
                        {updatingError.message || "Failed to update data."}
                      </Alert>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
          {/* {accidentLog && <>accident log</>} */}
          {maintenanceLog && (
            <>
              {" "}
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
                      setMaintenanceLog(false);
                      setTable(true);
                      setSubHeadingLog(true);
                    }}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  Add Maintenances Details:
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
                        Date of Service <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={serviceDate}
                    onChange={handleServiceDateChange}
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
                        error={!!serviceDateError}
                        helperText={serviceDateHelperText}
                      />
                    )}
                    format="DD/MM/YYYY"
                  />
                  {serviceDateError && (
                    <span
                      style={{
                        color: "red",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                      }}
                    >
                      {serviceDateHelperText}
                    </span>
                  )}
                </LocalizationProvider>
                <TextField
                  select
                  label={
                    <span>
                      Service Type <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    "& .MuiSelect-icon": {
                      color: "#66BB6A",
                    },
                    "& .MuiInputLabel-root": {
                      color: "#000",
                    },
                  }}
                  SelectProps={{ native: true }}
                  InputLabelProps={{ shrink: true }}
                >
                  <option value="">Service Type</option>
                  <option value="Routine">Routine</option>
                  <option value="Repair">Repair</option>
                  <option value="Inspection">Inspection</option>
                </TextField>

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

                <TextField
                  label="Description"
                  value={description}
                  onChange={handleDescriptionChange}
                  error={!!descriptionError}
                  helperText={descriptionError}
                  multiline
                  rows={2}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                />

                <TextField
                  label="Parts Replaced (Maintenances)"
                  value={partsReplaced}
                  onChange={handlePartsReplacedChange}
                  error={!!partsReplacedError}
                  helperText={partsReplacedError}
                  multiline
                  rows={2}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                />

                {/* Total Cost Field */}
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                  label={
                    <span>
                      Total Cost <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  value={totalCost}
                  onChange={handleTotalCostChange}
                  error={!!totalCostError}
                  helperText={totalCostError}
                />

                {/* Warranty Information Field */}
                <TextField
                  label="Warranty Information"
                  value={warrantyInfo}
                  onChange={handleWarrantyInfoChange}
                  error={!!warrantyInfoError}
                  helperText={warrantyInfoError}
                  multiline
                  rows={2}
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label={
                      <Typography variant="body1">
                        Next Scheduled Maintenance Date
                      </Typography>
                    }
                    value={maintenanceDate}
                    onChange={handleMaintenanceDateChange}
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
                        error={maintenanceDateError}
                        helperText={maintenanceDateHelperText}
                      />
                    )}
                    format="DD/MM/YYYY"
                  />
                </LocalizationProvider>
                {maintenanceDateError && (
                  <Typography
                    variant="caption"
                    color="error"
                    // sx={{ display: "flex",justifyContent: "center" }}
                  >
                    {maintenanceDateHelperText}
                  </Typography>
                )}
                <Modal
                  open={isWarrantyCopyModalOpen}
                  onClose={closeWarrantyCopyPreview}
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
                      onClick={closeWarrantyCopyPreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2">
                      Warranty Copy Preview
                    </Typography>
                    {warrantyCopyPreviewUrl && (
                      <div style={{ marginTop: 16 }}>
                        {warrantyCopyPreviewUrl.endsWith(".pdf") ? (
                          <embed
                            src={warrantyCopyPreviewUrl}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                          />
                        ) : (
                          <img
                            src={warrantyCopyPreviewUrl}
                            alt="Warranty Copy Preview"
                            style={{ width: "100%", marginTop: 16 }}
                          />
                        )}
                      </div>
                    )}
                  </Box>
                </Modal>

                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{ margin: "0 auto", width: "100%" }}
                    label="Warranty Copy"
                    value={warrantyCopy ? warrantyCopy.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      const fileInput = document.getElementById(
                        "fileInputWarrantyCopy"
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!warrantyCopy && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileInput = document.getElementById(
                                  "fileInputWarrantyCopy"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.click();
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {warrantyCopy && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                openWarrantyCopyPreview();
                              }}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    id="fileInputWarrantyCopy"
                    name="warranty_copy"
                    accept=".pdf, .png, .jpg, .jpeg, .doc"
                    style={{ display: "none" }}
                    onChange={handleFileChangeWarrantyCopy}
                  />
                </Box>
                <Modal
                  open={isMaintenanceBillCopyModalOpen}
                  onClose={closeMaintenanceBillCopyPreview}
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
                      onClick={closeMaintenanceBillCopyPreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2">
                      Maintenance Bill Copy Preview
                    </Typography>
                    {maintenanceBillCopyPreviewUrl && (
                      <div style={{ marginTop: 16 }}>
                        {maintenanceBillCopyPreviewUrl.endsWith(".pdf") ? (
                          <embed
                            src={maintenanceBillCopyPreviewUrl}
                            type="application/pdf"
                            width="100%"
                            height="600px"
                          />
                        ) : (
                          <img
                            src={maintenanceBillCopyPreviewUrl}
                            alt="Maintenance Bill Copy Preview"
                            style={{ width: "100%" }}
                          />
                        )}
                      </div>
                    )}
                  </Box>
                </Modal>

                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{ margin: "0 auto", width: "100%" }}
                    label="Maintenance Bill Copy"
                    value={maintenanceBillCopy ? maintenanceBillCopy.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      const fileInput = document.getElementById(
                        "fileInputMaintenanceBillCopy"
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.click();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!maintenanceBillCopy && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                const fileInput = document.getElementById(
                                  "fileInputMaintenanceBillCopy"
                                ) as HTMLInputElement;
                                if (fileInput) {
                                  fileInput.click();
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {maintenanceBillCopy && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                openMaintenanceBillCopyPreview();
                              }}
                              style={{ cursor: "pointer", marginLeft: "8px" }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <input
                    type="file"
                    id="fileInputMaintenanceBillCopy"
                    name="maintenance_bill_copy"
                    accept=".pdf, .png, .jpg, .jpeg, .doc"
                    style={{ display: "none" }}
                    onChange={handleFileChangeMaintenanceBillCopy}
                  />
                </Box>
              </Box>
              {editMaintenance && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      padding: "20px",
                    }}
                  >
                    <Button
                      className="saveBtn"
                      disabled={!serviceDate || !totalCost || !serviceType}
                      onClick={CreateMaintenanceLogDetails}
                    >
                      {fineLoading ? "Submitting..." : "Submit"}
                    </Button>
                  </Box>
                </>
              )}
              {!editMaintenance && (
                <>
                  {updatingLoading ? ( // Show loading spinner while updating
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Button
                        className="saveBtn"
                        onClick={handleUpdate}
                        disabled={updatingLoading}
                      >
                        Update
                      </Button>
                    </Box>
                  )}

                  {updatingError && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        padding: "20px",
                      }}
                    >
                      <Alert severity="error">
                        {updatingError.message || "Failed to update data."}
                      </Alert>
                    </Box>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </ThemeProvider>
    </>
  );
};

export default Logs;
