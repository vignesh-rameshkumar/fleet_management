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
// import RequestApprovalDL from "../DL/RequestApprovalDL";

interface RequestApprovalProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const RequestApproval: React.FC<RequestApprovalProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
  employeeID,
  userName,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [reasonshow, setReasonshow] = useState(false);
  const [rejectreason, setRejectReason] = useState("");
  const [btnshow, setBtnshow] = useState(false);

  const [selectedProject, setSelectedProject] = useState();
  const [rideDate, setRideDate] = useState<string | null>(null);
  const [rideTime, setRideTime] = useState<string | null>(null);
  const [currentdate, setCurrentDate] = useState(null);

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);
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
  // console.log("userEmailId", userEmailId);
  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      filters: [
        ["owner", "!=", userEmailId],
        ["reports_to", "=", userEmailId],
        ["status", "!=", "Delete"],
      ],
      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  useEffect(() => {
    if (FM_Request_Master) {
      setTableData(FM_Request_Master);
    }
  }, [FM_Request_Master]);

  const doctypeName = drawerDetails.doctypename;
  const documentName = drawerDetails.request_id;
  // Fetch specific data only if doctypeName and documentName are defined
  const { data: specificData } = useFrappeGetDocList(doctypeName || "", {
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

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setReasonshow(false);
    setBtnshow(true);
    setRejectReason("");
  };

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
  const [selectedRowItem, setSelectedRowItem] = useState(null);

  const handleRowClick = (item: any) => {
    // setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };

  const { updateDoc } = useFrappeUpdateDoc();

  const handleapprove = async () => {
    let doctypename = drawerDetails.doctypename;
    let id = drawerDetails.name;

    let updateData = {
      status: "Project Lead Approved",
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
      toggleDrawer(false);
    } catch (error) {
      toast.error(`Error Approved doc: ${error.message}`);
    }
  };

  // child doc Passenger Members
  const id = drawerDetails?.name;
  const doc = drawerDetails?.doctypename;
  const { data: FM_Group_Vehicle_Request }: any = useFrappeGetDoc(doc, id);

  const [groupRideData, setGroupRideData] = useState(FM_Group_Vehicle_Request);

  useEffect(() => {
    if (FM_Group_Vehicle_Request) {
      setGroupRideData(FM_Group_Vehicle_Request);
    }
  }, [FM_Group_Vehicle_Request]);

  // Reject Section
  const handleReject = async () => {
    let doctypename = drawerDetails.doctypename;
    let id = drawerDetails.name;
    let EmployeeName = drawerDetails.employee_name;

    let updateData = {
      status: "Project Lead Rejected",
      reason: rejectreason,
    };
    try {
      await updateDoc(doctypename, id, updateData);

      // Directly update the specific data arrays and concatenated data
      setTableData((prevAllData) => {
        return prevAllData.map((item) => {
          if (item.doctypename === doctypename && item.name === id) {
            return { ...item, ...updateData };
          }
          return item;
        });
      });

      toast.error(`${id} ${EmployeeName}  - Rejected `);
      handleCloseDrawer();
      setRejectReason("");
    } catch (error) {
      toast.error(`Error Approved doc: ${error.message}`);
    }
  };

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
        Request Approval
      </Box>

      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          padding: "15px",
        }}
      >
        {/* {JSON.stringify(tableData)} */}
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
            striped: false,
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
            status: (item: any) => {
              return (
                <td>
                  {/* <div
                    style={{
                      backgroundColor:
                        item.status === "Project Lead Approved"
                          ? "#a5d0a9"
                          : "",
                      padding: "6px 6px",
                      width:
                        item.status === "Project Lead Approved" ? "100px" : "",
                      borderRadius: "20px",
                      margin: "0 auto",
                    }}
                  > */}
                  {item?.status === "Project Lead Approved"
                    ? "Approved"
                    : item?.status}
                  {/* </div> */}
                </td>
              );
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
                        setBtnshow(true);
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
                      {drawerDetails.type} - Request
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
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Employee Name
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.employee_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Project Name
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.project_name}
                      </Typography>
                    </Grid>
                    {doctypeName !== "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            From Location
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_location || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            To Location
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_location || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Request Date
                      </Typography>
                      <Typography variant="body1">
                        {`${new Date(drawerDetails.creation)
                          .getDate()
                          .toString()
                          .padStart(2, "0")}-${(
                          new Date(drawerDetails.creation).getMonth() + 1
                        )
                          .toString()
                          .padStart(2, "0")}-${new Date(
                          drawerDetails.creation
                        ).getFullYear()}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Request Time
                      </Typography>
                      <Typography variant="body1">
                        {new Date(drawerDetails.creation).toLocaleTimeString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Ride Type
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.type}
                      </Typography>
                    </Grid>
                    {doctypeName === "FM_Group_Vehicle_Request" && (
                      <>
                        <Grid item xs={6}>
                          <Typography variant="body1">
                            Passenger Count
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {drawerData[0]?.passenger_count}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    {doctypeName === "FM_Equipment_Vehicle_Request" && (
                      <>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            From Time
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.from_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            To Time
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.to_time || "N/A"}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            Equipment Type:
                          </Typography>
                          <Typography variant="body1">
                            {drawerData[0]?.equipment_type || "N/A"}
                          </Typography>
                        </Grid>
                      </>
                    )}

                    {drawerData[0]?.mod === 1 && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
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
                    <Grid item xs={12}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Purpose
                      </Typography>
                      <Typography variant="body1">
                        {drawerData[0]?.purpose}
                      </Typography>
                    </Grid>
                    {doctypeName === "FM_Goods_Vehicle_Request" && (
                      <>
                        <Grid item xs={12}>
                          <Typography
                            variant="body1"
                            sx={{
                              fontWeight: 600,
                            }}
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
                    ></Box>
                  )}
                </div>
              </Box>
              {/* Group Ride */}
              {doctypeName === "FM_Group_Vehicle_Request" && groupRideData && (
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
                                Passenger Employee ID
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
                                Passenger Employee Name
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

              {/* Good*/}
              {doctypeName === "FM_Goods_Vehicle_Request" && (
                <>
                  {groupRideData?.break_points &&
                    groupRideData.break_points.length > 0 &&
                    // Sort the break_points array alphabetically by address
                    groupRideData.break_points
                      .sort((a, b) => a.address.localeCompare(b.address))
                      .map((breakPoint, index) => (
                        <Box
                          sx={{
                            padding: "5px 20px",
                          }}
                          key={index}
                        >
                          {/* Section Heading */}
                          <Typography
                            variant="h6"
                            sx={{
                              marginBottom: "10px",

                              fontWeight: 600,
                            }}
                          >
                            Breakpoints : {index + 1}
                          </Typography>

                          {/* Section Content */}
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1">Address</Typography>
                              <Typography variant="body1">
                                {breakPoint.address || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1">
                                Description
                              </Typography>
                              <Typography variant="body1">
                                {breakPoint.description || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1">Purpose</Typography>
                              <Typography variant="body1">
                                {breakPoint.purpose || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body1">Type</Typography>
                              <Typography variant="body1">
                                {breakPoint.type || "N/A"}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      ))}
                </>
              )}
            </Box>
          </>
        )}

        {/* Reject Section */}
        {drawerDetails.status === "Project Lead Rejected" ? (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              width={{ xs: "100%", sm: "100%", md: "90%" }}
              marginBottom="16px"
              textAlign={"left"}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                Reject Reason
              </Typography>
              <Typography variant="body1" sx={{ color: "red" }}>
                {drawerDetails.reason}
              </Typography>
            </Box>
          </Box>
        ) : null}
        {reasonshow && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box
              width={{ xs: "100%", sm: "100%", md: "90%" }}
              marginBottom="16px"
              textAlign={"center"}
            >
              <TextField
                label="Reason for Denial"
                value={rejectreason}
                multiline
                rows={3}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "90%",
                  },
                }}
                onChange={(e) => {
                  setRejectReason(e.target.value);
                }}
              />
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                className="cancelBtn"
                onClick={() => {
                  setReasonshow(false);
                  setRejectReason("");
                  setBtnshow(true);
                }}
              >
                Discard
              </Button>

              <Button
                className="saveBtn"
                disabled={!rejectreason}
                onClick={() => {
                  handleReject();

                  setReasonshow(false);
                }}
              >
                save
              </Button>
            </Box>
            {/* )} */}
          </Box>
        )}

        <br />

        {btnshow && (
          <>
            {drawerDetails.status === "Pending" && (
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box sx={{ display: "flex" }}>
                  <Button
                    className="deleteBtn"
                    onClick={() => {
                      setReasonshow(true);
                      setBtnshow(false);
                    }}
                  >
                    Reject
                  </Button>

                  <Button className="saveBtn" onClick={handleapprove}>
                    Approve
                  </Button>
                </Box>
              </Box>
            )}
          </>
        )}

        <br />
      </Drawer>
    </>
  );
};

export default RequestApproval;
