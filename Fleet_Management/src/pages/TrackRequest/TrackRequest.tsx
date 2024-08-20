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
import { MdAddCircle } from "react-icons/md";
import { MdClose } from "react-icons/md";
import ClearIcon from "@mui/icons-material/Clear";

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

interface TrackRequestProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const TrackRequest: React.FC<TrackRequestProps> = ({
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
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [rideType, setRideType] = useState("");
  const [rideTypegoods, setRideTypegoods] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const [selectedProject, setSelectedProject] = useState();
  const [rideDate, setRideDate] = useState<string | null>(null);
  const [rideTime, setRideTime] = useState<string | null>(null);
  const [currentdate, setCurrentDate] = useState(null);
  const [travelMore, setTravelMore] = useState(false);
  const [rideMoreDates, setRideMoreDates] = useState([]);
  const [terms, setTerms] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [equipment, setEquipment] = useState("");
  const [fromTime, setFromTime] = useState(null);
  const [toTime, setToTime] = useState(null);
  const [description, setDescription] = useState("");
  const [documentName, setDocumnetName] = useState("");
  const [doctypeNames, setDoctypeNames] = useState("");
  const [sections, setSections] = useState([]);
  const [isAddMoreChecked, setIsAddMoreChecked] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editedBreakPoint, setEditedBreakPoint] = useState({});
  const [addGoods, setAddGoods] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [filter, setFilter] = useState("");
  const [editedPassenger, setEditedPassenger] = useState({});
  // Fetching data

  const { data: RM_Project_Lead }: any = useFrappeGetDocList(
    "RM_Project_Lead",
    {
      fields: ["*"],
      filters: [["project_status", "=", "Active"]],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );
  const [projectName, setProjectName] = useState(RM_Project_Lead);
  useEffect(() => {
    setProjectName(RM_Project_Lead);
  }, [RM_Project_Lead]);
  // console.log("sections", sections);
  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Request_Master) {
      setTableData(FM_Request_Master);
    }
  }, [FM_Request_Master]);
  // Fetch specific data only if doctypeNames and documentName are defined
  const { data: specificData, isLoading: isLoadingSpecific } =
    useFrappeGetDocList(doctypeNames || "", {
      fields: ["*"],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      filters: documentName ? [["name", "=", documentName]] : [],
      limit: 1,
    });

  // Update drawer data when specific data changes
  useEffect(() => {
    if (specificData) {
      setDrawerData(specificData);
    }
  }, [specificData]);

  const { data: Employee }: any = useFrappeGetDocList("Employee", {
    fields: ["*"],
    filters: [["status", "=", "Active"]],
    limit: 100000,
    orderBy: {
      field: "modified",
      order: "desc",
    },
  });

  const [employeeName, setEmployeeName] = useState(Employee);

  useEffect(() => {
    setEmployeeName(Employee);
  }, [Employee]);
  const filteredEmployees = Employee?.filter(
    (employee) =>
      employee.name.toLowerCase().includes(filter.toLowerCase()) ||
      employee.employee_name.toLowerCase().includes(filter.toLowerCase())
  );
  // get child docytypes from group ride
  const { data: FM_Group_Vehicle_Request }: any = useFrappeGetDoc(
    doctypeNames,
    documentName
  );
  // Initialize state for group ride data
  const [groupRideData, setGroupRideData] = useState(FM_Group_Vehicle_Request);

  // Update groupRideData state when FM_Group_Vehicle_Request data changes
  useEffect(() => {
    if (FM_Group_Vehicle_Request) {
      setGroupRideData(FM_Group_Vehicle_Request);
    }
  }, [FM_Group_Vehicle_Request]);
  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };
  const handleCancel = () => {
    setRideType("");
    setRideTypegoods("");
    setFromLocation("");
    setToLocation("");
    setRideDate(null);
    setTravelMore(false);
    setTerms(false);
    setOpenModal(false);
    setRideTime(null);
  };
  const handleTermsChange = () => {
    setOpenModal(true);
  };
  const handleAgree = () => {
    setTerms(true);
    setOpenModal(false);
  };
  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };
  const handleAddSection = (event) => {
    const checked = event.target.checked;
    if (checked) {
      setSections([
        ...sections,
        { address: "", type: "", purpose: "", description: "" },
      ]);
    } else {
      setSections([]);
    }
    setIsAddMoreChecked(checked);
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };
  const handleClose = () => setAddGoods(false);

  const handleRemoveSection = (index) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
  };
  const handleSelectedEmployee = (event) => {
    const value = event.target.value;

    if (value?.length > passengerCount) {
      toast.warning(`Not Allowed - Because Passenger is ${passengerCount}`);
      return;
    }

    setSelectedEmployee(value);
  };
  const handleFromTimeChange = (time) => {
    if (dayjs(time).isValid()) {
      const formattedTime = dayjs(time).format("HH:mm:ss");
      setRideTime(formattedTime);
    } else {
      toast.error("Invalid time selected");
      setRideTime(null);
    }
  };
  const handleToTimeChange = (time) => {
    if (dayjs(time).isValid()) {
      const formattedTime = dayjs(time).format("HH:mm:ss");
      setToTime(formattedTime);
    } else {
      toast.error("Invalid time selected");
      setToTime(null);
    }
  };

  const handleFromDateChange = (date) => {
    if (date && dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      setRideDate(formattedDate); // Set the valid date
    } else {
      setRideDate(null); // Clear the date if invalid
    }
  };
  const handleEditClick = (index, breakPoint) => {
    setEditIndex(index);
    setEditedBreakPoint(breakPoint);
  };
  const handleEditClickGroupRide = (index, passenger) => {
    setEditIndex(index);
    setEditedPassenger({
      ...passenger,
      name: passenger.name,
    });
  };

  const handleSaveClick = async () => {
    // console.log("EditedData:", editedBreakPoint);

    try {
      await handleGroupRideData(editedBreakPoint);
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }

    setEditIndex(null);
  };
  const handleSaveClickGroupRide = async () => {
    // console.log("EditedData:", editedPassenger);

    try {
      await handleGroupRideDataPassenger(editedPassenger);
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }

    setEditIndex(null);
  };

  const handleInputChange = (e, field) => {
    setEditedBreakPoint({
      ...editedBreakPoint,
      [field]: e.target.value,
    });
  };
  const handleInputChangeGroupRide = (e, field) => {
    setEditedPassenger({
      ...editedPassenger,
      [field]: e.target.value,
    });
  };
  const Changeride = (event) => {
    setRideType(event.target.value);
  };

  const changeRideGoods = (event) => {
    setRideTypegoods(event.target.value);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };
  const handleTravelMoreChange = () => {
    setTravelMore((prevState) => !prevState);
    setRideMoreDates([]);
  };
  const handleToLocationChange = (event, newValue) => {
    if (newValue === fromLocation) {
      toast.warning("The From and To locations cannot be the same.");
      setToLocation("");
    } else {
      setToLocation(newValue);
    }
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleIncrement = () => {
    setSelectedEmployee([]);
    setPassengerCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    setSelectedEmployee([]);
    if (passengerCount > 1) {
      setPassengerCount((prevCount) => prevCount - 1);
    }
  };
  const handleMoreDateChange = (date) => {
    if (dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      if (!rideMoreDates.includes(formattedDate)) {
        setRideMoreDates([...rideMoreDates, formattedDate]);
      } else {
        toast.warning("Date already selected");
      }
    } else {
      toast.warning("Invalid date selected");
    }
  };
  const handleGroupRideData = async () => {
    // Check if editedBreakPoint has data and name is available
    if (!editedBreakPoint || !editedBreakPoint.name) {
      console.error("Error: No edited data available or missing 'name' field");
      return;
    }

    const childDocument = {
      parent: documentName,
      parentfield: "break_points",
      parenttype: "FM_Goods_Vehicle_Request",
      ...editedBreakPoint, // Spread the properties from the editedBreakPoint state
    };

    try {
      // Update the document based on the name in editedBreakPoint
      await updateDoc(
        "FM_Goods_Breakpoints",
        editedBreakPoint.name,
        childDocument
      );
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };
  const handleGroupRideDataPassenger = async () => {
    // Check if editedPassenger has data and name is available
    if (!editedPassenger || !editedPassenger.name) {
      // console.error("Error: No edited data available or missing 'name' field");
      return;
    }

    const childDocument = {
      parent: documentName,
      parentfield: "passenger_details",
      parenttype: "FM_Group_Vehicle_Request",
      ...editedPassenger, // Spread the properties from the editedPassenger state
    };

    try {
      // Update the document based on the name in editedPassenger
      await updateDoc(
        "FM_Group_Ride_Members",
        editedPassenger.name,
        childDocument
      );
      toast.success("Document updated successfully");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setRideMoreDates(rideMoreDates.filter((date) => date !== dateToRemove));
  };
  const today = dayjs();
  const date_time = `${rideDate} ${rideTime}`;

  useEffect(() => {
    const today = dayjs().format("DD-MM-YYYY");
    setCurrentDate(today);
  }, []);
  const moreDates = rideMoreDates.join(",");

  useEffect(() => {
    if (drawerDetails) {
      setSelectedProject(drawerDetails.project_name || "");
      setRideType(drawerDetails.type || "");
      setRideTypegoods(drawerDetails.type || "");
      setFromLocation(drawerData[0]?.from_location || "");
      setToLocation(drawerData[0]?.to_location || "");
      setEquipment(drawerData[0]?.equipment || "");
      setFromTime(drawerData[0]?.from_time || "");
      setToTime(drawerData[0]?.to_time || "");
      setDescription(drawerData[0]?.description || "");
      setDocumnetName(drawerDetails?.request_id || null);
      setDoctypeNames(drawerDetails?.doctypename || null);
      // Parse the creation date and time
      const requestDateTime = drawerData[0]?.request_date_time || null;
      if (requestDateTime) {
        const [datePart, timePart] = requestDateTime.split(" ");
        setRideDate(datePart || null); // Set the date part
        setRideTime(timePart || null); // Set the time part
      } else {
        setRideDate(null); // Clear if no date available
        setRideTime(null); // Clear if no time available
      }
      setTravelMore(drawerData[0]?.mod || "");
      // setRideMoreDates(drawerData[0]?.mod_dates || []);
      setPurpose(drawerData[0]?.purpose);
      setInitialValues({
        type: rideType,
        project_name: selectedProject,
        from_location: fromLocation,
        to_location: toLocation,
        terms: terms,
        employee_email: userEmailId,
        employee_name: userName,
        request_date_time: date_time,
        mod: travelMore,
        mod_dates: moreDates,
        purpose: purpose,
        // date: datePart,
        // time: timePart
      });
    }
  }, [drawerDetails, drawerData]);
  //update
  const { updateDoc, loading, error } = useFrappeUpdateDoc();
  // Define the type for your state values
  interface StateValues {
    type: string;
    project_name: string | undefined;
    from_location: string;
    to_location: string;
    terms: boolean;
    employee_email: string;
    employee_name: string;
    request_date_time: string | null;
    mod: boolean;
    mod_dates: string;
    purpose: string;
    date: string | null;
    time: string | null;
  }

  function getChangedFields(
    currentValues: StateValues,
    initialValues: StateValues
  ): Partial<StateValues> {
    return Object.keys(currentValues).reduce((acc, key) => {
      const typedKey = key as keyof StateValues;
      if (currentValues[typedKey] !== initialValues[typedKey]) {
        acc[typedKey] = currentValues[typedKey];
      }
      return acc;
    }, {} as Partial<StateValues>);
  }

  // Assuming initialValues is also of type StateValues
  const handleUpdate = async (status: string) => {
    // Current values from the state
    const currentValues: StateValues = {
      type: rideType,
      project_name: selectedProject,
      from_location: fromLocation,
      to_location: toLocation,
      terms: terms,
      employee_email: userEmailId,
      employee_name: userName,
      request_date_time: date_time,
      mod: travelMore,
      mod_dates: moreDates,
      purpose: purpose,
      date: rideDate,
      time: rideTime,
      equipment_type: equipment,
      from_time: fromTime,
      to_time: toTime,
      description: description,
    };

    // Get changed fields
    const updateData = getChangedFields(currentValues, initialValues);

    // Add the status field to the update data
    updateData.status = status;

    // Check if there are any changes to update
    if (Object.keys(updateData).length === 1 && updateData.status === status) {
      toast.info("No changes detected.");
      return false;
    }

    try {
      await updateDoc(doctypeNames, documentName, updateData);
      toast.success("Updated successfully");
      // Optionally close the drawer or handle post-update logic
      return true;
    } catch (error) {
      toast.error("Failed to update data.");
      return false;
    }
  };

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
      key: "name",
      label: "Request ID",
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
      key: "creation",
      label: "Request Date",
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
        width: "20%",
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

  if (isLoading || isLoadingSpecific) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "#d1d1d1" : "#5b5b5b",
          padding: "15px",
        }}
      >
        {/* {JSON.stringify(drawerDetails)} */}
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
          tableBodyProps={{
            className: "align-middle tableData",
          }}
          scopedColumns={{
            S_no: (_item: any, index: number) => {
              return <td>{index + 1}</td>;
            },
            project_name: (item: any) => {
              return <td>{item?.project_name || "-"}</td>;
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
                        setEdit(false);
                        setDrawerDetails(item);
                      }}
                    />
                  </div>
                  <div className="editicon">
                    {item.status.includes("Pending") ||
                    (item?.reports_to === "" &&
                      item?.status === "Project Lead Approved") ? (
                      <MdDeleteForever size={20} />
                    ) : (
                      <MdDeleteForever size={20} className="deleteIcon" />
                    )}
                  </div>
                </td>
              );
            },
          }}
        />
      </div>
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
        {/* {JSON.stringify(drawerData)} */}
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
                      Request Type: {drawerDetails.type}
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Request Date:
                      </Typography>
                      <Typography variant="body1">
                        {drawerData[0]?.request_date_time
                          ? drawerData[0]?.request_date_time.split(" ")[0] // Extracts the date part
                          : "N/A"}{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Request Time:
                      </Typography>
                      <Typography variant="body1">
                        {drawerData[0]?.request_date_time
                          ? drawerData[0]?.request_date_time.split(" ")[1] // Extracts the time part
                          : "N/A"}{" "}
                      </Typography>
                    </Grid>
                    {doctypeNames !== "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            From Location:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_location || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            To Location:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_location || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    {doctypeNames === "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            From Time:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            To Time:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            Equipment Type:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.equipment_type || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Project Name:
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.project_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Purpose:
                      </Typography>
                      <Typography variant="body1">
                        {drawerData[0]?.purpose}
                      </Typography>
                    </Grid>

                    {/* Rest of your code */}
                    {doctypeNames === "FM_Group_Vehicle_Request" &&
                      groupRideData && (
                        <Box sx={{ padding: "30px" }}>
                          <Grid container spacing={2}>
                            {groupRideData.passenger_details &&
                              groupRideData.passenger_details.length > 0 &&
                              groupRideData.passenger_details.map(
                                (passenger, index) => (
                                  <Grid
                                    container
                                    spacing={8}
                                    key={index}
                                    sx={{ mb: 2 }}
                                  >
                                    <Grid item xs={12} sm={6}>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        Passenger Employee ID:
                                      </Typography>
                                      <Typography variant="body1">
                                        {passenger.employee_id}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: "bold" }}
                                      >
                                        Passenger Employee Name:
                                      </Typography>
                                      <Typography variant="body1">
                                        {passenger.employee_name}
                                      </Typography>
                                    </Grid>
                                  </Grid>
                                )
                              )}
                          </Grid>
                        </Box>
                      )}
                    {/* Rest of your code */}

                    {drawerData[0]?.mod === 1 && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            Travel More Than One Day Dates:
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{ color: "blue", fontStyle: "italic" }}
                          >
                            {drawerData[0]?.mod_dates.split(",").join(" | ")}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    {doctypeNames === "FM_Goods_Vehicle_Request" && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: "bold" }}
                          >
                            Description:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.description || "N/A"}
                          </Typography>
                        </Grid>
                        {groupRideData?.break_points &&
                          groupRideData.break_points.length > 0 &&
                          groupRideData.break_points.map(
                            (breakPoint, index) => (
                              <Box sx={{ padding: "34px" }}>
                                <Grid container spacing={10} key={index}>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Address:
                                    </Typography>
                                    <Typography variant="body1">
                                      {breakPoint.address || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Description:
                                    </Typography>
                                    <Typography variant="body1">
                                      {breakPoint.description || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Purpose:
                                    </Typography>
                                    <Typography variant="body1">
                                      {breakPoint.purpose || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: "bold" }}
                                    >
                                      Type:
                                    </Typography>
                                    <Typography variant="body1">
                                      {breakPoint.type || "N/A"}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            )
                          )}
                      </>
                    )}
                  </Grid>

                  {drawerDetails.status === "Pending" && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <Button
                        className="cancelBtn"
                        onClick={() => {
                          setEdit(true);
                          setView(false);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        className="deleteBtn"
                        onClick={() => handleUpdate("Delete")}
                        disabled={loading}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </Button>
                    </Box>
                  )}
                  {error && (
                    <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                      <Typography color="error">
                        {error.message || "An error occurred while updating."}
                      </Typography>
                    </Box>
                  )}
                </div>
              </Box>
            </Box>
          </>
        )}
        {edit && (
          <>
            <br />
            <br />
            <Box
              className="slideFromRight"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <ThemeProvider theme={ThemeColor}>
                  <Box
                    className="slideFromRight"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <FormControl
                      variant="outlined"
                      sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                    >
                      <InputLabel>
                        Select Project Name {""}
                        <Typography className="CodeStar" variant="Code">
                          *
                        </Typography>
                      </InputLabel>
                      <Select
                        value={selectedProject}
                        onChange={handleChange}
                        label={
                          <>
                            Select Project Name{""}
                            <Typography className="CodeStar" variant="Code">
                              *
                            </Typography>
                          </>
                        }
                      >
                        <MenuItem value="General">General</MenuItem>
                        {projectName?.map((project) => (
                          <MenuItem
                            key={project?.name}
                            value={project.project_name}
                          >
                            {project.project_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {doctypeNames === "FM_Passenger_Vehicle_Request" && (
                    <>
                      <Box
                        className="slideFromRight delay-1"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          variant="outlined"
                          sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                        >
                          <InputLabel>
                            Select Ride Type {""}
                            <Typography className="CodeStar" variant="Code">
                              *
                            </Typography>
                          </InputLabel>
                          <Select
                            value={rideType}
                            onChange={Changeride}
                            label={<> Select Ride Type {""}</>}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  textAlign: "left",
                                },
                              },
                            }}
                          >
                            <MenuItem value="Travel within Office">
                              Travel within Office
                            </MenuItem>
                            <MenuItem value="Vendor Site Visit">
                              Vendor Site Visit
                            </MenuItem>
                            <MenuItem value="For Advisors">
                              For Advisors
                            </MenuItem>
                            <MenuItem value="Health Emergency">
                              Health Emergency
                            </MenuItem>
                            <MenuItem value="Others">Others</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </>
                  )}
                  {doctypeNames === "FM_Goods_Vehicle_Request" && (
                    <>
                      <Box
                        className="slideFromRight delay-1"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        sx={{ display: "flex", justifyContent: "center" }}
                      >
                        <FormControl
                          variant="outlined"
                          sx={{ width: { xs: "100%", sm: "100%", md: "90%" } }}
                        >
                          <InputLabel>
                            Select Ride Type {""}
                            <Typography className="CodeStar" variant="Code">
                              *
                            </Typography>
                          </InputLabel>
                          <Select
                            value={rideTypegoods}
                            onChange={changeRideGoods}
                            label={<> Select Ride Type {""}</>}
                            MenuProps={{
                              PaperProps: {
                                sx: {
                                  textAlign: "left",
                                },
                              },
                            }}
                          >
                            <MenuItem value="Pickup">Pickup</MenuItem>
                            <MenuItem value="Drop">Drop</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </>
                  )}

                  <Box
                    className="slideFromRight delay-2"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    textAlign={"center"}
                    marginBottom="16px"
                  >
                    <Autocomplete
                      freeSolo
                      disableClearable
                      value={fromLocation}
                      onChange={(event, newValue) => {
                        setFromLocation(newValue);
                        setToLocation("");
                      }}
                      inputValue={fromLocation}
                      onInputChange={(event, newInputValue) => {
                        setFromLocation(newInputValue);
                        setToLocation("");
                      }}
                      options={["Research Park", "Thaiyur", "Shar"]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={
                            <>
                              Select From Location {""}
                              <Typography variant="code" className="CodeStar">
                                *
                              </Typography>
                            </>
                          }
                          variant="outlined"
                          sx={{
                            width: { xs: "100%", sm: "100%", md: "90%" },
                            textAlign: "left",
                          }}
                        />
                      )}
                    />
                  </Box>
                  {doctypeNames !== "FM_Equipment_Vehicle_Request" && (
                    <>
                      <Box
                        className="slideFromRight delay-2"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        textAlign={"center"}
                        marginBottom="16px"
                      >
                        <Autocomplete
                          freeSolo
                          disableClearable
                          value={toLocation}
                          onChange={(event, newValue) =>
                            handleToLocationChange(event, newValue)
                          }
                          inputValue={toLocation}
                          onInputChange={(event, newInputValue) =>
                            handleToLocationChange(event, newInputValue)
                          }
                          // d={!rideType || !selectedProject || !fromLocation}
                          options={["Research Park", "Thaiyur", "Shar"]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <>
                                  Select To Location {""}
                                  <Typography
                                    variant="code"
                                    className="CodeStar"
                                  >
                                    *
                                  </Typography>
                                </>
                              }
                              variant="outlined"
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "90%" },
                                textAlign: "left",
                              }}
                            />
                          )}
                        />
                      </Box>
                    </>
                  )}

                  <Box
                    className="slideFromRight delay-3"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign="center"
                  >
                    <DatePicker
                      label={
                        <Typography>
                          Date <code className="CodeStar">*</code>
                        </Typography>
                      }
                      // value={rideDate ? dayjs(rideDate, "DD-MM-YYYY") : null}
                      minDate={today}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      format="DD-MM-YYYY"
                      onChange={handleFromDateChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select Date"
                          error={!rideDate} // Shows error if rideDate is not set
                          helperText={!rideDate && "This field is required"} // Error message
                        />
                      )}
                    />
                  </Box>

                  <Box
                    className="slideFromRight delay-3"
                    sx={{
                      width: {
                        xs: "90%",
                        sm: "90%",
                        md: "90%",
                      },
                    }}
                    marginBottom="16px"
                  >
                    <FormGroup
                      row
                      sx={{ display: "flex", justifyContent: "left" }}
                    >
                      <FormControlLabel
                        sx={{ marginLeft: { sm: "25px" } }}
                        // d={!rideType || !selectedProject || !rideDate}
                        control={
                          <Checkbox
                            checked={travelMore}
                            onChange={handleTravelMoreChange}
                          />
                        }
                        label="Travel more than one day"
                      />
                    </FormGroup>
                  </Box>

                  {travelMore === true && (
                    <>
                      <Box
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        textAlign={"center"}
                      >
                        <DatePicker
                          label={
                            <Typography>
                              Select Date <code className="CodeStar">*</code>
                            </Typography>
                          }
                          value={null}
                          minDate={dayjs(rideDate, "DD-MM-YYYY")}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                          }}
                          format="DD-MM-YYYY"
                          onChange={handleMoreDateChange}
                          renderInput={(params) => (
                            <TextField {...params} variant="outlined" />
                          )}
                        />

                        <Box mt={2} className="slideFromRight">
                          {rideMoreDates?.map((date, index) => (
                            <Chip
                              key={index}
                              label={date}
                              onDelete={() => handleRemoveDate(date)}
                              sx={{
                                margin: "2px",
                                padding: "5px",
                              }}
                            />
                          ))}
                        </Box>
                      </Box>
                    </>
                  )}

                  <Box
                    className="slideFromRight delay-4"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign={"center"}
                  >
                    <TimePicker
                      label={
                        <>
                          Time{" "}
                          <Typography variant="code" className="CodeStar">
                            *
                          </Typography>
                        </>
                      }
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      // value={rideTime ? dayjs(rideTime, "HH:mm:ss") : null}
                      format="HH:mm:ss"
                      ampm={false}
                      onChange={handleFromTimeChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select Time"
                          error={!rideTime}
                        />
                      )}
                      adapter={AdapterDayjs}
                    />
                  </Box>

                  <Box
                    className="slideFromRight delay-5"
                    width={{ xs: "100%", sm: "100%", md: "90%" }}
                    marginBottom="16px"
                    textAlign={"center"}
                  >
                    <TextField
                      label={
                        <Typography>
                          Purpose <code className="CodeStar"> *</code>
                        </Typography>
                      }
                      multiline
                      rows={2}
                      variant="outlined"
                      value={purpose}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "100%",
                          md: "90%",
                        },
                      }}
                      onChange={(e) => {
                        setPurpose(e.target.value);
                      }}
                    />
                  </Box>
                  {doctypeNames === "FM_Group_Vehicle_Request" &&
                    groupRideData && (
                      <TableContainer
                        sx={{
                          width: "100%",
                          maxWidth: 584,
                          marginTop: "16px",
                          borderRadius: "2px",
                          overflowX: "auto",
                        }}
                      >
                        <Table
                          sx={{ minWidth: 550 }}
                          aria-label="passengers table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Passenger ID</TableCell>
                              <TableCell>Passenger Name</TableCell>
                              <TableCell>Document Name</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {groupRideData.passenger_details.map(
                              (passenger, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {editIndex === index ? (
                                      <Autocomplete
                                        options={filteredEmployees}
                                        getOptionLabel={(option) =>
                                          option.name || "N/A"
                                        }
                                        value={
                                          filteredEmployees.find(
                                            (emp) =>
                                              emp.name === editedPassenger.name
                                          ) || null
                                        }
                                        onInputChange={(event, newInputValue) =>
                                          setFilter(newInputValue)
                                        }
                                        onChange={(event, newValue) =>
                                          handleInputChangeGroupRide(
                                            {
                                              target: {
                                                value: newValue?.name || "",
                                              },
                                            },
                                            "employee_id"
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Employee ID"
                                          />
                                        )}
                                      />
                                    ) : (
                                      passenger.employee_id || "N/A"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editIndex === index ? (
                                      <Autocomplete
                                        options={filteredEmployees}
                                        getOptionLabel={(option) =>
                                          option.employee_name || "N/A"
                                        }
                                        value={
                                          filteredEmployees.find(
                                            (emp) =>
                                              emp.employee_name ===
                                              editedPassenger.employee_name
                                          ) || null
                                        }
                                        onInputChange={(event, newInputValue) =>
                                          setFilter(newInputValue)
                                        }
                                        onChange={(event, newValue) =>
                                          handleInputChangeGroupRide(
                                            {
                                              target: {
                                                value:
                                                  newValue?.employee_name || "",
                                              },
                                            },
                                            "employee_name"
                                          )
                                        }
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Employee Name"
                                          />
                                        )}
                                      />
                                    ) : (
                                      passenger.employee_name || "N/A"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {passenger.name || "N/A"}
                                  </TableCell>
                                  <TableCell align="right">
                                    {editIndex === index ? (
                                      <Button
                                        variant="contained"
                                        onClick={handleSaveClickGroupRide}
                                      >
                                        Save
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outlined"
                                        onClick={() =>
                                          handleEditClickGroupRide(
                                            index,
                                            passenger
                                          )
                                        }
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                  {doctypeNames === "FM_Goods_Vehicle_Request" && (
                    <>
                      <Box
                        className="slideFromRight delay-4"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        textAlign={"center"}
                        sx={{
                          margin: "0 auto",
                        }}
                      >
                        <TextField
                          label={
                            <Typography>
                              Description <code className="CodeStar"> *</code>
                            </Typography>
                          }
                          multiline
                          rows={3}
                          variant="outlined"
                          value={description}
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                          }}
                          onChange={(e) => {
                            setDescription(e.target.value);
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          marginBottom: 2,
                          marginLeft: "auto",
                        }}
                      >
                        <IconButton
                          aria-label="add"
                          sx={{ color: "primary.main" }}
                          onClick={() => setAddGoods(true)}
                        >
                          <MdAddCircle size={40} />
                        </IconButton>
                      </Box>
                      {groupRideData?.break_points &&
                        groupRideData.break_points.length > 0 && (
                          <TableContainer
                            sx={{
                              width: "100%",
                              maxWidth: 600,
                              marginTop: "16px",
                              borderRadius: "2px",
                              overflowX: "auto",
                            }}
                          >
                            <Table
                              sx={{ minWidth: 650 }}
                              aria-label="breakpoints table"
                            >
                              <TableHead>
                                <TableRow>
                                  <TableCell>Address</TableCell>
                                  <TableCell>Description</TableCell>
                                  <TableCell>Purpose</TableCell>
                                  <TableCell>Type</TableCell>
                                  <TableCell>Name</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {groupRideData.break_points.map(
                                  (breakPoint, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        {editIndex === index ? (
                                          <TextField
                                            value={editedBreakPoint.address}
                                            onChange={(e) =>
                                              handleInputChange(e, "address")
                                            }
                                          />
                                        ) : (
                                          breakPoint.address || "N/A"
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {editIndex === index ? (
                                          <TextField
                                            value={editedBreakPoint.description}
                                            onChange={(e) =>
                                              handleInputChange(
                                                e,
                                                "description"
                                              )
                                            }
                                          />
                                        ) : (
                                          breakPoint.description || "N/A"
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {editIndex === index ? (
                                          <TextField
                                            value={editedBreakPoint.purpose}
                                            onChange={(e) =>
                                              handleInputChange(e, "purpose")
                                            }
                                          />
                                        ) : (
                                          breakPoint.purpose || "N/A"
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {editIndex === index ? (
                                          <Select
                                            value={editedBreakPoint.type}
                                            onChange={(e) =>
                                              handleInputChange(e, "type")
                                            }
                                            fullWidth
                                          >
                                            <MenuItem value="Pickup">
                                              Pickup
                                            </MenuItem>
                                            <MenuItem value="Drop">
                                              Drop
                                            </MenuItem>
                                            <MenuItem value="Pickup & Drop">
                                              Pickup & Drop
                                            </MenuItem>
                                          </Select>
                                        ) : (
                                          breakPoint.type || "N/A"
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {/* Name Field - Read Only */}
                                        {breakPoint.name || "N/A"}
                                      </TableCell>
                                      <TableCell align="right">
                                        {editIndex === index ? (
                                          <Button
                                            variant="contained"
                                            onClick={handleSaveClick}
                                          >
                                            Save
                                          </Button>
                                        ) : (
                                          <Button
                                            variant="outlined"
                                            onClick={() =>
                                              handleEditClick(index, breakPoint)
                                            }
                                          >
                                            Edit
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        )}

                      {addGoods && (
                        <Dialog
                          open={addGoods}
                          onClose={() => setAddGoods(false)}
                          fullWidth
                          maxWidth="md"
                        >
                          <DialogTitle>
                            Add Breakpoints
                            <IconButton
                              aria-label="close"
                              onClick={handleAddSection}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                color: "grey.500",
                              }}
                            >
                              <MdClose size={24} />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent>
                            <Box
                              width="100%"
                              textAlign="center"
                              sx={{ margin: "0 auto" }}
                            >
                              {/* {JSON.stringify(sections)} */}
                              {sections.map((section, index) => (
                                <Box
                                  className="slideFromRight"
                                  key={index}
                                  sx={{ marginBottom: "16px" }}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    <Typography>
                                      Section : {index + 1}
                                    </Typography>
                                    <IconButton
                                      aria-label="delete"
                                      sx={{ color: "red" }}
                                      onClick={() => handleRemoveSection(index)}
                                    >
                                      <MdDeleteForever color="red" size={25} />
                                    </IconButton>
                                  </Box>

                                  <TextField
                                    label={
                                      <Typography>
                                        Address{" "}
                                        <code className="CodeStar"> *</code>
                                      </Typography>
                                    }
                                    variant="outlined"
                                    value={section.address}
                                    sx={{ width: "100%", marginBottom: "16px" }}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        index,
                                        "address",
                                        e.target.value
                                      )
                                    }
                                  />

                                  <FormControl
                                    variant="outlined"
                                    sx={{ width: "100%", marginBottom: "16px" }}
                                  >
                                    <InputLabel>
                                      Select Type{" "}
                                      <Typography
                                        className="CodeStar"
                                        variant="Code"
                                      >
                                        *
                                      </Typography>
                                    </InputLabel>
                                    <Select
                                      label={
                                        <Typography>
                                          Select Type{" "}
                                          <code className="CodeStar"> *</code>
                                        </Typography>
                                      }
                                      variant="outlined"
                                      value={section.type}
                                      onChange={(e) =>
                                        handleSectionChange(
                                          index,
                                          "type",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <MenuItem value="Pickup">Pickup</MenuItem>
                                      <MenuItem value="Drop">Drop</MenuItem>
                                      <MenuItem value="Pickup & Drop">
                                        Pickup & Drop
                                      </MenuItem>
                                    </Select>
                                  </FormControl>

                                  <TextField
                                    label={
                                      <Typography>
                                        Purpose{" "}
                                        <code className="CodeStar"> *</code>
                                      </Typography>
                                    }
                                    multiline
                                    rows={1}
                                    variant="outlined"
                                    value={section.purpose}
                                    sx={{ width: "100%", marginBottom: "16px" }}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        index,
                                        "purpose",
                                        e.target.value
                                      )
                                    }
                                  />

                                  <TextField
                                    label={
                                      <Typography>
                                        Description{" "}
                                        <code className="CodeStar"> *</code>
                                      </Typography>
                                    }
                                    multiline
                                    rows={1}
                                    variant="outlined"
                                    value={section.description}
                                    sx={{ width: "100%", marginBottom: "16px" }}
                                    onChange={(e) =>
                                      handleSectionChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />

                                  {/* "Add More Breakpoints" Checkbox */}
                                  {index === sections.length - 1 && (
                                    <FormGroup
                                      row
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <FormControlLabel
                                        control={
                                          <Checkbox
                                            onChange={handleAddSection}
                                          />
                                        }
                                        label="Add More Breakpoints"
                                      />
                                    </FormGroup>
                                  )}
                                </Box>
                              ))}
                            </Box>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose} color="primary">
                              Close
                            </Button>
                          </DialogActions>
                        </Dialog>
                      )}
                    </>
                  )}

                  {doctypeNames === "FM_Equipment_Vehicle_Request" && (
                    <>
                      <Box
                        className="slideFromRight delay-2"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        textAlign={"center"}
                      >
                        <TimePicker
                          label={
                            <>
                              From Time{" "}
                              <Typography variant="code" className="CodeStar">
                                *
                              </Typography>
                            </>
                          }
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                          }}
                          value={fromTime ? dayjs(fromTime, "HH:mm:ss") : null}
                          format="HH:mm:ss"
                          ampm={false}
                          onChange={handleFromTimeChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Time"
                              error={false}
                            />
                          )}
                          adapter={AdapterDayjs}
                        />
                      </Box>

                      <Box
                        className="slideFromRight delay-3"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        marginBottom="16px"
                        textAlign={"center"}
                      >
                        <TimePicker
                          label={
                            <>
                              To Time{" "}
                              <Typography variant="code" className="CodeStar">
                                *
                              </Typography>
                            </>
                          }
                          sx={{
                            width: {
                              xs: "100%",
                              sm: "100%",
                              md: "90%",
                            },
                          }}
                          value={toTime ? dayjs(toTime, "HH:mm:ss") : null}
                          format="HH:mm:ss"
                          ampm={false}
                          onChange={handleToTimeChange}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Time"
                              error={false}
                            />
                          )}
                          adapter={AdapterDayjs}
                        />
                      </Box>

                      <Box
                        className="slideFromRight delay-4"
                        width={{ xs: "100%", sm: "100%", md: "90%" }}
                        textAlign={"center"}
                        marginBottom="16px"
                      >
                        <Autocomplete
                          freeSolo
                          disableClearable
                          value={equipment}
                          onChange={(event, newValue) => {
                            setEquipment(newValue);
                          }}
                          inputValue={equipment}
                          onInputChange={(event, newInputValue) => {
                            setEquipment(newInputValue);
                          }}
                          options={["Crane"]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label={
                                <>
                                  Select Equipment {""}
                                  <Typography
                                    variant="code"
                                    className="CodeStar"
                                  >
                                    *
                                  </Typography>
                                </>
                              }
                              variant="outlined"
                              disabled={
                                !selectedProject ||
                                !rideDate ||
                                !fromTime ||
                                !toTime
                              }
                              sx={{
                                width: { xs: "100%", sm: "100%", md: "90%" },
                                textAlign: "left",
                              }}
                            />
                          )}
                        />
                      </Box>
                    </>
                  )}

                  <br />
                </ThemeProvider>
              </LocalizationProvider>
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Button
                  className="cancelBtn"
                  onClick={() => {
                    onCloseDrawer();
                    handleCancel();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  className="saveBtn"
                  onClick={() => {
                    handleUpdate();
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
  
};

export default TrackRequest;
