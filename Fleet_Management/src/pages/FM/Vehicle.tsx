import React, { useState, useEffect, useCallback } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Typography,
  Grid,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  InputAdornment,
  Modal,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Alert,
} from "@mui/material";

import { LuMapPin } from "react-icons/lu";
import { createTheme } from "@mui/material/styles";

import axios from "axios";
import { LuMapPinOff } from "react-icons/lu";

import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";
import { ThemeProvider } from "@mui/material";

import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeCreateDoc,
  useFrappeFileUpload,
} from "frappe-react-sdk";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
interface VehicleProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}
interface Vehicle {
  vehicle_number: string;
  vehicle_id: string;
  model_name: string;
  gps_datetime: string;
  lat_message: string;
  lon_message: string;
  speed: string;
  branch_name: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: Vehicle[];
}

const Vehicle: React.FC<VehicleProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [vehicleDetails, setVehicleDetails] = useState(false);
  const [table, setTable] = useState(true);
  const [ownership, setOwnership] = useState("Own"); // Default to "Own"
  const [vehicleAvailability, setVehicleAvailability] = useState("Online"); // Default to "Online"

  // Separate states for form fields
  const [vehicleYear, setVehicleYear] = useState(null);
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [licensePlateError, setLicensePlateError] = useState(false);
  const [licensePlateHelperText, setLicensePlateHelperText] = useState("");
  const [vehicleImage, setVehicleImage] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileErrorRc, setFileErrorRc] = useState("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [contactNumberError, setContactNumberError] = useState<string | null>(
    null
  );
  const [edit, setEdit] = useState(true);

  const [vehicleImagePreviewUrl, setVehicleImagePreviewUrl] = useState<
    string | null
  >(null);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [rcDetailsModalOpen, setRCDetailsModalOpen] = useState(false);

  // Additional fields for "Own" ownership type
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleError, setVehicleError] = useState(false);
  const [vehicleHelperText, setVehicleHelperText] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleModelError, setVehicleModelError] = useState(false);
  const [vehicleModelHelperText, setVehicleModelHelperText] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [policyHolderName, setPolicyHolderName] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [policyNumberError, setPolicyNumberError] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [vin, setVIN] = useState("");
  const [vinError, setVINError] = useState(false);
  const [vinHelperText, setVINHelperText] = useState("");

  const [rcDate, setRCDate] = useState<Date | null>(null);
  const [rcExpiredDate, setRCExpiredDate] = useState(null);
  const [rcDateError, setRCDateError] = useState(false);
  const [rcDateHelperText, setRCDateHelperText] = useState("");
  const [rcExpiredDateError, setRCExpiredDateError] = useState(false);
  const [rcExpiredDateHelperText, setRCExpiredDateHelperText] = useState("");
  const [rcDetails, setRcDetails] = useState<File | null>(null);
  const [rcImagePreviewUrl, setRCImagePreviewUrl] = useState<string | null>(
    null
  );
  const [insuranceCompanyName, setInsuranceCompanyName] = useState("");
  const [insuranceCompanyNameError, setInsuranceCompanyNameError] =
    useState("");

  const [insuranceCompanyAddress, setInsuranceCompanyAddress] = useState("");
  const [insuranceCompanyAddressError, setInsuranceCompanyAddressError] =
    useState("");

  const [purchaseInvoice, setPurchaseInvoice] = useState(null);
  const [purchaseInvoicePreviewUrl, setPurchaseInvoicePreviewUrl] = useState<
    string | null
  >(null);
  const [fileErrorInvoice, setFileErrorInvoice] = useState<string | null>(null);
  const [isPurchaseInvoiceModalOpen, setIsPurchaseInvoiceModalOpen] =
    useState(false);

  const [isPollutionCertificateModalOpen, setIsPollutionCertificateModalOpen] =
    useState(false);
  const [isBillsOfSalesModalOpen, setIsBillsOfSalesModalOpen] = useState(false);
  const [billsOfSales, setBillsOfSales] = useState<File | null>(null);
  const [pollutionCertificate, setPollutionCertificate] = useState<File | null>(
    null
  );
  const [roadTaxDate, setRoadTaxDate] = useState<Date | null>(null);
  const [permitYearlyOnceDate, setPermitYearlyOnceDate] = useState<Date | null>(
    null
  );
  const [policyType, setPolicyType] = useState("");
  const [policyTypeError, setPolicyTypeError] = useState("");

  const [billsOfSalesPreviewUrl, setBillsOfSalesPreviewUrl] = useState<
    string | null
  >(null);
  const [pollutionCertificatePreviewUrl, setPollutionCertificatePreviewUrl] =
    useState<string | null>(null);
  const [nextServiceDate, setNextServiceDate] = useState(null);
  const [policyHolderAddress, setPolicyHolderAddress] = useState("");
  const [policyHolderAddressError, setPolicyHolderAddressError] = useState("");
  const [policyEffectiveDate, setPolicyEffectiveDate] = useState(null);
  const [policyEffectiveEndDate, setPolicyEffectiveEndDate] = useState(null);
  const [policyEffectiveDateError, setPolicyEffectiveDateError] = useState("");
  const [policyEffectiveEndDateError, setPolicyEffectiveEndDateError] =
    useState("");
  const [idv, setIdv] = useState("");
  const [idvAmount, setIdvAmount] = useState("");
  const [idvError, setIdvError] = useState("");
  const [idvAmountError, setIdvAmountError] = useState("");
  const [deductibles, setDeductibles] = useState("");
  const [deductiblesError, setDeductiblesError] = useState("");
  const [insuranceFile, setInsuranceFile] = useState<File | null>(null);
  const [insurancePreviewUrl, setInsurancePreviewUrl] = useState<string | null>(
    null
  );
  const [travelsName, setTravelsName] = useState<string>("");
  const [travelsContractorsName, setTravelsContractorsName] =
    useState<string>("");
  const [travelsNameError, setTravelsNameError] = useState<string | null>(null);
  const [travelsContractorsNameError, setTravelsContractorsNameError] =
    useState<string | null>(null);

  const [isInsuranceModalOpen, setIsInsuranceModalOpen] =
    useState<boolean>(false);

  // documnet icon download option code '
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = drawerDetails.vehicle_image.replace("/private", "");
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the dimensions as needed
      doc.save("vehicle_image.pdf");
    };
  };
  const renderDownloadLink = (fileUrl, label) => {
    if (fileUrl) {
      return (
        <Button href={fileUrl} download variant="outlined" sx={{ mt: 1 }}>
          Download {label}
        </Button>
      );
    } else {
      return (
        <Typography sx={{ mt: 1, color: "#848484" }}>
          No {label} data available
        </Typography>
      );
    }
  };
  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Vehicle Number";
    }
  }, []);

  const { data: FM_Vehicle_Details, isLoading } = useFrappeGetDocList(
    "FM_Vehicle_Details",
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
    if (FM_Vehicle_Details) {
      setTableData(FM_Vehicle_Details);
    }
  }, [FM_Vehicle_Details]);

  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  const { upload } = useFrappeFileUpload();

  // Columns definition for the table
  const columns = [
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
      key: "manufacturer_name",
      label: "Manufacture Name",
      _style: {
        width: "18%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "name",
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
      key: "vehicle_type",
      label: "Vehicle Type",
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
      key: "model",
      label: "Model",
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
      key: "rc_expiring_date",
      label: "RC Exp Date",
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
      key: "status",
      label: "Status",
      _style: {
        width: "18%",
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
      label: "Action",
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

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };
  // validation
  const validateVehicleName = (value) => {
    const minLength = 3;
    const maxLength = 50;
    const validPattern = /^[a-zA-Z0-9\s]+$/; // Allows letters, numbers, and spaces

    if (!value.trim()) {
      setVehicleError(true);
      setVehicleHelperText("Manufacturer Name is required.");
    } else if (value.length < minLength) {
      setVehicleError(true);
      setVehicleHelperText(
        `Manufacturer Name must be at least ${minLength} characters long.`
      );
    } else if (value.length > maxLength) {
      setVehicleError(true);
      setVehicleHelperText(
        `Manufacturer Name cannot exceed ${maxLength} characters.`
      );
    } else if (!validPattern.test(value)) {
      setVehicleError(true);
      setVehicleHelperText(
        "Manufacturer Name can only contain letters, numbers, and spaces."
      );
    } else {
      setVehicleError(false);
      setVehicleHelperText("");
    }
  };
  const validateVIN = (value) => {
    // Regular expression for VIN validation (17 characters, letters, and numbers)
    const validPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;

    if (value && !validPattern.test(value)) {
      setVINError(true);
      setVINHelperText(
        "Invalid VIN. Must be 17 characters long, with letters and numbers."
      );
    } else {
      setVINError(false);
      setVINHelperText("");
    }
  };
  const validateVehicleModel = (model) => {
    if (model && !/^[a-zA-Z0-9\s]*$/.test(model)) {
      setVehicleModelError(true);
      setVehicleModelHelperText(
        "Model can only contain letters, numbers, and spaces."
      );
    } else {
      setVehicleModelError(false);
      setVehicleModelHelperText("");
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

  const validateDates = (rcDate, rcExpiredDate) => {
    let valid = true;

    // Check if RC Expired Date is before RC Date
    if (rcDate && rcExpiredDate && rcExpiredDate.isBefore(rcDate)) {
      valid = false;
      const errorMsg = "RC Expired Date cannot be before RC Date.";
      setRCDateError(true);
      setRCExpiredDateError(true);
      setRCDateHelperText(errorMsg);
      setRCExpiredDateHelperText(errorMsg);
    } else {
      // Clear the errors if the validation passes
      setRCDateError(false);
      setRCExpiredDateError(false);
      setRCDateHelperText("");
      setRCExpiredDateHelperText("");
    }
  };

  //handle changes
  const handleRoadTaxDateChange = (date: Date | null) => {
    setRoadTaxDate(date);
  };
  const validateContactNumber = (number: string) => {
    // Regex pattern to allow only digits and exactly 10 digits in length
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (number && !phoneNumberPattern.test(number)) {
      setContactNumberError(
        "Contact Number must be exactly 10 digits and contain only numbers."
      );
    } else {
      setContactNumberError(null);
    }

    setContactNumber(number);
  };

  const validateTravelsName = (name: string) => {
    if (name && !/^[a-zA-Z\s]+$/.test(name)) {
      setTravelsNameError(
        "Travels Name should contain only letters and spaces."
      );
    } else {
      setTravelsNameError(null);
    }
    setTravelsName(name);
  };
  console.log("rcExpiredDateHelperText", rcExpiredDateHelperText);
  console.log("rcDateHelperText", rcDateHelperText);

  const validateTravelsContractorsName = (name: string) => {
    if (name && !/^[a-zA-Z\s]+$/.test(name)) {
      setTravelsContractorsNameError(
        "Contract's Name should contain only letters and spaces."
      );
    } else {
      setTravelsContractorsNameError(null);
    }
    setTravelsContractorsName(name);
  };

  const handleFileChangeInsurance = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    if (file) {
      setInsuranceFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setInsurancePreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleDeductiblesChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setDeductibles(newValue);
      setDeductiblesError(""); // Clear error if the input is valid
    } else {
      setDeductiblesError(
        "Enter a valid number with up to two decimal places."
      );
    }
  };

  const handleInsuranceCompanyNameChange = (e) => {
    const newValue = e.target.value;
    // Allow only letters, spaces, and hyphens
    if (/^[a-zA-Z\s\-]*$/.test(newValue)) {
      setInsuranceCompanyName(newValue);
      setInsuranceCompanyNameError(""); // Clear error if valid
    } else {
      setInsuranceCompanyNameError(
        "Only letters, spaces, and hyphens are allowed."
      );
    }
  };

  const handleInsuranceCompanyAddressChange = (e) => {
    const newValue = e.target.value;
    // Allow letters, numbers, spaces, and basic punctuation
    if (/^[a-zA-Z0-9\s,.-]*$/.test(newValue)) {
      setInsuranceCompanyAddress(newValue);
      setInsuranceCompanyAddressError(""); // Clear error if valid
    } else {
      setInsuranceCompanyAddressError(
        "Only letters, numbers, spaces, and basic punctuation are allowed."
      );
    }
  };

  const handleIdvChange = (e) => {
    const newValue = e.target.value;
    // Example validation: Allow only letters, numbers, and spaces
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
      setIdv(newValue);
      setIdvError(""); // Clear error if valid
    } else {
      setIdvError("Only letters, numbers, and spaces are allowed.");
    }
  };

  const handleIdvAmountChange = (e) => {
    const newValue = e.target.value;
    // Allow only numbers and decimal values with up to two decimal places
    if (/^\d*\.?\d{0,2}$/.test(newValue)) {
      setIdvAmount(newValue);
      setIdvAmountError(""); // Clear error if the input is valid
    } else {
      setIdvAmountError("Enter a valid number with up to two decimal places.");
    }
  };

  const handlePolicyEffectiveDateChange = (date) => {
    setPolicyEffectiveDate(date);
    // Example validation: check if the date is in the past
    if (date && date.isBefore(dayjs(), "day")) {
      setPolicyEffectiveDateError("Date cannot be in the past.");
    } else {
      setPolicyEffectiveDateError(""); // Clear error if valid
    }
  };

  const handlePolicyEffectiveEndDateChange = (date) => {
    setPolicyEffectiveEndDate(date);
    // Example validation: check if the end date is before the effective date
    if (
      policyEffectiveDate &&
      date &&
      date.isBefore(policyEffectiveDate, "day")
    ) {
      setPolicyEffectiveEndDateError(
        "End Date cannot be before Effective Date."
      );
    } else {
      setPolicyEffectiveEndDateError(""); // Clear error if valid
    }
  };

  const handlePolicyHolderAddressChange = (e) => {
    const newValue = e.target.value;
    setPolicyHolderAddress(newValue);
  };

  const handlePolicyTypeChange = (e) => {
    const newValue = e.target.value;
    // Example validation: allow letters, numbers, and spaces
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
      setPolicyType(newValue);
      setPolicyTypeError(""); // Clear error if valid
    } else {
      setPolicyTypeError("Only letters, numbers, and spaces are allowed.");
    }
  };

  const handlePolicyNumberChange = (e) => {
    const newValue = e.target.value;
    if (/^[a-zA-Z0-9\s]*$/.test(newValue)) {
      // Example pattern for policy number
      setPolicyNumber(newValue);
      setPolicyNumberError(""); // Clear error if valid
    } else {
      setPolicyNumberError("Only letters, numbers, and spaces are allowed.");
    }
  };
  const handleChangePolicyHolderName = (e) => {
    const newValue = e.target.value;
    // Use a regex to allow only letters and spaces
    if (/^[a-zA-Z\s]*$/.test(newValue)) {
      setPolicyHolderName(newValue);
    }
  };
  const handlePermitYearlyOnceDateChange = (date: Date | null) => {
    setPermitYearlyOnceDate(date);
  };

  const handleRCDateChange = (date) => {
    setRCDate(date);
    validateDates(date, rcExpiredDate);
  };

  const handleRCExpiredDateChange = (date) => {
    setRCExpiredDate(date);
    validateDates(rcDate, date);
  };
  const handleNextServiceDateChange = (date: Dayjs | null) => {
    setNextServiceDate(date);
  };

  useEffect(() => {
    validateDates(rcDate, rcExpiredDate);
  }, [rcDate, rcExpiredDate]);
  const handleOwnershipChange = (event) => {
    setOwnership(event.target.value);
  };
  const handleVehicleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validImageTypes.includes(fileType)) {
        setFileError("Please upload a valid image file (jpg, png, gif).");
        setVehicleImage(null);
        setVehicleImagePreviewUrl(null);
      } else {
        setFileError("");
        setVehicleImage(file);
        // Create a URL for the image preview
        const previewUrl = URL.createObjectURL(file);
        setVehicleImagePreviewUrl(previewUrl);
        openVehicleImagePreview(); // Open the image preview
      }
    } else {
      setFileError("No file selected.");
      setVehicleImage(null);
      setVehicleImagePreviewUrl(null);
    }
  };
  const handleVehicleFileChangeRC = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validImageTypes.includes(fileType)) {
        setFileErrorRc("Please upload a valid image file (jpg, png, gif).");
        setRcDetails(null);
        setRCImagePreviewUrl(null);
      } else {
        setFileErrorRc("");
        setRcDetails(file);
        // Create a URL for the image preview
        const previewUrl = URL.createObjectURL(file);
        setRCImagePreviewUrl(previewUrl);
        openRCImagePreview(); // Open the image preview
      }
    } else {
      setFileErrorRc("No file selected.");
      setRcDetails(null);
      setRCImagePreviewUrl(null);
    }
  };
  const handleFileChangeBillsOfSales = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setBillsOfSales(file);
      const previewUrl = URL.createObjectURL(file);
      setBillsOfSalesPreviewUrl(previewUrl);
    }
  };
  const handleFileChangePollutionCertificate = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPollutionCertificate(file);
      const previewUrl = URL.createObjectURL(file);
      setPollutionCertificatePreviewUrl(previewUrl);
    }
  };

  const handleFileChangeInvoice = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPurchaseInvoice(file);
      setPurchaseInvoicePreviewUrl(URL.createObjectURL(file));
      setFileErrorInvoice(null);
    } else {
      setFileErrorInvoice("Please select a valid image file.");
    }
  };

  const closePurchaseInvoicePreview = () =>
    setIsPurchaseInvoiceModalOpen(false);

  const handleVehicleAvailabilityChange = (event) => {
    setVehicleAvailability(event.target.value);
  };

  // file upload
  // const openVehicleImagePreview = () => setIsVehicleModalOpen(true);
  const openVehicleImagePreview = () => {
    if (vehicleImagePreviewUrl) {
      setIsVehicleModalOpen(true);
    }
  };
  const openPurchaseInvoicePreview = () => {
    if (purchaseInvoicePreviewUrl) {
      setIsPurchaseInvoiceModalOpen(true);
    }
  };

  const openRCImagePreview = () => {
    if (rcImagePreviewUrl) {
      setRCDetailsModalOpen(true);
    }
  };
  const openInsurancePreview = () => {
    setIsInsuranceModalOpen(true);
  };

  const closeInsurancePreview = () => {
    setIsInsuranceModalOpen(false);
  };
  const openPollutionCertificatePreview = () => {
    if (pollutionCertificatePreviewUrl) {
      setIsPollutionCertificateModalOpen(true);
    }
  };
  const openBillsOfSalesPreview = () => {
    if (billsOfSalesPreviewUrl) {
      setIsBillsOfSalesModalOpen(true);
    }
  };

  const closeVehicleImagePreview = () => setIsVehicleModalOpen(false);
  const closeRCImagePreview = () => setRCDetailsModalOpen(false);
  const closePollutionCertificatePreview = () =>
    setIsPollutionCertificateModalOpen(false);
  const closeBillsOfSalesPreview = () => setIsBillsOfSalesModalOpen(false);

  const imageUrlVehicle = vehicleImage
    ? URL.createObjectURL(vehicleImage)
    : null;

  // create doc
  const handleCancel = () => {
    setTravelsContractorsName("");
    setTravelsName("");
    setLicensePlateNumber("");
    setVehicleModel("");
    setContactNumber("");
    setVehicleImage(null);
    setVehicleName("");
    setContactNumber("");

    // setVehicleYear(null);
    setVehicleType("");
    setFuelType("");
    setVIN("");
    // setRCDate(null);
    // setRCExpiredDate(null);
    setRcDetails(null);
    setPollutionCertificate(null);
    // setNextServiceDate(null);
    // setRoadTaxDate(null);
    // setPermitYearlyOnceDate(null);
    setPolicyHolderName("");
    setPolicyNumber("");
    setPolicyType("");
    setPolicyHolderAddress("");
    setInsuranceCompanyAddress("");
    setInsuranceCompanyName("");
    // setPolicyEffectiveDate(null);
    // setPolicyEffectiveEndDate(null);
    setIdv("");
    setIdvAmount("");
    setDeductibles("");
    // setPurchaseInvoice(null);
    setBillsOfSales(null);
    setVehicleDetails(false);
    setTable(true);
  };
  const {
    createDoc,
    loading: contractorLoading,
    isCompleted,
    error,
    reset,
  } = useFrappeCreateDoc();
  const {
    updateDoc,
    loading: updatingLoading,
    error: updatingError,
  } = useFrappeUpdateDoc();
  // Reusable function for file upload
  const uploadFile = async (file, options) => {
    if (file instanceof File || file instanceof Blob) {
      const response = await upload(file, options);
      return response.file_url;
    } else {
      console.error("Invalid file type:", file);
      return null;
    }
  };
  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 19).replace("T", " ");
  };
  const CreateContractorRequest = async () => {
    try {
      // File uploads
      const vehicleImageUrl = await uploadFile(vehicleImage, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "vehicle_image",
      });
      const rcImageUrl = await uploadFile(rcDetails, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "rc_copy",
      });
      const pollutionCertificateUrl = await uploadFile(pollutionCertificate, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "pollution_certificate",
      });
      const insuranceCopyUrl = await uploadFile(insuranceFile, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "insurance_copy",
      });
      const purchaseinvoice = await uploadFile(purchaseInvoice, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "purchase_invoice",
      });
      const billsofsales = await uploadFile(billsOfSales, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        filedname: "bills_of_sales",
      });

      // Base request body
      const requestBody = {
        contractor_name: travelsContractorsName,
        travels_name: travelsName,
        plate_number: licensePlateNumber,
        model: vehicleModel,
        vehicle_image: vehicleImageUrl,
        contact_number: contactNumber,
        status: vehicleAvailability,
        ownership: ownership,
        manufacturer_name: vehicleName,
      };

      // Additional fields for "Own" ownership
      if (ownership === "Own") {
        Object.assign(requestBody, {
          model_year: vehicleYear,
          vehicle_type: vehicleType,
          fuel_type: fuelType,
          identification_number: vin,
          rc_date: formatDate(rcDate),
          rc_expiring_date: formatDate(rcExpiredDate),
          rc_copy: rcImageUrl,
          pollution_certificate: pollutionCertificateUrl,
          next_service_date: formatDate(nextServiceDate),
          road_tax: formatDate(roadTaxDate),
          permit: formatDate(permitYearlyOnceDate),
          policyholder_name: policyHolderName,
          policy_no: policyNumber,
          policy_type: policyType,
          policyholder_address: policyHolderAddress,
          insurance_company_address: insuranceCompanyAddress,
          insurance_company_name: insuranceCompanyName,
          policy_effective_start: formatDate(policyEffectiveDate),
          policy_effective_end: formatDate(policyEffectiveEndDate),
          idv: idv,
          idv_amount: idvAmount,
          deductibles: deductibles,
          insurance_copy: insuranceCopyUrl,
          purchase_invoice: purchaseinvoice,
          bills_of_sales: billsofsales,
        });
      }

      // Create the document
      await createDoc("FM_Vehicle_Details", requestBody);
      handleCancel();

      reset;
      // Reset form if contractor process is completed

      toast.success("Request Created Successfully");
    } catch (error) {
      handleRequestError(error);
    }
  };
  const handleUpdate = async (status) => {
    try {
      // File uploads
      const vehicleImageUrl = await uploadFile(vehicleImage, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "vehicle_image",
      });
      const rcImageUrl = await uploadFile(rcDetails, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "rc_copy",
      });
      const pollutionCertificateUrl = await uploadFile(pollutionCertificate, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "pollution_certificate",
      });
      const insuranceCopyUrl = await uploadFile(insuranceFile, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "insurance_copy",
      });
      const purchaseinvoice = await uploadFile(purchaseInvoice, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        fieldname: "purchase_invoice",
      });
      const billsofsales = await uploadFile(billsOfSales, {
        isPrivate: true,
        doctype: "FM_Vehicle_Details",
        filedname: "bills_of_sales",
      });
      // Base request body
      // Base request body
      const requestBody = {
        contractor_name: travelsContractorsName,
        travels_name: travelsName,
        plate_number: licensePlateNumber,
        model: vehicleModel,
        vehicle_image: vehicleImageUrl,
        contact_number: contactNumber,
        status: vehicleAvailability,
        ownership: ownership,
        manufacturer_name: vehicleName,
      };

      // Additional fields for "Own" ownership
      if (ownership === "Own") {
        Object.assign(requestBody, {
          model_year: vehicleYear,
          vehicle_type: vehicleType,
          fuel_type: fuelType,
          identification_number: vin,
          rc_date: formatDate(rcDate),
          rc_expiring_date: formatDate(rcExpiredDate),
          rc_copy: rcImageUrl,
          pollution_certificate: pollutionCertificateUrl,
          next_service_date: formatDate(nextServiceDate),
          road_tax: formatDate(roadTaxDate),
          permit: formatDate(permitYearlyOnceDate),
          policyholder_name: policyHolderName,
          policy_no: policyNumber,
          policy_type: policyType,
          policyholder_address: policyHolderAddress,
          insurance_company_address: insuranceCompanyAddress,
          insurance_company_name: insuranceCompanyName,
          policy_effective_start: formatDate(policyEffectiveDate),
          policy_effective_end: formatDate(policyEffectiveEndDate),
          idv: idv,
          idv_amount: idvAmount,
          deductibles: deductibles,
          insurance_copy: insuranceCopyUrl,
          purchase_invoice: purchaseinvoice,
          bills_of_sales: billsofsales,
        });
      }

      // Update the document
      await updateDoc("FM_Vehicle_Details", drawerDetails.name, requestBody);
      toast.success("Updated successfully");
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
  useEffect(() => {
    if (drawerDetails) {
      setTravelsContractorsName(drawerDetails?.contractor_name || "");
      setTravelsName(drawerDetails?.travels_name);
      setLicensePlateNumber(drawerDetails?.plate_number || "");
      setVehicleModel(drawerDetails?.model || "");
      setContactNumber(drawerDetails?.contact_number || "");
      setVehicleName(drawerDetails?.manufacturer_name || "");
      // setVehicleYear(drawerDetails?.model_year || "");
      setVehicleType(drawerDetails?.vehicle_type || "");
      setFuelType(drawerDetails?.fuel_type || "");
      setVIN(drawerDetails?.identification_number || "");
      // setRCDate(drawerDetails?.rc_date || null);
      // setRCExpiredDate(drawerDetails?.rc_expired_date || null);
      // setRcDetails(drawerDetails.rc_copy || null);
      setPollutionCertificate(drawerDetails.pollution_certificate || null);
      // setNextServiceDate(drawerDetails.next_service_date || null);
      // setRoadTaxDate(drawerDetails.road_tax || null);
      // setPermitYearlyOnceDate(drawerDetails.permit || null);
      setPolicyHolderName(drawerDetails.policyholder_name || "");
      setPolicyNumber(drawerDetails.policy_no || "");
      setPolicyType(drawerDetails.policy_type || "");
      setPolicyHolderAddress(drawerDetails.policyholder_address || "");
      setInsuranceCompanyAddress(drawerDetails.insurance_company_address || "");
      setInsuranceCompanyName(drawerDetails.insurance_company_name || "");
      // setPolicyEffectiveDate(drawerDetails.policy_effective_start || null);
      // setPolicyEffectiveEndDate(drawerDetails.policy_effective_end || null);
      setIdv(drawerDetails.idv || " ");
      setIdvAmount(drawerDetails.idv_amount || " ");
      setDeductibles(drawerDetails.deductibles || " ");
    }
  }, [drawerDetails]);

  // Vehicle API

  const API_KEY = "e5cb15721fd22dfe1844b0d75b198d48";
  const API_URL = "http://jtrack.in/api/pull_vts_details.php";

  const [vehicleData, setVehicleData] = useState<Vehicle[] | null>(null);
  const [apierror, setAPIError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `${API_URL}?api_key=${API_KEY}`
        );
        setVehicleData(response.data.data);
      } catch (error) {
        if (axios.isAxiosError(apierror)) {
          setAPIError(apierror?.response?.data?.message || error.message);
        } else {
          setAPIError("Unexpected error occurred");
        }
      }
    };

    fetchVehicleData();
  }, []);

  const filteredVehicles = vehicleData?.filter(
    (y) =>
      Array.isArray(tableData) &&
      tableData.some((x) => x?.plate_number === y?.vehicle_number)
  );

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
        Vehicle Details
      </Box>
      {table && (
        <>
          {/* {JSON.stringify(drawerDetails)} */}
          <div
            style={{
              backgroundColor: "#fff",
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
                setVehicleDetails(true);
                setTable(false);
              }}
            >
              <AddIcon sx={{ marginRight: "8px" }} />
              Add Vehicle Details
            </Box>
            {/* {JSON.stringify(filteredVehicles)} */}
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
              // onRowClick={(item) => handleRowClick(item)}
              tableBodyProps={{
                className: "align-middle tableData",
              }}
              scopedColumns={{
                S_no: (_item: any, index: number) => {
                  return <td>{index + 1}</td>;
                },
                bill_amount: (item: any) => {
                  return <td>{item?.bill_amount || "-"}</td>;
                },
                creation: (item: any) => {
                  const date = new Date(item.creation);
                  const formattedDate = `${date
                    .getDate()
                    .toString()
                    .padStart(2, "0")}-${(date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${date.getFullYear()}`;
                  return <td>{formattedDate}</td>;
                },
                action: (item: any) => {
                  const isMatched = filteredVehicles?.some(
                    (x) => x?.vehicle_number === item?.plate_number
                  );
                  const latitude = filteredVehicles
                    ?.filter((x) => x?.vehicle_number === item?.plate_number)
                    .map((x) => x.lat_message);
                  const longitude = filteredVehicles
                    ?.filter((x) => x?.vehicle_number === item?.plate_number)
                    .map((x) => x.lon_message);
                  return (
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

                      <div className="viewicon">
                        {isMatched ? (
                          <LuMapPin
                            size={20}
                            style={{
                              color: "green",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                              window.open(mapUrl, "_blank");
                            }}
                          />
                        ) : (
                          <LuMapPinOff
                            size={20}
                            style={{
                              color: "red",
                              cursor: "not-allowed",
                            }}
                          />
                        )}
                      </div>
                    </td>
                  );
                },
              }}
            />
          </div>
        </>
      )}
      {vehicleDetails && (
        <>
          <ThemeProvider theme={ThemeColor}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "100px",
                padding: "40px",
                backgroundColor: "#fff",
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {/* Column 1: Type of Ownership */}
              <Box
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Typography>Type of Ownership:</Typography>
                <RadioGroup
                  row
                  value={ownership}
                  onChange={handleOwnershipChange}
                >
                  <FormControlLabel
                    value="Own"
                    control={
                      <Radio
                        sx={{
                          color: "#454545",
                          "&.Mui-checked": {
                            color: "#66BB6A",
                          },
                        }}
                      />
                    }
                    label="Own"
                  />
                  <FormControlLabel
                    value="Contract"
                    control={
                      <Radio
                        sx={{
                          color: "#454545",
                          "&.Mui-checked": {
                            color: "#66BB6A",
                          },
                        }}
                      />
                    }
                    label="Contract"
                  />
                </RadioGroup>
              </Box>

              {/* Column 2: Vehicle Available */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <Typography>Vehicle Available:</Typography>
                <RadioGroup
                  row
                  value={vehicleAvailability}
                  onChange={handleVehicleAvailabilityChange}
                >
                  <FormControlLabel
                    value="Online"
                    control={
                      <Radio
                        sx={{
                          color: "#454545",
                          "&.Mui-checked": {
                            color: "#66BB6A",
                          },
                        }}
                      />
                    }
                    label="Online"
                  />
                  <FormControlLabel
                    value="Offline"
                    control={
                      <Radio
                        sx={{
                          color: "#454545",
                          "&.Mui-checked": {
                            color: "#66BB6A",
                          },
                        }}
                      />
                    }
                    label="Offline"
                  />
                </RadioGroup>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  backgroundColor: "#B3CCB3",
                  // padding: 1,
                  flexGrow: 1,
                  colour: "#454545",
                  borderRadius: 1,
                  margin: "5px 0px",
                  fontWeight: "600",
                }}
              >
                <IconButton
                  onClick={() => {
                    setVehicleDetails(false);
                    setTable(true);
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Add {ownership} Vehicle Details
              </Typography>
            </Box>
            {/* Conditional Rendering based on Ownership Type */}
            {ownership === "Own" && (
              <>
                <Box
                  sx={{
                    backgroundColor: "#fff",
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
                        Manufacturer Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={vehicleName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setVehicleName(newValue);
                      validateVehicleName(newValue);
                    }}
                    error={vehicleError}
                    helperText={vehicleHelperText}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Vehicle Model <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={vehicleModel}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setVehicleModel(newValue);
                      validateVehicleModel(newValue);
                    }}
                    error={vehicleModelError}
                    helperText={vehicleModelHelperText}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Vehicle Year"
                      views={["year", "month"]}
                      value={vehicleYear}
                      onChange={(newValue) => setVehicleYear(newValue)}
                      sx={{
                        width: "90%",
                        "& .MuiInputBase-root": {
                          height: "auto",
                        },
                        "& .MuiInputLabel-root": {
                          lineHeight: "40px",
                        },
                      }}
                      maxDate={dayjs()}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <Modal
                    open={isVehicleModalOpen}
                    onClose={closeVehicleImagePreview}
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
                        onClick={closeVehicleImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Vehicle Image Preview
                      </Typography>
                      <img
                        src={vehicleImagePreviewUrl || ""}
                        alt="Vehicle Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label={
                        <Typography>
                          Vehicle Image{" "}
                          <span>
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        </Typography>
                      }
                      className={`inputsimage ${
                        fileError ? "input-invalid" : ""
                      }`}
                      type="text"
                      placeholder="Images"
                      value={vehicleImage ? vehicleImage.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputVehicle"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!vehicleImage && (
                              <>
                                <UploadFileIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const fileInput = document.getElementById(
                                      "fileInputVehicle"
                                    ) as HTMLInputElement;
                                    if (fileInput) {
                                      fileInput.click();
                                    }
                                  }}
                                  className="AttachReporticon"
                                  style={{ cursor: "pointer" }}
                                />
                              </>
                            )}
                            {vehicleImage && (
                              <>
                                <VisibilityIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openVehicleImagePreview();
                                  }}
                                  className="PreviewIcon"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                  }}
                                />
                              </>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="file"
                      id="fileInputVehicle"
                      name="vehicle_photo"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleVehicleFileChange}
                    />
                    {fileError && <span className="ErrorMsg">{fileError}</span>}
                  </Box>
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        License Plate Number{" "}
                        <span style={{ color: "red" }}>*</span>
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
                  <TextField
                    select
                    label="Vehicle Type"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
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
                    <option value="">Select Vehicle Type</option>
                    <option value="Passenger">Passenger</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Goods">Goods</option>
                  </TextField>
                  <TextField
                    select
                    label="Fuel Type"
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
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
                    <option value="">Select Fuel Type</option>
                    <option value="Petrol">Petrol</option>

                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                  </TextField>
                  <TextField
                    label="Vehicle Identification Number (VIN)"
                    value={vin}
                    onChange={(e) => {
                      setVIN(e.target.value);
                      validateVIN(e.target.value);
                    }}
                    error={vinError}
                    helperText={vinHelperText}
                    sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {/* RC Date Picker */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "90%",
                        marginBottom: "20px",
                      }}
                    >
                      <DatePicker
                        label="RC Date"
                        value={rcDate}
                        onChange={handleRCDateChange}
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-root": {
                            height: "auto",
                          },
                          "& .MuiInputLabel-root": {
                            lineHeight: "40px",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField {...params} error={rcDateError} />
                        )}
                        format="DD/MM/YYYY"
                      />
                      {rcDateError && (
                        <span
                          style={{
                            color: "red",
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: "5px", // Add margin for spacing
                            fontSize: "12px", // Responsive font size
                          }}
                        >
                          {rcDateHelperText}
                        </span>
                      )}
                    </Box>

                    {/* RC Expired Date Picker */}
                    <Box
                      sx={{
                        position: "relative",
                        width: "90%",
                        marginBottom: "20px",
                      }}
                    >
                      <DatePicker
                        label="RC Expired Date"
                        value={rcExpiredDate}
                        onChange={handleRCExpiredDateChange}
                        sx={{
                          width: "100%",
                          "& .MuiInputBase-root": {
                            height: "auto",
                          },
                          "& .MuiInputLabel-root": {
                            lineHeight: "40px",
                          },
                        }}
                        renderInput={(params) => (
                          <TextField {...params} error={rcExpiredDateError} />
                        )}
                        format="DD/MM/YYYY"
                      />
                      {rcExpiredDateError && (
                        <span
                          style={{
                            color: "red",
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            marginTop: "5px", // Add margin for spacing
                            fontSize: "12px", // Responsive font size
                          }}
                        >
                          {rcExpiredDateHelperText}
                        </span>
                      )}
                    </Box>
                  </LocalizationProvider>

                  <Modal
                    open={rcDetailsModalOpen}
                    onClose={closeRCImagePreview}
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
                        onClick={closeRCImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        RC Image Preview
                      </Typography>
                      <img
                        src={rcImagePreviewUrl || ""}
                        alt="RC Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label={<Typography>RC Image</Typography>}
                      className={`inputsimage ${
                        fileErrorRc ? "input-invalid" : ""
                      }`}
                      type="text"
                      placeholder="Images"
                      value={rcDetails ? rcDetails.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputRC"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!rcDetails && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileInput = document.getElementById(
                                    "fileInputRC"
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                className="AttachReporticon"
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {rcDetails && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openRCImagePreview();
                                }}
                                className="PreviewIcon"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "8px",
                                }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="file"
                      id="fileInputRC"
                      name="rc_photo"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleVehicleFileChangeRC}
                    />
                    {fileErrorRc && (
                      <span className="ErrorMsg">{fileErrorRc}</span>
                    )}
                  </Box>
                  <Modal
                    open={isPurchaseInvoiceModalOpen}
                    onClose={closePurchaseInvoicePreview}
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
                        onClick={closePurchaseInvoicePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Purchase Invoice Preview
                      </Typography>
                      <img
                        src={purchaseInvoicePreviewUrl || ""}
                        alt="Purchase Invoice Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label="Purchase Invoice"
                      value={purchaseInvoice ? purchaseInvoice.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputInvoice"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!purchaseInvoice && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileInput = document.getElementById(
                                    "fileInputInvoice"
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {purchaseInvoice && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPurchaseInvoicePreview();
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
                      id="fileInputInvoice"
                      name="purchase_invoice"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChangeInvoice}
                    />
                    {fileErrorInvoice && (
                      <span className="ErrorMsg">{fileErrorInvoice}</span>
                    )}
                  </Box>
                  <Modal
                    open={isPollutionCertificateModalOpen}
                    onClose={closePollutionCertificatePreview}
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
                        onClick={closePollutionCertificatePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Pollution Certificate Preview
                      </Typography>
                      <img
                        src={pollutionCertificatePreviewUrl || ""}
                        alt="Pollution Certificate Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label="Pollution Certificate"
                      value={
                        pollutionCertificate ? pollutionCertificate.name : ""
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputPollutionCertificate"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!pollutionCertificate && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileInput = document.getElementById(
                                    "fileInputPollutionCertificate"
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {pollutionCertificate && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPollutionCertificatePreview();
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
                      id="fileInputPollutionCertificate"
                      name="pollution_certificate"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChangePollutionCertificate}
                    />
                  </Box>
                  <Modal
                    open={isBillsOfSalesModalOpen}
                    onClose={closeBillsOfSalesPreview}
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
                        onClick={closeBillsOfSalesPreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Bills of Sales Preview
                      </Typography>
                      <img
                        src={billsOfSalesPreviewUrl || ""}
                        alt="Bills of Sales Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label="Bills of Sales"
                      value={billsOfSales ? billsOfSales.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputBillsOfSales"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!billsOfSales && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileInput = document.getElementById(
                                    "fileInputBillsOfSales"
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {billsOfSales && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openBillsOfSalesPreview();
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
                      id="fileInputBillsOfSales"
                      name="bills_of_sales"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChangeBillsOfSales}
                    />
                  </Box>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Next Service Date"
                      value={nextServiceDate}
                      onChange={handleNextServiceDateChange}
                      sx={{
                        width: "90%",
                        "& .MuiInputBase-root": {
                          height: "auto",
                        },
                        "& .MuiInputLabel-root": {
                          lineHeight: "40px",
                        },
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                    {/* Road Tax Date Picker */}
                    <DatePicker
                      label="Road Tax Date"
                      value={roadTaxDate}
                      onChange={handleRoadTaxDateChange}
                      sx={{
                        width: "90%",
                        "& .MuiInputBase-root": {
                          height: "auto",
                        },
                        "& .MuiInputLabel-root": {
                          lineHeight: "40px",
                        },
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                    {/* Permit Yearly Once Date Picker */}
                    <DatePicker
                      label="Permit Yearly Once Date"
                      value={permitYearlyOnceDate}
                      onChange={handlePermitYearlyOnceDateChange}
                      sx={{
                        width: "90%",
                        "& .MuiInputBase-root": {
                          height: "auto",
                        },
                        "& .MuiInputLabel-root": {
                          lineHeight: "40px",
                        },
                      }}
                      renderInput={(params) => <TextField {...params} />}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  <Typography
                    sx={{
                      backgroundColor: "#B3CCB3",
                      padding: 1,
                      flexGrow: 1,
                      colour: "#454545",
                      borderRadius: 1,
                      margin: "5px 0px",
                      fontWeight: "600",
                    }}
                  >
                    Add Insurance Detils
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: "#fff",

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
                    label="Policy Holder Name"
                    value={policyHolderName}
                    onChange={handleChangePolicyHolderName}
                    inputProps={{
                      pattern: "[a-zA-Zs]*",
                    }}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Policy Number"
                    value={policyNumber}
                    onChange={handlePolicyNumberChange}
                    error={!!policyNumberError}
                    helperText={policyNumberError}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Policy Type"
                    value={policyType}
                    onChange={handlePolicyTypeChange}
                    error={!!policyTypeError}
                    helperText={policyTypeError}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Policy Holder Address"
                    value={policyHolderAddress}
                    onChange={handlePolicyHolderAddressChange}
                    error={!!policyHolderAddressError}
                    helperText={policyHolderAddressError}
                    multiline
                    rows={2}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Insurance Company Address"
                    value={insuranceCompanyAddress}
                    onChange={handleInsuranceCompanyAddressChange}
                    error={!!insuranceCompanyAddressError}
                    helperText={insuranceCompanyAddressError}
                    multiline
                    rows={2}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Insurance Company Name"
                    value={insuranceCompanyName}
                    onChange={handleInsuranceCompanyNameChange}
                    error={!!insuranceCompanyNameError}
                    helperText={insuranceCompanyNameError}
                  />
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Policy Effective Date"
                      value={policyEffectiveDate}
                      onChange={handlePolicyEffectiveDateChange}
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
                          error={!!policyEffectiveDateError}
                          helperText={policyEffectiveDateError}
                        />
                      )}
                      format="DD/MM/YYYY"
                    />
                    <DatePicker
                      label="Policy Effective End Date"
                      value={policyEffectiveEndDate}
                      onChange={handlePolicyEffectiveEndDateChange}
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
                          error={!!policyEffectiveEndDateError}
                          helperText={policyEffectiveEndDateError}
                        />
                      )}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="IDV"
                    value={idv}
                    onChange={handleIdvChange}
                    error={!!idvError}
                    helperText={idvError}
                  />

                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="IDV Amount"
                    value={idvAmount}
                    onChange={handleIdvAmountChange}
                    error={!!idvAmountError}
                    helperText={idvAmountError}
                    type="number"
                    inputProps={{ step: "0.01" }}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label="Deductibles"
                    value={deductibles}
                    onChange={handleDeductiblesChange}
                    error={!!deductiblesError}
                    helperText={deductiblesError}
                    type="text"
                  />
                  <Modal
                    open={isInsuranceModalOpen}
                    onClose={closeInsurancePreview}
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
                        onClick={closeInsurancePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Insurance Preview
                      </Typography>
                      <img
                        src={insurancePreviewUrl || ""}
                        alt="Insurance Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    </Box>
                  </Modal>

                  {/* Insurance File Upload Field */}
                  <Box
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      margin: "5 auto",
                    }}
                  >
                    <TextField
                      sx={{ margin: "0 auto" }}
                      label="Insurance"
                      value={insuranceFile ? insuranceFile.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputInsurance"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!insuranceFile && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const fileInput = document.getElementById(
                                    "fileInputInsurance"
                                  ) as HTMLInputElement;
                                  if (fileInput) {
                                    fileInput.click();
                                  }
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {insuranceFile && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openInsurancePreview();
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
                      id="fileInputInsurance"
                      name="insurance"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChangeInsurance}
                    />
                  </Box>
                </Box>
                {/* <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <Button
                    className="saveBtn"
                    disabled={
                      !vehicleName ||
                      !vehicleModel ||
                      !licensePlateNumber ||
                      vehicleModelError ||
                      policyNumberError ||
                      policyTypeError ||
                      policyHolderAddressError ||
                      idvError ||
                      idvAmountError ||
                      deductiblesError
                    }
                    onClick={CreateContractorRequest}
                  >
                    {contractorLoading ? "Submitting..." : "Submit"}
                  </Button>
                </Box> */}
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
                          !vehicleName ||
                          !vehicleModel ||
                          !vehicleImage ||
                          !licensePlateNumber ||
                          vehicleModelError ||
                          vehicleModelError ||
                          licensePlateError
                        }
                        onClick={CreateContractorRequest}
                      >
                        {contractorLoading ? "Submitting..." : "Submit"}
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
                          onClick={() => {
                            handleUpdate; // Call your update function
                            setVehicleDetails(true); // Set vehicle details to true
                            setTable(false); // Set table to false
                          }}
                          disabled={updatingLoading} // Button is disabled if `updatingLoading` is true
                        >
                          {updatingLoading ? "updating..." : "Update"}
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
            {ownership === "Contract" && (
              <>
                <Box
                  sx={{
                    backgroundColor: "#fff",
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
                        Manufacturer Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={vehicleName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setVehicleName(newValue);
                      validateVehicleName(newValue);
                    }}
                    error={vehicleError}
                    helperText={vehicleHelperText}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Travels Name <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={travelsName}
                    onChange={(e) => validateTravelsName(e.target.value)}
                    error={!!travelsNameError}
                    helperText={travelsNameError}
                    sx={{ width: "100%", marginBottom: 2 }}
                  />

                  {/* Travels Contract's Name Field */}
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Travels Contract Name{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={travelsContractorsName}
                    onChange={(e) =>
                      validateTravelsContractorsName(e.target.value)
                    }
                    error={!!travelsContractorsNameError}
                    helperText={travelsContractorsNameError}
                    sx={{ width: "100%" }}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        License Plate Number{" "}
                        <span style={{ color: "red" }}>*</span>
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
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "100%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Vehicle Model <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={vehicleModel}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setVehicleModel(newValue);
                      validateVehicleModel(newValue);
                    }}
                    error={vehicleModelError}
                    helperText={vehicleModelHelperText}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Contact Number <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={contactNumber}
                    onChange={(e) => validateContactNumber(e.target.value)}
                    error={!!contactNumberError}
                    helperText={contactNumberError}
                    sx={{ width: "100%", marginBottom: 2 }}
                    inputProps={{
                      maxLength: 10, // Optionally, limit the input to 10 characters
                    }}
                  />
                  <Modal
                    open={isVehicleModalOpen}
                    onClose={closeVehicleImagePreview}
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
                        onClick={closeVehicleImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="modal-title" variant="h6" component="h2">
                        Vehicle Image Preview
                      </Typography>
                      <img
                        src={vehicleImagePreviewUrl || ""}
                        alt="Vehicle Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
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
                      label={
                        <Typography>
                          Vehicle Image{" "}
                          <span>
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        </Typography>
                      }
                      className={`inputsimage ${
                        fileError ? "input-invalid" : ""
                      }`}
                      type="text"
                      placeholder="Images"
                      value={vehicleImage ? vehicleImage.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        const fileInput = document.getElementById(
                          "fileInputVehicle"
                        ) as HTMLInputElement;
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!vehicleImage && (
                              <>
                                <UploadFileIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const fileInput = document.getElementById(
                                      "fileInputVehicle"
                                    ) as HTMLInputElement;
                                    if (fileInput) {
                                      fileInput.click();
                                    }
                                  }}
                                  className="AttachReporticon"
                                  style={{ cursor: "pointer" }}
                                />
                              </>
                            )}
                            {vehicleImage && (
                              <>
                                <VisibilityIcon
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openVehicleImagePreview();
                                  }}
                                  className="PreviewIcon"
                                  style={{
                                    cursor: "pointer",
                                    marginLeft: "8px",
                                  }}
                                />
                              </>
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                    <input
                      type="file"
                      id="fileInputVehicle"
                      name="vehicle_photo"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleVehicleFileChange}
                    />
                    {fileError && <span className="ErrorMsg">{fileError}</span>}
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
                            !vehicleName ||
                            !vehicleModel ||
                            !vehicleImage ||
                            !licensePlateNumber ||
                            !travelsName ||
                            !contactNumber ||
                            !travelsContractorsName ||
                            travelsNameError ||
                            vehicleModelError ||
                            licensePlateError ||
                            contactNumberError ||
                            vehicleError ||
                            travelsContractorsNameError
                          }
                          onClick={CreateContractorRequest}
                        >
                          {contractorLoading ? "Submitting..." : "Submitcon"}
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
                            onClick={() => {
                              handleUpdate; // Call your update function
                              setVehicleDetails(true); // Set vehicle details to true
                              setTable(false); // Set table to false
                            }}
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
                </Box>
              </>
            )}
          </ThemeProvider>
        </>
      )}

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
                    {drawerDetails.ownership} Vehicle Details
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
              {/* <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Typography
                  sx={{
                    backgroundColor: "red",
                  }}
                >
                  Details
                </Typography>
                <Typography>Document</Typography>
              </Box> */}

              {/* {drawerDetails.ownership === "Contract" && ( */}
              <>
                {/* <Typography
                    sx={{
                      padding: 1,
                      color: "#848484",
                    }}
                  >
                    Vehicle Image
                  </Typography>
                  <Box
                    component="img"
                    src={drawerDetails.vehicle_image.replace("/private", "")}
                    alt="Vehicle Image"
                    sx={{
                      maxWidth: "70%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  /> */}
                <Typography
                  sx={{
                    padding: 1,
                    color: "#848484",
                  }}
                >
                  Vehicle Image
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Box
                    component="img"
                    src={drawerDetails.vehicle_image.replace("/private", "")}
                    alt="Vehicle Image"
                    sx={{
                      maxWidth: "70%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "white",
                    }}
                    onClick={handleClickOpen}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 48, // Adjust the right position for spacing
                      backgroundColor: "white",
                    }}
                    onClick={handleDownload}
                  >
                    <DownloadIcon />
                  </IconButton>
                </Box>

                {/* Preview Dialog */}
                <Dialog
                  open={open}
                  onClose={handleClose}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogContent>
                    <IconButton
                      edge="end"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close"
                      sx={{ position: "absolute", top: 8, right: 8 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Box
                      component="img"
                      src={drawerDetails.vehicle_image.replace("/private", "")}
                      alt="Vehicle Image"
                      sx={{
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </DialogContent>
                </Dialog>
                <Grid container spacing={2}>
                  {/* Vehicle Status */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Vehicle Status
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.status || "N/A"}{" "}
                      {/* Display the status or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Vehicle Type */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Vehicle Type
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.vehicle_type || "N/A"}{" "}
                      {/* Display the type or "N/A" if not available */}
                    </Typography>
                  </Grid>
                  {/* Vehicle Name */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Vehicle Name
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.name || "N/A"}{" "}
                      {/* Display the vehicle name or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Vehicle Model */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Vehicle Model
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.model || "N/A"}{" "}
                      {/* Display the vehicle model or "N/A" if not available */}
                    </Typography>
                  </Grid>
                  {/* License Plate Number */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      License Plate Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.plate_number || "N/A"}{" "}
                      {/* Display the plate number or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Vehicle Identification Number */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Vehicle Identification Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.identification_number || "N/A"}{" "}
                      {/* Display the ID number or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* RC Register Date */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      RC Register Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.rc_date || "N/A"}{" "}
                      {/* Display the RC register date or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* RC Expire Date */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      RC Expire Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.rc_expiring_date || "N/A"}{" "}
                      {/* Display the RC expire date or "N/A" if not available */}
                    </Typography>
                  </Grid>
                  {/* Next Service Date */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Next Service Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.next_service_date || "N/A"}{" "}
                      {/* Display the next service date or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Road Tax */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Road Tax
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.road_tax || "N/A"}{" "}
                      {/* Display the road tax status or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Permit Yearly Once */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Permit Yearly Once
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.permit || "N/A"}{" "}
                      {/* Display the permit status or "N/A" if not available */}
                    </Typography>
                  </Grid>
                </Grid>
                <Box>
                  <Typography
                    sx={{
                      backgroundColor: "#C7DBC8",
                      color: "#4CAF50",
                      fontSize: "1.2rem",
                      fontWeight: 500,
                      padding: "8px",
                      borderRadius: "2px",
                    }}
                  >
                    Insurance Details
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  {/* Policy Number */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policy_no || "N/A"}{" "}
                      {/* Display the policy number or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Policy Type */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Type
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policy_type || "N/A"}{" "}
                      {/* Display the policy type or "N/A" if not available */}
                    </Typography>
                  </Grid>
                  {/* Policy Holder Name */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Holder Name
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policyholder_name || "N/A"}{" "}
                      {/* Display the policy holder name or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Policy Holder Address */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Holder Address
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policyholder_address || "N/A"}{" "}
                      {/* Display the policy holder address or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Policy Effective Start Date */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Effective Start Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policy_effective_start || "N/A"}{" "}
                      {/* Display the policy effective start date or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Policy Effective End Date */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Policy Effective End Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.policy_effective_end || "N/A"}{" "}
                      {/* Display the policy effective end date or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* IDV */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      IDV
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.idv || "N/A"}{" "}
                      {/* Display the IDV or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* IDV Amount */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      IDV Amount
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.idv_amount || "N/A"}{" "}
                      {/* Display the IDV amount or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Insurance Company Name */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Insurance Company Name
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.insurance_company_name || "N/A"}{" "}
                      {/* Display the insurance company name or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Insurance Company Address */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Insurance Company Address
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.insurance_company_address || "N/A"}{" "}
                      {/* Display the insurance company address or "N/A" if not available */}
                    </Typography>
                  </Grid>

                  {/* Deductibles */}
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Deductibles
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.deductibles || "N/A"}{" "}
                      {/* Display the deductibles or "N/A" if not available */}
                    </Typography>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                  }}
                >
                  <Button
                    className="saveBtn"
                    onClick={() => {
                      setEdit(false);
                      setVehicleDetails(true); // Correct way to call functions
                      setTable(false);
                      handleCloseDrawer();
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              </>
              {/* )} */}
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default Vehicle;
