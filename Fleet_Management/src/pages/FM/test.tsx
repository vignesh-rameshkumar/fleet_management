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

  const [edit, setEdit] = useState<boolean>(false);
  const [rideDate, setRideDate] = useState<string | null>(null);
  const [rideTime, setRideTime] = useState<string | null>(null);
  const [documentName, setDocumnetName] = useState("");
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

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);

  const handleFromDateChange = (date) => {
    if (dayjs(date).isValid()) {
      const formattedDate = dayjs(date).format("DD-MM-YYYY");
      setApprovalDate(formattedDate);
    } else {
      toast.error("Invalid date selected");
      setApprovalDate(null);
    }
  };
  const handleFromTimeChange = (time) => {
    if (dayjs(time).isValid()) {
      const formattedTime = dayjs(time).format("HH:mm");
      setApprovalTime(formattedTime);
    } else {
      toast.error("Invalid time selected");
      setApprovalTime(null);
    }
  };
  const handleUpdateChange = () => {
    setEditShow(!editShow);
    setApprovalTime(null);
    setApprovalDate(null);
  };
  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setApprovalTime(null);
    setApprovalDate(null);
    setSelectedVehicle();
    setSelectedDriver();
    setSelectedOption();
    setInternal(false);
    setExternal(false);
    setEditShow(false);
    setExternalVehicleNo("");
    setExternalDriverNo("");
    setExternalVehicleOTP("");
  };
  // Vehicle API
  const { data: FM_Vehicle_Details }: any = useFrappeGetDocList(
    "FM_Vehicle_Details",
    {
      fields: ["*"],
      filters: [["status", "=", "Online"]],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [vehicleName, setVehicleName] = useState(FM_Vehicle_Details);

  useEffect(() => {
    setVehicleName(FM_Vehicle_Details);
  }, [FM_Vehicle_Details]);

  const handleVehicle = (event) => {
    setSelectedVehicle(event.target.value);
  };

  // Driver Details

  const { data: FM_Driver_Details }: any = useFrappeGetDocList(
    "FM_Driver_Details",
    {
      fields: ["*"],
      filters: [["status", "=", "Online"]],
      limit: 100000,
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [driverName, setdriverName] = useState(FM_Driver_Details);

  useEffect(() => {
    setdriverName(FM_Driver_Details);
  }, [FM_Driver_Details]);

  const [selectedDriver, setSelectedDriver] = useState();

  const handleDriver = (event) => {
    setSelectedDriver(event.target.value);
  };
  // Project API

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

  const [selectedProject, setSelectedProject] = useState();

  const handleChange = (event) => {
    setSelectedProject(event.target.value);
  };
  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      filters: [
        ["owner", "!=", userEmailId],
        ["status", "!=", "Cancelled"],
      ],
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
  const { data: specificData } = useFrappeGetDocList(doctypeName || "", {
    fields: ["*"],
    orderBy: {
      field: "modified",
      order: "desc",
    },
    filters: documentName ? [["name", "=", documentName]] : [],
    limit: 1,
  });

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

  const today = dayjs();

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

  if (isLoading) {
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

  //   New

  const [selectedRowItem, setSelectedRowItem] = useState(null);

  const handleRowClick = (item: any) => {
    // setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
    setSelectedOption("Internal");
    setInternal(true);
  };

  const { updateDoc } = useFrappeUpdateDoc();

  const Approvel_date_time = `${approvalDate} ${approvalTime}`;
  const Req_date_time = dayjs(drawerDetails.creation).format(
    "DD-MM-YYYY HH:mm"
  );

  // console.log("Req_date_time", Req_date_time);
  const handleapprove = async () => {
    let doctypename = drawerDetails.doctypename;
    let id = drawerDetails.name;

    let updateData = {
      status: "Approved",
      driver_name_no: selectedDriver ? selectedDriver : externalDriverNo,
      vehicle_no: selectedVehicle ? selectedVehicle : externalVehicleNo,
      allotment: selectedOption,
      otp: externalVehicleOTP,

      approved_date_time:
        approvalDate && approvalTime ? Approvel_date_time : Req_date_time,
    };

    try {
      await updateDoc(doctypename, id, updateData);
      setTableData((prevAllData) => {
        return prevAllData.map((item) => {
          if (item.doctypename === doctypename && item.name === id) {
            return { ...item, ...updateData };
          }
          return item;
        });
      });

      toast.success("Approved Successfully");

      handleCloseDrawer();
    } catch (error) {
      toast.error(`Error Approved doc: ${error.message}`);
    }
  };

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);

    if (event.target.value === "Internal") {
      handleInternalChange();
    } else {
      handleexternalChange();
    }
  };
  const handleInternalChange = () => {
    setExternal(false);
    setInternal(true);
    setExternalVehicleNo("");
    setExternalDriverNo("");
    setExternalVehicleOTP("");
  };

  const handleexternalChange = () => {
    setInternal(false);
    setExternal(true);
    setEditShow(false);
    setSelectedVehicle();
    setSelectedDriver();
  };

  const handleVehicleValidation = (e: any) => {
    const vehicleNo = e.target.value;
    const vehicleNoPattern = /^[A-Z0-9-]{0,10}$/; // Allow empty input and up to 10 characters
    setExternalVehicleNo(vehicleNo);
    if (vehicleNo && !vehicleNoPattern.test(vehicleNo)) {
      toast.warning(
        "Invalid vehicle number. Please enter a valid vehicle number (e.g., TN00AV1234)."
      );
    }
  };

  const handlePhoneNoValidation = (e: any) => {
    const phoneNo = e.target.value;
    if (phoneNo.length <= 10 && /^[0-9]*$/.test(phoneNo)) {
      setExternalDriverNo(phoneNo);
    }
    if (phoneNo.length === 10 && !/^[0-9]{10}$/.test(phoneNo)) {
      toast.warning(
        "Invalid Phone Number. Please enter a 10-digit phone number (e.g., 0123456789)."
      );
    }
  };

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
          onRowClick={(item) => handleRowClick(item)}
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
                      <Typography variant="body1">Request Date:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {drawerData[0]?.request_date_time
                          ? drawerData[0]?.request_date_time.split(" ")[0] // Extracts the date part
                          : "N/A"}{" "}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">Request Time:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {drawerData[0]?.request_date_time
                          ? drawerData[0]?.request_date_time.split(" ")[1] // Extracts the time part
                          : "N/A"}{" "}
                      </Typography>
                    </Grid>
                    {doctypeNames !== "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">
                            From Location:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.from_location || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">To Location:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.to_location || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    {doctypeNames === "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">From Time:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.from_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">To Time:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.to_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="body1">
                            Equipment Type:
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.equipment_type || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    <Grid item xs={12}>
                      <Typography variant="body1">Project Name:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {drawerDetails.project_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">Purpose:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
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
                                      <Typography variant="body1">
                                        Passenger Employee ID:
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {passenger.employee_id}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                      <Typography variant="body1">
                                        Passenger Employee Name:
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 600 }}
                                      >
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
                          <Typography variant="body1">
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
                          <Typography variant="body1">Description:</Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
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
                                    <Typography variant="body1">
                                      Address:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {breakPoint.address || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      Description:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {breakPoint.description || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                      Purpose:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
                                      {breakPoint.purpose || "N/A"}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Typography variant="body1">
                                      Type:
                                    </Typography>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 600 }}
                                    >
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

                  {/* Option  */}

                  <Box>
                    <ThemeProvider theme={ThemeColor}>
                      <Box>Select an Option</Box>
                      <Box>
                        {" "}
                        <RadioGroup
                          row
                          value={selectedOption}
                          onChange={handleOptionChange}
                        >
                          <FormControlLabel
                            sx={{ marginRight: { sm: "120px" } }}
                            value={"Internal"}
                            control={<Radio />}
                            label="Internal"
                            onClick={handleInternalChange}
                          />
                          <FormControlLabel
                            value={"External"}
                            control={<Radio />}
                            label="External"
                            onClick={handleexternalChange}
                          />
                        </RadioGroup>
                      </Box>
                      {internal && (
                        <>
                          <Box
                            sx={{
                              border: "1px solid #d1d1d1",
                              width: "90%",
                              margin: "0 auto",
                              padding: "10px 30px",
                              borderRadius: "5px",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box sx={{ color: "#383838", fontSize: "14px" }}>
                                <span>
                                  If the date and time are acceptable, approve
                                  it ,If changes are needed, use the edit option
                                </span>
                              </Box>
                              <Box>
                                <Button
                                  className="saveBtn"
                                  onClick={handleUpdateChange}
                                >
                                  Edit
                                </Button>
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <Box marginBottom="16px">
                                <Typography variant="body1">
                                  Start Date
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {`${new Date(drawerDetails.creation)
                                    .getDate()
                                    .toString()
                                    .padStart(2, "0")}-${(
                                    new Date(
                                      drawerDetails.creation
                                    ).getMonth() + 1
                                  )
                                    .toString()
                                    .padStart(2, "0")}-${new Date(
                                    drawerDetails.creation
                                  ).getFullYear()}`}
                                </Typography>
                              </Box>
                              <Box marginBottom="16px">
                                <Typography variant="body1">
                                  End Time
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {new Date(
                                    drawerDetails.creation
                                  ).toLocaleTimeString()}
                                </Typography>
                              </Box>
                            </Box>
                            {editShow && (
                              <>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    {" "}
                                    <Box
                                      width={{
                                        xs: "100%",
                                        sm: "100%",
                                        md: "90%",
                                      }}
                                      marginBottom="16px"
                                      textAlign={"center"}
                                    >
                                      <DatePicker
                                        label={
                                          <Typography>
                                            Select Start Date{" "}
                                            <code className="CodeStar">*</code>
                                          </Typography>
                                        }
                                        value={
                                          approvalDate
                                            ? dayjs(approvalDate, "DD-MM-YYYY")
                                            : null
                                        }
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
                                            placeholder=" Select Start Date"
                                            error={false}
                                          />
                                        )}
                                      />
                                    </Box>
                                    <Box
                                      width={{
                                        xs: "100%",
                                        sm: "100%",
                                        md: "90%",
                                      }}
                                      marginBottom="16px"
                                      textAlign={"center"}
                                    >
                                      <TimePicker
                                        label={
                                          <>
                                            Select Start Time{" "}
                                            <Typography
                                              variant="code"
                                              className="CodeStar"
                                            >
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
                                        value={
                                          approvalTime
                                            ? dayjs(approvalTime, "HH:mm")
                                            : null
                                        }
                                        format="HH:mm"
                                        ampm={false}
                                        onChange={handleFromTimeChange}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            placeholder=" Select Start Time"
                                            error={false}
                                          />
                                        )}
                                        adapter={AdapterDayjs}
                                      />
                                    </Box>
                                  </Box>
                                </LocalizationProvider>
                              </>
                            )}
                          </Box>
                          <br />
                          <Box
                            className={"Box"}
                            sx={{
                              gap: "10px",
                              margin: "0 auto",
                              width: {
                                xs: "90%",
                                sm: "90%",
                                md: "90%",
                              },
                            }}
                          >
                            <Box
                              width={{ xs: "100%", sm: "100%", md: "90%" }}
                              marginBottom="16px"
                            >
                              <FormControl
                                variant="outlined"
                                sx={{
                                  width: { xs: "100%", sm: "100%", md: "90%" },
                                }}
                              >
                                <InputLabel>
                                  Vehicle Assign{""}
                                  <Typography
                                    className="CodeStar"
                                    variant="Code"
                                  >
                                    *
                                  </Typography>
                                </InputLabel>
                                <Select
                                  value={selectedVehicle}
                                  onChange={handleVehicle}
                                  label={
                                    <>
                                      Select Vehicle{""}
                                      <Typography
                                        className="CodeStar"
                                        variant="Code"
                                      >
                                        *
                                      </Typography>
                                    </>
                                  }
                                >
                                  {vehicleName?.map((x) => (
                                    <MenuItem key={x?.name} value={x.name}>
                                      {x.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                            <Box
                              width={{ xs: "100%", sm: "100%", md: "90%" }}
                              marginBottom="16px"
                            >
                              <FormControl
                                variant="outlined"
                                sx={{
                                  width: { xs: "100%", sm: "100%", md: "90%" },
                                }}
                              >
                                <InputLabel>
                                  Driver Assign {""}
                                  <Typography
                                    className="CodeStar"
                                    variant="Code"
                                  >
                                    *
                                  </Typography>
                                </InputLabel>
                                <Select
                                  value={selectedDriver}
                                  onChange={handleDriver}
                                  label={
                                    <>
                                      Select Driver{""}
                                      <Typography
                                        className="CodeStar"
                                        variant="Code"
                                      >
                                        *
                                      </Typography>
                                    </>
                                  }
                                >
                                  {driverName?.map((x) => (
                                    <MenuItem
                                      key={x?.name}
                                      value={x.employee_name}
                                    >
                                      {x.employee_name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Box>
                          </Box>
                        </>
                      )}
                      {external && (
                        <>
                          <Box
                            sx={{
                              border: "1px solid #d1d1d1",
                              width: "90%",
                              margin: "0 auto",
                              padding: "10px 30px",
                              borderRadius: "5px",
                            }}
                          >
                            <Box sx={{ display: "flex" }}>
                              <Box>
                                <TextField
                                  label={
                                    <Typography>
                                      Vehicle Number{" "}
                                      <code className="CodeStar"> *</code>
                                    </Typography>
                                  }
                                  variant="outlined"
                                  value={externalVehicleNo}
                                  sx={{
                                    width: {
                                      xs: "100%",
                                      sm: "100%",
                                      md: "90%",
                                    },
                                  }}
                                  onChange={(e) => {
                                    handleVehicleValidation(e);
                                  }}
                                />
                              </Box>
                              <Box>
                                <TextField
                                  label={
                                    <Typography>
                                      Driver Phone Number{" "}
                                      <code className="CodeStar"> *</code>
                                    </Typography>
                                  }
                                  variant="outlined"
                                  value={externalDriverNo}
                                  sx={{
                                    width: {
                                      xs: "100%",
                                      sm: "100%",
                                      md: "90%",
                                    },
                                  }}
                                  onChange={(e) => {
                                    handlePhoneNoValidation(e);
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                width: {
                                  xs: "100%",
                                  sm: "100%",
                                  md: "47%",
                                },
                                marginTop: "16px",
                              }}
                            >
                              <TextField
                                label={
                                  <Typography>
                                    OTP <code className="CodeStar"> *</code>
                                  </Typography>
                                }
                                variant="outlined"
                                value={externalVehicleOTP}
                                sx={{
                                  width: {
                                    xs: "100%",
                                    sm: "100%",
                                    md: "90%",
                                  },
                                }}
                                onChange={(e) => {
                                  setExternalVehicleOTP(e.target.value);
                                }}
                              />
                            </Box>
                          </Box>
                        </>
                      )}
                    </ThemeProvider>
                  </Box>
                </div>
              </Box>
            </Box>
          </>
        )}
        {drawerDetails?.status === "Project Lead Approved" && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box sx={{ display: "flex" }}>
              <Button className="deleteBtn">Reject</Button>
              <Button
                className="saveBtn"
                disabled={
                  (selectedOption === "Internal" &&
                    (!selectedVehicle ||
                      !selectedDriver ||
                      (editShow === true &&
                        (!approvalDate || !approvalTime)))) ||
                  (selectedOption === "External" &&
                    (!externalVehicleOTP ||
                      !externalDriverNo ||
                      !externalVehicleNo))
                }
                onClick={handleapprove}
              >
                Approve
              </Button>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default TrackRequest;
