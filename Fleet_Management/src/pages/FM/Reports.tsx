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
} from "@mui/material";

import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeGetDoc,
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

interface ReportsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const Reports: React.FC<ReportsProps> = ({
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
  // State

  const [edit, setEdit] = useState<boolean>(false);
  const [rideDate, setRideDate] = useState<string | null>(null);
  const [rideTime, setRideTime] = useState<string | null>(null);
  const [doctypeNames, setDoctypeNames] = useState("");
  const [editedPassenger, setEditedPassenger] = useState({});
  // Fetching data
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [approvalDate, setApprovalDate] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState();

  const [approvalTime, setApprovalTime] = useState(null);
  const [selectedOption, setSelectedOption] = useState();
  const [internal, setInternal] = useState(false);
  const [external, setExternal] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [requestShow, setRequestShow] = useState(false);
  const [externalVehicleNo, setExternalVehicleNo] = useState("");
  const [externalDriverNo, setExternalDriverNo] = useState("");
  const [externalVehicleOTP, setExternalVehicleOTP] = useState("");

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
      key: "creation",
      label: "Date",
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
      key: "name",
      label: "Request ID",
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
      key: "type",
      label: "Request Type",
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
      key: "employee_name",
      label: "Employee Name",
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
      key: "project_name",
      label: "Project Name",
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

  const { updateDoc } = useFrappeUpdateDoc();

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
        Report Details
      </Box>
    </>
  );
};

export default Reports;
