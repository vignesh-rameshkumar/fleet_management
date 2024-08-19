import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import { useFrappeGetDocList, useFrappeUpdateDoc } from "frappe-react-sdk";
import Autocomplete from "@mui/material/Autocomplete";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { ThemeProvider, createTheme } from "@mui/material";

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
  const doctypeName = drawerDetails.doctypename;
  const documentName = drawerDetails.request_id;
  // Fetch specific data only if doctypeName and documentName are defined
  const { data: specificData, isLoading: isLoadingSpecific } =
    useFrappeGetDocList(doctypeName || "", {
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

  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };
  const handleCancel = () => {
    onCloseDrawer();
    setRideType("");
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
  const handleFromTimeChange = (time) => {
    if (dayjs(time).isValid()) {
      const formattedTime = dayjs(time).format("HH:mm:ss");
      setRideTime(formattedTime);
    } else {
      toast.error("Invalid time selected");
      setRideTime(null);
    }
  };
  const handleFromDateChange = (date) => {
    if (dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      setRideDate(formattedDate);
    } else {
      toast.error("Invalid date selected");
      setRideDate(null);
    }
  };
  const Changeride = (event) => {
    setRideType(event.target.value);
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
  const today = dayjs();
  const date_time = `${rideDate} ${rideTime}`;

  useEffect(() => {
    const today = dayjs().format("DD-MM-YYYY");
    setCurrentDate(today);
  }, []);
  useEffect(() => {
    if (drawerDetails) {
      setSelectedProject(drawerDetails.project_name || "");
      setRideType(drawerDetails.type || "");
      setFromLocation(drawerData[0]?.from_location || "");
      setToLocation(drawerData[0]?.to_location || "");
      setEquipment(drawerData[0]?.equipment || "");
      setFromTime(drawerData[0]?.from_time || "");
      setToTime(drawerData[0]?.to_time || "");
      setDescription(drawerData[0]?.description || "");
      // Parse the creation date and time
      const creationDateTime = drawerDetails.creation || null;

      if (creationDateTime) {
        // Assuming drawerDetails.creation is in the format "DD-MM-YYYY HH:mm:ss"
        const parsedDateTime = dayjs(creationDateTime, "DD-MM-YYYY HH:mm:ss");
        const datePart = parsedDateTime.isValid()
          ? parsedDateTime.format("DD-MM-YYYY")
          : null; // If the date is invalid, use null

        const timePart = parsedDateTime.isValid()
          ? parsedDateTime.format("HH:mm:ss")
          : null; // If the time is invalid, use null

        setRideDate(datePart);
        setRideTime(timePart);
      } else {
        setRideDate(null);
        setRideTime(null);
      }
      setTravelMore(drawerData[0]?.mod || "");
      setRideMoreDates(drawerData[0]?.mod_dates || []);
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
        // mod_dates: moreDates,
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
    mod_dates: any[]; // Adjust type as necessary
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
      // mod_dates: moreDates,
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
      await updateDoc(doctypeName, documentName, updateData);
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
                        {new Date(drawerDetails.creation).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        Request Time:
                      </Typography>
                      <Typography variant="body1">
                        {new Date(drawerDetails.creation).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    {doctypeName !== "FM_Equipment_Vehicle_Request" && (
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
                    {doctypeName === "FM_Equipment_Vehicle_Request" && (
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

                    {doctypeName === "FM_Goods_Vehicle_Request" && (
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
                        <MenuItem value="For Advisors">For Advisors</MenuItem>
                        <MenuItem value="Health Emergency">
                          Health Emergency
                        </MenuItem>
                        <MenuItem value="Others">Others</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
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
                  {doctypeName !== "FM_Equipment_Vehicle_Request" && (
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
                    textAlign={"center"}
                  >
                    <DatePicker
                      label={
                        <Typography>
                          Date <code className="CodeStar">*</code>
                        </Typography>
                      }
                      value={rideDate ? dayjs(rideDate, "DD-MM-YYYY") : null}
                      minDate={dayjs()}
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
                          error={!rideDate}
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
                          value={null} // value is reset to null for a new date selection
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
                          {rideMoreDates.length > 0 ? (
                            rideMoreDates.map((date, index) => (
                              <Chip
                                key={index}
                                label={dayjs(date).format("DD-MM-YYYY")}
                                onDelete={() => handleRemoveDate(date)}
                                sx={{
                                  margin: "2px",
                                  padding: "5px",
                                }}
                              />
                            ))
                          ) : (
                            <Typography>
                              No additional dates selected
                            </Typography>
                          )}
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
                      value={rideTime ? dayjs(rideTime, "HH:mm:ss") : null}
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
                      // d={
                      //   !rideType ||
                      //   !selectedProject ||
                      //   !fromLocation ||
                      //   !toLocation ||
                      //   !rideDate ||
                      //   !rideTime
                      // }
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
                  {doctypeName === "FM_Equipment_Vehicle_Request" && (
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
                <Button className="cancelBtn" onClick={handleCancel}>
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
