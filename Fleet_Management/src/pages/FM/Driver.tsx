import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import { ThemeProvider } from "@mui/material";
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
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import { toast } from "react-toastify";

import { createTheme } from "@mui/material/styles";

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
import Autocomplete from "@mui/material/Autocomplete";
interface DriverProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Driver: React.FC<DriverProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [driverDetails, setDriverDetails] = useState(false);
  const [table, setTable] = useState(true);
  const [ownership, setOwnership] = useState("Own");
  const [driverAvailability, setDriverAvailability] = useState("Online");
  const [driverName, setDriverName] = useState("");
  const [driverError, setDriverError] = useState(false);
  const [driverHelperText, setDriverHelperText] = useState("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [contactNumberError, setContactNumberError] = useState<string | null>(
    null
  );

  const [licenseError, setLicenseError] = useState<string>("");
  const [isDriverModalOpen, setIsDriveModalOpen] = useState(false);

  const closeDriverImagePreview = () => setIsDriveModalOpen(false);
  const closeAadharImagePreview = () => setIsAadharModalOpen(false);

  const [driverImagePreviewUrl, setDriverImagePreviewUrl] = useState<
    string | null
  >(null);
  const [driverImage, setDriverImage] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [fileErrorRc, setFileErrorRc] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] =
    useState<string>("");
  const [emergencyContactNumberError, setEmergencyNumberError] = useState<
    string | null
  >(null);
  const [travelsName, setTravelsName] = useState<string>("");
  const [travelsNameError, setTravelsNameError] = useState<string | null>(null);
  const [edit, setEdit] = useState(true);
  const [driverDetail, setDriverDetail] = useState(false);
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [licensePlateError, setLicensePlateError] = useState(false);
  const [licensePlateHelperText, setLicensePlateHelperText] = useState("");
  const [licenseExpiredDate, setLicenseExpiredDate] = useState(null);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [typeofLicense, setTypeofLicense] = useState("");
  const [aadharCardImage, setAadharCardImage] = useState<File | null>(null);
  const [aadharCardPreviewUrl, setAadharCardPreviewUrl] = useState<
    string | null
  >(null);
  const [isAadharModalOpen, setIsAadharModalOpen] = useState(false);
  const [aadharError, setAadharError] = useState<string>("");

  // State for License Copy
  const [licenseCopy, setLicenseCopy] = useState<File | null>(null);
  const [licenseCopyPreviewUrl, setLicenseCopyPreviewUrl] = useState<
    string | null
  >(null);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  // State for Police Verification Certificate
  const [policeVerificationCertificate, setPoliceVerificationCertificate] =
    useState<File | null>(null);
  const [
    policeVerificationCertificatePreviewUrl,
    setPoliceVerificationCertificatePreviewUrl,
  ] = useState<string | null>(null);
  const [isPoliceVerificationModalOpen, setIsPoliceVerificationModalOpen] =
    useState(false);
  const [policeVerificationError, setPoliceVerificationError] = useState<
    string | null
  >(null);
  // State for Medical Certificate
  const [medicalCertificate, setMedicalCertificate] = useState<File | null>(
    null
  );
  const [medicalCertificatePreviewUrl, setMedicalCertificatePreviewUrl] =
    useState<string | null>(null);
  const [isMedicalCertificateModalOpen, setIsMedicalCertificateModalOpen] =
    useState(false);
  const [medicalCertificateError, setMedicalCertificateError] = useState<
    string | null
  >(null);

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

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Driver Name";
    }
  }, []);

  const { data: FM_Driver_Details, isLoading: loadingDriverDetails } =
    useFrappeGetDocList("FM_Driver_Details", {
      fields: ["*"],
      // filters: [["owner", "=", userEmailId]],

      orderBy: {
        field: "modified",
        order: "desc",
      },
    });

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Driver_Details) {
      setTableData(FM_Driver_Details);
    }
  }, [FM_Driver_Details]);
  const { data: Employee, isLoading: employeeDetailsLoading } =
    useFrappeGetDocList("Employee", {
      fields: ["*"],
      filters: [
        ["department", "=", "Transportation - ACPL"],
        ["designation", "=", "Driver"],
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

  // Validate Driver Name (example function)
  const validateDriverName = (value) => {
    if (value.length === 0) {
      setDriverError(true);
      setDriverHelperText("Driver name is required.");
    } else {
      setDriverError(false);
      setDriverHelperText("");
    }
  };
  console.log("employeeDetails", employeeDetails);
  const doctypeName = drawerDetails.doctypename;
  const documentName = drawerDetails.name;

  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  // validation
  // const validateDriverName = (value) => {
  //   const minLength = 3;
  //   const maxLength = 50;
  //   const validPattern = /^[a-zA-Z0-9\s]+$/; // Allows letters, numbers, and spaces

  //   if (!value.trim()) {
  //     setDriverError(true);
  //     setDriverHelperText("Driver Name is required.");
  //   } else if (value.length < minLength) {
  //     setDriverError(true);
  //     setDriverHelperText(
  //       `Driver Name must be at least ${minLength} characters long.`
  //     );
  //   } else if (value.length > maxLength) {
  //     setDriverError(true);
  //     setDriverHelperText(`Driver Name cannot exceed ${maxLength} characters.`);
  //   } else if (!validPattern.test(value)) {
  //     setDriverError(true);
  //     setDriverHelperText(
  //       "Driver Name can only contain letters, numbers, and spaces."
  //     );
  //   } else {
  //     setDriverError(false);
  //     setDriverHelperText("");
  //   }
  // };
  // const validateDriverName = (value) => {
  //   if (value.length === 0) {
  //     setDriverError(true);
  //     setDriverHelperText("Driver name is required.");
  //   } else {
  //     setDriverError(false);
  //     setDriverHelperText("");
  //   }
  // };
  //handle change
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const [licenseDialogOpen, setLicenseDialogOpen] = useState(false);

  const handleLicenseDialogOpen = () => {
    setLicenseDialogOpen(true);
  };

  const handleLicenseDialogClose = () => {
    setLicenseDialogOpen(false);
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
  const handleDownload = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = drawerDetails.driver_photo.replace("/private", "");
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 10, 190, 0);
      doc.save("Driver_image.pdf");
    };
  };
  const [openMedical, setOpenMedical] = useState(false); // State for Medical Fitness dialog

  const handleClickOpenMedical = () => {
    setOpenMedical(true); // Open Medical Fitness dialog
  };

  const handleCloseMedical = () => {
    setOpenMedical(false); // Close Medical Fitness dialog
  };
  // Helper function to check if the file is a PDF
  const isPdf = (fileUrl) => {
    return fileUrl?.toLowerCase().endsWith(".pdf");
  };
  const handleDownloadMedical = () => {
    const fileUrl = drawerDetails.medical_fitness_certificate.replace(
      "/private",
      ""
    );

    if (isPdf(fileUrl)) {
      // Direct download for PDF
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = "Medical_Fitness_Certificate.pdf";
      link.click();
    } else {
      // Handle image download using jsPDF
      const doc = new jsPDF();
      const img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0);
        doc.save("Medical_Fitness_Certificate.pdf"); // Save as Medical_Fitness_Certificate.pdf
      };
    }
  };

  const [openPolice, setOpenPolice] = useState(false); // State for Police Verification dialog

  const handleClickOpenPolice = () => {
    setOpenPolice(true); // Open Police Verification dialog
  };

  const handleClosePolice = () => {
    setOpenPolice(false); // Close Police Verification dialog
  };

  const handleDownloadPolice = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = drawerDetails.police_verification_certificate.replace(
      "/private",
      ""
    );
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 10, 190, 0);
      doc.save("Police_Verification_Certificate.pdf"); // Save as Police_Verification_Certificate.pdf
    };
  };

  const handleDownloadLicenseCopy = () => {
    if (drawerDetails.license_copy) {
      const doc = new jsPDF();
      const img = new Image();
      img.src = drawerDetails.license_copy.replace("/private", "");
      img.onload = () => {
        doc.addImage(img, "JPEG", 10, 10, 190, 0); // Adjust the size and position as needed
        doc.save("License_Copy.pdf");
      };
    } else {
      alert("No license copy available for download.");
    }
  };
  const [openAadhar, setOpenAadhar] = useState(false);
  const handleClickOpenAadhar = () => {
    setOpenAadhar(true); // Open Aadhar dialog
  };

  const handleCloseAadhar = () => {
    setOpenAadhar(false); // Close Aadhar dialog
  };

  const handleDownloadAadhar = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = drawerDetails.aadhar_copy.replace("/private", "");
    img.onload = () => {
      doc.addImage(img, "JPEG", 10, 10, 190, 0);
      doc.save("Aadhar_Copy.pdf"); // Save as Aadhar_Copy.pdf
    };
  };
  // Handle Medical Certificate Image Change
  // Handle Medical Certificate File Change
  const handleMedicalCertificateFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
      ];
      if (!validFileTypes.includes(fileType)) {
        setMedicalCertificateError(
          "Please upload a valid file (pdf, jpg, png, gif)."
        );
        setMedicalCertificate(null);
        setMedicalCertificatePreviewUrl(null);
      } else {
        setMedicalCertificateError(null); // Clear the error
        setMedicalCertificate(file);

        // Generate preview URL for images only
        if (fileType.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(file);
          setMedicalCertificatePreviewUrl(previewUrl);
          setIsMedicalCertificateModalOpen(true); // Open the image preview modal
        } else {
          setMedicalCertificatePreviewUrl(null); // No preview for non-images
          setIsMedicalCertificateModalOpen(false);
        }
      }
    } else {
      setMedicalCertificateError("No file selected.");
      setMedicalCertificate(null);
      setMedicalCertificatePreviewUrl(null);
    }
  };

  // Close Medical Certificate Preview Modal
  const closeMedicalCertificateImagePreview = () =>
    setIsMedicalCertificateModalOpen(false);

  // Handle Police Verification Certificate Image Change
  // Handle Police Verification Certificate File Change
  const handlePoliceVerificationFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validFileTypes.includes(fileType)) {
        setPoliceVerificationError(
          "Please upload a valid file (pdf, jpg, png, jpeg, gif, doc, docx)."
        );
        setPoliceVerificationCertificate(null);
        setPoliceVerificationCertificatePreviewUrl(null);
      } else {
        setPoliceVerificationError(""); // Clear any existing error
        setPoliceVerificationCertificate(file);

        // Generate preview URL for images only
        if (fileType.startsWith("image/")) {
          const previewUrl = URL.createObjectURL(file);
          setPoliceVerificationCertificatePreviewUrl(previewUrl);
          setIsPoliceVerificationModalOpen(true); // Open the image preview modal
        } else {
          setPoliceVerificationCertificatePreviewUrl(null); // No preview for non-images
          setIsPoliceVerificationModalOpen(false);
        }
      }
    } else {
      setPoliceVerificationError("No file selected.");
      setPoliceVerificationCertificate(null);
      setPoliceVerificationCertificatePreviewUrl(null);
    }
  };

  // Close Police Verification Certificate Preview Modal
  const closePoliceVerificationImagePreview = () =>
    setIsPoliceVerificationModalOpen(false);

  // Handle License Copy Image Change
  const handleLicenseFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validFileTypes.includes(fileType)) {
        setLicenseError(
          "Please upload a valid file (pdf, jpg, jpeg, png, gif, doc)."
        );
        setLicenseCopy(null);
        setLicenseCopyPreviewUrl(null);
      } else {
        setLicenseError("");
        setLicenseCopy(file);
        const previewUrl = URL.createObjectURL(file);
        setLicenseCopyPreviewUrl(previewUrl);
        setIsLicenseModalOpen(true); // Open the image preview modal
      }
    } else {
      setLicenseError("No file selected.");
      setLicenseCopy(null);
      setLicenseCopyPreviewUrl(null);
    }
  };

  // Close License Image Preview Modal
  const closeLicenseImagePreview = () => setIsLicenseModalOpen(false);

  // Handle Aadhar Card Image Change
  const handleAadharFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileType = file.type;
      const validFileTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validFileTypes.includes(fileType)) {
        setAadharError(
          "Please upload a valid file (pdf, jpg, jpeg, png, gif, doc)."
        );
        setAadharCardImage(null);
        setAadharCardPreviewUrl(null);
      } else {
        setAadharError("");
        setAadharCardImage(file);
        const previewUrl = URL.createObjectURL(file);
        setAadharCardPreviewUrl(previewUrl);
        setIsAadharModalOpen(true); // Open the image preview modal
      }
    } else {
      setAadharError("No file selected.");
      setAadharCardImage(null);
      setAadharCardPreviewUrl(null);
    }
  };

  const handleDriverFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validImageTypes.includes(fileType)) {
        setFileError("Please upload a valid image file (jpg, png, gif).");
        setDriverImage(null);
        setDriverImagePreviewUrl(null);
      } else {
        setFileError("");
        setDriverImage(file);
        // Create a URL for the image preview
        const previewUrl = URL.createObjectURL(file);
        setDriverImagePreviewUrl(previewUrl);
        openDriverImagePreview(); // Open the image preview
      }
    } else {
      setFileError("No file selected.");
      setDriverImage(null);
      setDriverImagePreviewUrl(null);
    }
  };
  const handleDriverAvailabilityChange = (event) => {
    setDriverAvailability(event.target.value);
  };
  const openDriverImagePreview = () => {
    if (driverImagePreviewUrl) {
      setIsDriveModalOpen(true);
    }
  };
  const handleDateOfBirthChange = (newValue) => {
    setDateOfBirth(newValue);
  };
  const handleRCExpiredDateChange = (date) => {
    setLicenseExpiredDate(date);
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
  const handleOwnershipChange = (event) => {
    setOwnership(event.target.value);
  };
  const validateEmergencyNumber = (number: string) => {
    // Regex pattern to allow only digits and exactly 10 digits in length
    const phoneNumberPattern = /^[0-9]{10}$/;

    if (number && !phoneNumberPattern.test(number)) {
      setEmergencyNumberError(
        "Contact Number must be exactly 10 digits and contain only numbers."
      );
    } else {
      setEmergencyNumberError(null);
    }

    setEmergencyContactNumber(number);
  };
  const handleCancel = () => {
    setDriverName("");
    setTravelsName("");
    setLicensePlateNumber("");
    setLicenseExpiredDate(null);
    setContactNumber("");
    setDateOfBirth(null);
    setEmergencyContactNumber("");
    setTypeofLicense("");
    setDriverDetails(false);
    setTable(true);
  };
  const { upload } = useFrappeFileUpload();

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
      key: "employee_name",
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
      key: "employee_id",
      label: "Driver ID",
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
      key: "mobile_number",
      label: "Driver Mobile No",
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
      key: "license_number",
      label: "License No",
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

  const handleRowClick = (item: any) => {
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
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
  const CreateDriverRequest = async () => {
    try {
      // File uploads
      const driverImageUrl = await uploadFile(driverImage, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "driver_photo",
      });

      const policeCertificateUrl = await uploadFile(
        policeVerificationCertificate,
        {
          isPrivate: true,
          doctype: "FM_Driver_Details",
          fieldname: "police_verification_certificate",
        }
      );
      const medicalcertificate = await uploadFile(medicalCertificate, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "medical_fitness_certificate",
      });
      const aadharCard = await uploadFile(aadharCardImage, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "aadhar_copy",
      });
      const licensecopy = await uploadFile(licenseCopy, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        filedname: "license_copy",
      });

      // Base request body
      const requestBody = {
        employee_name: driverName,
        employee_id: selectedEmployee,
        employee_type: ownership,
        license_number: licensePlateNumber,
        license_expiration_date: formatDate(licenseExpiredDate),
        driver_photo: driverImageUrl,
        dob: dateOfBirth,
        mobile_number: contactNumber,
        emergency_contact_number: emergencyContactNumber,
        license_type: typeofLicense,
        aadhar_copy: aadharCard,
        license_copy: licensecopy,
        police_verification_certificate: policeCertificateUrl,
        medical_fitness_certificate: medicalcertificate,
        status: driverAvailability,
      };

      // Create the document
      await createDoc("FM_Driver_Details", requestBody);
      handleCancel();

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
      // File uploads if needed

      const driverImageUrl = await uploadFile(driverImage, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "driver_photo",
      });

      const policeCertificateUrl = await uploadFile(
        policeVerificationCertificate,
        {
          isPrivate: true,
          doctype: "FM_Driver_Details",
          fieldname: "police_verification_certificate",
        }
      );
      const medicalcertificate = await uploadFile(medicalCertificate, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "medical_fitness_certificate",
      });
      const aadharCard = await uploadFile(aadharCardImage, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        fieldname: "aadhar_copy",
      });
      const licensecopy = await uploadFile(licenseCopy, {
        isPrivate: true,
        doctype: "FM_Driver_Details",
        filedname: "license_copy",
      });
      // Base request body
      const updateData = {
        employee_name: driverName,
        employee_id: selectedEmployee,
        employee_type: ownership,
        license_number: licensePlateNumber,
        license_expiration_date: formatDate(licenseExpiredDate),
        driver_photo: driverImageUrl,
        dob: formatDate(dateOfBirth),
        mobile_number: contactNumber,
        emergency_contact_number: emergencyContactNumber,
        license_type: typeofLicense,
        aadhar_copy: aadharCard,
        license_copy: licensecopy,
        police_verification_certificate: policeCertificateUrl,
        medical_fitness_certificate: medicalcertificate,
        status: driverAvailability,
      };

      // Update the document
      await updateDoc("FM_Driver_Details", drawerDetails.name, updateData);
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
      setDriverName(drawerDetails.employee_name || "");
      setTravelsName(drawerDetails.travels_name || "");
      setLicensePlateNumber(drawerDetails.license_number || "");
      setSelectedEmployee(drawerDetails.employee_id || "");
      setContactNumber(drawerDetails.contact_number || "");
      setOwnership(drawerDetails.employee_type || "Own");
      // setLicenseExpiredDate(drawerDetails.license_expiration_date || "");
      setDriverImage(drawerDetails.driver_photo || "");
      // setDateOfBirth(drawerDetails.dob || "");
      setContactNumber(drawerDetails.mobile_number || " ");
      setEmergencyContactNumber(drawerDetails.emergency_contact_number || "");
      setTypeofLicense(drawerDetails.license_type || "");
      setAadharCardImage(drawerDetails.aadhar_copy || "");
      setLicenseCopy(drawerDetails.policyholder_address || "");
      setPoliceVerificationCertificate(
        drawerDetails.insurance_company_address || ""
      );
      setMedicalCertificate(drawerDetails.medical_fitness_certificate || "");
      setDriverAvailability(drawerDetails.status || "Online");
    }
  }, [drawerDetails]);
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
        Driver Details
      </Box>
      {table && (
        <>
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
                setDriverDetails(true);
                setTable(false);
              }}
            >
              <AddIcon sx={{ marginRight: "8px" }} />
              Add Driver Details
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
                S_no: (_item: any, index: number) => {
                  return <td>{index + 1}</td>;
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
                    </td>
                  );
                },
              }}
            />
          </div>
        </>
      )}

      {driverDetails && (
        <>
          <ThemeProvider theme={ThemeColor}>
            <Box
              sx={{
                backgroundColor: "#fff",
                display: "flex",
                flexDirection: "row",
                gap: "100px",
                padding: "40px",
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
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <Typography>Driver Available:</Typography>
                <RadioGroup
                  row
                  value={driverAvailability} // This ensures the selected value is controlled
                  onChange={handleDriverAvailabilityChange}
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
                  flexGrow: 1,

                  borderRadius: 1,
                  fontWeight: 600,
                  color: "#000",
                  margin: "10px 0px",
                }}
              >
                <IconButton
                  onClick={() => {
                    setDriverDetails(false);
                    setTable(true);
                  }}
                >
                  <ArrowBackIcon />
                </IconButton>
                Add Own Driver Details
              </Typography>
            </Box>

            {/* Conditional Rendering based on Ownership Type */}
            {ownership === "Own" && (
              <Box
                sx={{
                  display: "grid",
                  backgroundColor: "#fff",
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
                <Modal
                  open={isDriverModalOpen}
                  onClose={closeDriverImagePreview}
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
                      onClick={closeDriverImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="modal-title" variant="h6" component="h2">
                      Driver Image Preview
                    </Typography>
                    <img
                      src={driverImagePreviewUrl || ""}
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
                    label={<Typography>Driver Image </Typography>}
                    className={`inputsimage ${
                      fileError ? "input-invalid" : ""
                    }`}
                    type="text"
                    placeholder="Images"
                    value={driverImage ? driverImage.name : ""}
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
                          {!driverImage && (
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
                          {driverImage && (
                            <>
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDriverImagePreview();
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
                    onChange={handleDriverFileChange}
                  />
                  {fileError && <span className="ErrorMsg">{fileError}</span>}
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box>
                    <DatePicker
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      label="Date Of Birth"
                      value={dateOfBirth}
                      format="DD/MM/YYYY"
                      onChange={handleDateOfBirthChange}
                      disableFuture
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          variant="outlined"
                          required
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                            "& .MuiInputBase-root": {
                              height: {
                                xs: "100%",
                                sm: "100%",
                                md: "50px",
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </LocalizationProvider>
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                  label={<span>Contact Number</span>}
                  value={contactNumber}
                  onChange={(e) => validateContactNumber(e.target.value)}
                  error={!!contactNumberError}
                  helperText={contactNumberError}
                  sx={{ width: "100%", marginBottom: 2 }}
                  inputProps={{
                    maxLength: 10,
                  }}
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
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="License Expired Date"
                    value={licenseExpiredDate}
                    onChange={handleRCExpiredDateChange}
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
                <TextField
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    height: "auto",
                    textAlign: "left",
                  }}
                  label={<span>Emergency Contact Number </span>}
                  value={emergencyContactNumber}
                  onChange={(e) => validateEmergencyNumber(e.target.value)}
                  error={!!emergencyContactNumberError}
                  helperText={emergencyContactNumberError}
                  sx={{ width: "100%", marginBottom: 2 }}
                  inputProps={{
                    maxLength: 10,
                  }}
                />
                <TextField
                  select
                  label="Type of License"
                  value={typeofLicense}
                  onChange={(e) => setTypeofLicense(e.target.value)}
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
                  <option value="">Select License Type</option>
                  <option value="LMV">LMV</option>
                  <option value="LMV Badge">LMV Badge</option>
                  <option value="HMV">HMV</option>
                  <option value="Hazardous">Hazardous</option>
                </TextField>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "90%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{ margin: "0 auto" }}
                    label={<Typography>Aadhar Card</Typography>}
                    value={aadharCardImage ? aadharCardImage.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("fileInputAadhar")?.click();
                    }}
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!aadharCardImage && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputAadhar")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {aadharCardImage && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsAadharModalOpen(true);
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
                    id="fileInputAadhar"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleAadharFileChange}
                  />
                  {aadharError && (
                    <span className="ErrorMsg">{aadharError}</span>
                  )}
                </Box>

                <Modal
                  open={isAadharModalOpen}
                  onClose={closeAadharImagePreview}
                  aria-labelledby="aadhar-modal-title"
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
                      onClick={closeAadharImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="aadhar-modal-title" variant="h6">
                      Aadhar Card Preview
                    </Typography>
                    <img
                      src={aadharCardPreviewUrl || ""}
                      alt="Aadhar Card Preview"
                      style={{ width: "100%", marginTop: 16 }}
                    />
                  </Box>
                </Modal>
                <Box
                  sx={{
                    width: { xs: "100%", sm: "100%", md: "100%" },
                    margin: "10 auto",
                  }}
                >
                  <TextField
                    sx={{ margin: "0 auto" }}
                    label={<Typography>License Copy</Typography>}
                    value={licenseCopy ? licenseCopy.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("fileInputLicense")?.click();
                    }}
                    sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!licenseCopy && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputLicense")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {licenseCopy && (
                            <VisibilityIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsLicenseModalOpen(true);
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
                    id="fileInputLicense"
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                    style={{ display: "none" }}
                    onChange={handleLicenseFileChange}
                  />
                  {licenseError && (
                    <span className="ErrorMsg">{licenseError}</span>
                  )}
                </Box>

                <Modal
                  open={isLicenseModalOpen}
                  onClose={closeLicenseImagePreview}
                  aria-labelledby="license-modal-title"
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
                      onClick={closeLicenseImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="license-modal-title" variant="h6">
                      License Copy Preview
                    </Typography>
                    <img
                      src={licenseCopyPreviewUrl || ""}
                      alt="License Copy Preview"
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
                    sx={{
                      margin: "0 auto",
                      width: { xs: "100%", sm: "100%", md: "100%" },
                    }}
                    label={
                      <Typography>Police Verification Certificate</Typography>
                    }
                    value={
                      policeVerificationCertificate
                        ? policeVerificationCertificate.name
                        : ""
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById("fileInputPoliceVerification")
                        ?.click();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!policeVerificationCertificate && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputPoliceVerification")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {policeVerificationCertificate &&
                            policeVerificationCertificatePreviewUrl && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPoliceVerificationModalOpen(true);
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
                    id="fileInputPoliceVerification"
                    accept=".pdf,image/*,.doc,.docx" // Accepting pdf, all image types, doc, and docx
                    style={{ display: "none" }}
                    onChange={handlePoliceVerificationFileChange}
                  />
                  {policeVerificationError && (
                    <span className="ErrorMsg">{policeVerificationError}</span>
                  )}
                </Box>

                <Modal
                  open={isPoliceVerificationModalOpen}
                  onClose={closePoliceVerificationImagePreview}
                  aria-labelledby="police-verification-modal-title"
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
                      onClick={closePoliceVerificationImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      id="police-verification-modal-title"
                      variant="h6"
                    >
                      Police Verification Certificate Preview
                    </Typography>
                    {policeVerificationCertificatePreviewUrl && (
                      <img
                        src={policeVerificationCertificatePreviewUrl}
                        alt="Police Verification Certificate Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    )}
                  </Box>
                </Modal>

                <Modal
                  open={isLicenseModalOpen}
                  onClose={closeLicenseImagePreview}
                  aria-labelledby="license-modal-title"
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
                      onClick={closeLicenseImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography id="license-modal-title" variant="h6">
                      License Copy Preview
                    </Typography>
                    <img
                      src={licenseCopyPreviewUrl || ""}
                      alt="License Copy Preview"
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
                    sx={{
                      margin: "0 auto",
                      width: { xs: "100%", sm: "100%", md: "100%" },
                    }}
                    label={<Typography>Medical Certificate </Typography>}
                    value={medicalCertificate ? medicalCertificate.name : ""}
                    onClick={(e) => {
                      e.stopPropagation();
                      document
                        .getElementById("fileInputMedicalCertificate")
                        ?.click();
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {!medicalCertificate && (
                            <UploadFileIcon
                              onClick={(e) => {
                                e.stopPropagation();
                                document
                                  .getElementById("fileInputMedicalCertificate")
                                  ?.click();
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          )}
                          {medicalCertificate &&
                            medicalCertificatePreviewUrl && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsMedicalCertificateModalOpen(true);
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
                    id="fileInputMedicalCertificate"
                    accept=".pdf,image/*" // Accepting pdf and all image types
                    style={{ display: "none" }}
                    onChange={handleMedicalCertificateFileChange}
                  />
                  {medicalCertificateError && (
                    <span className="ErrorMsg">{medicalCertificateError}</span>
                  )}
                </Box>

                <Modal
                  open={isMedicalCertificateModalOpen}
                  onClose={closeMedicalCertificateImagePreview}
                  aria-labelledby="medical-certificate-modal-title"
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
                      onClick={closeMedicalCertificateImagePreview}
                      sx={{ position: "absolute", top: 8, right: 16 }}
                    >
                      <CloseIcon />
                    </IconButton>
                    <Typography
                      id="medical-certificate-modal-title"
                      variant="h6"
                    >
                      Medical Certificate Preview
                    </Typography>
                    {medicalCertificatePreviewUrl && (
                      <img
                        src={medicalCertificatePreviewUrl}
                        alt="Medical Certificate Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    )}
                  </Box>
                </Modal>
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
                        // disabled={
                        //   !vehicleName ||
                        //   !vehicleModel ||
                        //   !licensePlateNumber ||
                        //   vehicleModelError ||
                        //   policyNumberError ||
                        //   policyTypeError ||
                        //   policyHolderAddressError ||
                        //   idvError ||
                        //   idvAmountError ||
                        //   deductiblesError
                        // }
                        onClick={CreateDriverRequest}
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
              </Box>
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
                    label={<span>Driver Name</span>}
                    value={driverName}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setDriverName(newValue);
                      validateDriverName(newValue);
                    }}
                    error={driverError}
                    helperText={driverHelperText}
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
                    error={!!emergencyContactNumberError}
                    helperText={emergencyContactNumberError}
                    sx={{ width: "100%", marginBottom: 2 }}
                    inputProps={{
                      maxLength: 10,
                    }}
                  />
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={<span>License Plate Number </span>}
                    value={licensePlateNumber}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setLicensePlateNumber(newValue);
                      validateLicensePlateNumber(newValue);
                    }}
                    error={licensePlateError}
                    helperText={licensePlateHelperText}
                  />
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
                          License Copy <span style={{ color: "red" }}>*</span>
                        </Typography>
                      }
                      value={licenseCopy ? licenseCopy.name : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById("fileInputLicense")?.click();
                      }}
                      sx={{ width: { xs: "100%", sm: "100%", md: "100%" } }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {!licenseCopy && (
                              <UploadFileIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  document
                                    .getElementById("fileInputLicense")
                                    ?.click();
                                }}
                                style={{ cursor: "pointer" }}
                              />
                            )}
                            {licenseCopy && (
                              <VisibilityIcon
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsLicenseModalOpen(true);
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
                      id="fileInputLicense"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleLicenseFileChange}
                    />
                    {fileError && <span className="ErrorMsg">{fileError}</span>}
                  </Box>
                  <Modal
                    open={isLicenseModalOpen}
                    onClose={closeLicenseImagePreview}
                    aria-labelledby="license-modal-title"
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
                        onClick={closeLicenseImagePreview}
                        sx={{ position: "absolute", top: 8, right: 16 }}
                      >
                        <CloseIcon />
                      </IconButton>
                      <Typography id="license-modal-title" variant="h6">
                        License Copy Preview
                      </Typography>
                      <img
                        src={licenseCopyPreviewUrl || ""}
                        alt="License Copy Preview"
                        style={{ width: "100%", marginTop: 16 }}
                      />
                    </Box>
                  </Modal>
                  <TextField
                    sx={{
                      width: { xs: "100%", sm: "100%", md: "90%" },
                      height: "auto",
                      textAlign: "left",
                    }}
                    label={
                      <span>
                        Travels Association{" "}
                        <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={travelsName}
                    onChange={(e) => validateTravelsName(e.target.value)}
                    error={!!travelsNameError}
                    helperText={travelsNameError}
                    sx={{ width: "100%", marginBottom: 2 }}
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
                        // disabled={
                        //   !vehicleName ||
                        //   !vehicleModel ||
                        //   !licensePlateNumber ||
                        //   vehicleModelError ||
                        //   policyNumberError ||
                        //   policyTypeError ||
                        //   policyHolderAddressError ||
                        //   idvError ||
                        //   idvAmountError ||
                        //   deductiblesError
                        // }
                        onClick={CreateDriverRequest}
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
          <>
            <Box sx={{ padding: "20px" }}>
              <Box>
                <div className="m-4">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      flexGrow={1}
                      className="drawerTitle"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                    >
                      {drawerDetails.employee_type} Driver Details
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  {doctypeName == "Own" && <></>}

                  {doctypeName === "Contract" && <></>}
                </div>
                <Typography
                  sx={{
                    padding: 1,
                    color: "#848484",
                  }}
                >
                  Driver Image
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    display: "inline-block",
                  }}
                >
                  <Box
                    component="img"
                    src={drawerDetails.driver_photo.replace("/private", "")}
                    alt="Vehicle Image"
                    sx={{
                      maxWidth: "30%",
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
                      src={drawerDetails.driver_photo.replace("/private", "")}
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

                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Employee Type
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.employee_type || "N/A"}{" "}
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
                      Driver Name
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.employee_name || "N/A"}{" "}
                      {/* Display the vehicle name or "N/A" if not available */}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Driver DOB
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.dob || "N/A"}{" "}
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
                      Driver Mobile Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.mobile_number || "N/A"}{" "}
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
                      Driver License Type
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.license_type || "N/A"}{" "}
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
                      Driver License Type
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.status || "N/A"}{" "}
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
                      Driver License Expiration Date
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.license_expiration_date || "N/A"}{" "}
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
                      License Copy
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
                        {drawerDetails.license_copy || "N/A"}
                      </Typography>
                      {drawerDetails.license_copy && (
                        <>
                          <IconButton
                            sx={{ marginLeft: 1 }}
                            onClick={handleLicenseDialogOpen}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton
                            sx={{ marginLeft: 1 }}
                            onClick={handleDownloadLicenseCopy}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>

                    {/* Preview Dialog */}
                    <Dialog
                      open={licenseDialogOpen}
                      onClose={handleLicenseDialogClose}
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogContent>
                        <IconButton
                          edge="end"
                          color="inherit"
                          onClick={handleLicenseDialogClose}
                          aria-label="close"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                        {drawerDetails.license_copy ? (
                          <Box
                            component="img"
                            src={drawerDetails.license_copy.replace(
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

                  <Grid item xs={6}>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#848484",
                      }}
                    >
                      Emergency Contact Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.emergency_contact_number || "N/A"}{" "}
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
                      Aadhar Number
                    </Typography>
                    <Typography
                      sx={{
                        padding: 1,
                        color: "#000",
                      }}
                    >
                      {drawerDetails.aadhar_number || "N/A"}{" "}
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
                      Aadhar Copy
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
                        {drawerDetails.aadhar_copy || "N/A"}
                      </Typography>
                      {/* Conditionally show the "N/A" or icon buttons */}
                      {drawerDetails.aadhar_copy ? (
                        <>
                          {/* Icon to preview Aadhar Copy */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 8,
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleClickOpenAadhar}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {/* Icon to download Aadhar Copy */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 48,
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleDownloadAadhar}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            padding: 1,
                            color: "#000",
                          }}
                        >
                          N/A
                        </Typography>
                      )}
                    </Box>

                    {/* Aadhar Copy Preview Dialog */}
                    <Dialog
                      open={openAadhar}
                      onClose={handleCloseAadhar}
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogContent>
                        <IconButton
                          edge="end"
                          color="inherit"
                          onClick={handleCloseAadhar}
                          aria-label="close"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Box
                          component="img"
                          src={drawerDetails.aadhar_copy.replace(
                            "/private",
                            ""
                          )}
                          alt="Aadhar Copy"
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
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
                      Police Verification Certificate
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
                        {drawerDetails.police_verification_certificate || "N/A"}
                      </Typography>
                      {/* Conditionally show the "N/A" or icon buttons */}
                      {drawerDetails.police_verification_certificate ? (
                        <>
                          {/* Icon to preview Police Verification Certificate */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 8,
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleClickOpenPolice} // Update to handle Police Verification click
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {/* Icon to download Police Verification Certificate */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 48, // Adjust the right position for spacing
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleDownloadPolice} // Update to handle Police Verification download
                          >
                            <DownloadIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            padding: 1,
                            color: "#000",
                          }}
                        >
                          N/A
                        </Typography>
                      )}
                    </Box>

                    {/* Police Verification Certificate Preview Dialog */}
                    <Dialog
                      open={openPolice} // State for Police Verification dialog
                      onClose={handleClosePolice} // Handle close for Police Verification
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogContent>
                        <IconButton
                          edge="end"
                          color="inherit"
                          onClick={handleClosePolice} // Handle close for Police Verification
                          aria-label="close"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                        <Box
                          component="img"
                          src={drawerDetails.police_verification_certificate.replace(
                            "/private",
                            ""
                          )}
                          alt="Police Verification Certificate"
                          sx={{
                            maxWidth: "100%",
                            height: "auto",
                            objectFit: "contain",
                          }}
                        />
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
                      Medical Fitness Certificate
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
                        {drawerDetails.medical_fitness_certificate || "N/A"}
                      </Typography>
                      {/* Conditionally show the "N/A" or icon buttons */}
                      {drawerDetails.medical_fitness_certificate ? (
                        <>
                          {/* Icon to preview Medical Fitness Certificate */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 8,
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleClickOpenMedical} // Update to handle Medical Fitness click
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {/* Icon to download Medical Fitness Certificate */}
                          <IconButton
                            sx={{
                              // position: "absolute",
                              // bottom: 8,
                              // right: 8,
                              // backgroundColor: "white",
                              marginLeft: 1,
                            }}
                            onClick={handleDownloadMedical} // Update to handle Medical Fitness download
                          >
                            <DownloadIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Typography
                          sx={{
                            padding: 1,
                            color: "#000",
                          }}
                        >
                          N/A
                        </Typography>
                      )}
                    </Box>

                    {/* Medical Fitness Certificate Preview Dialog */}
                    <Dialog
                      open={openMedical} // State for Medical Fitness dialog
                      onClose={handleCloseMedical} // Handle close for Medical Fitness
                      maxWidth="md"
                      fullWidth
                    >
                      <DialogContent>
                        <IconButton
                          edge="end"
                          color="inherit"
                          onClick={handleCloseMedical} // Handle close for Medical Fitness
                          aria-label="close"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                        {isPdf(drawerDetails.medical_fitness_certificate) ? (
                          <iframe
                            src={drawerDetails.medical_fitness_certificate.replace(
                              "/private",
                              ""
                            )}
                            title="Medical Fitness Certificate PDF"
                            width="100%"
                            height="600px"
                          />
                        ) : (
                          <Box
                            component="img"
                            src={drawerDetails.medical_fitness_certificate.replace(
                              "/private",
                              ""
                            )}
                            alt="Medical Fitness Certificate"
                            sx={{
                              maxWidth: "100%",
                              height: "auto",
                              objectFit: "contain",
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </Grid>
                </Grid>
                <Box>
                  <Typography
                    onClick={() => {
                      setEdit(false);
                      setDriverDetails(true);
                      setTable(false);
                      handleCloseDrawer();
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    Edit
                  </Typography>
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default Driver;
