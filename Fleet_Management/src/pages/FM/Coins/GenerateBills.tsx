import React, { useState, useEffect, useMemo } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  IconButton,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeUpdateDoc,
  useFrappeCreateDoc,
  useFrappeGetCall,
} from "frappe-react-sdk";
import { CFormSelect } from "@coreui/react";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";
import RemoveIcon from "@mui/icons-material/Remove";
import { width } from "@mui/system";
interface GenerateBillsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const GenerateBills: React.FC<GenerateBillsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [travelData, setTravelData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);
  const [activeLog, setActiveLog] = useState("bookRide");
  // States for pagination
  const [currentPage, setCurrentPage] = useState(1); // Start from the first page
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default items per page

  const [tableDataLength, setTableDataLength] = useState<number>(0);
  //Doctype name and Document name
  const [doctypeName, setDoctypeName] = useState("");
  const [documentName, setDocumentName] = useState("");
  // Bills table
  const [rows, setRows] = useState([
    { parameter: "", costPerQty: "", totalQty: "", coins: "" }, // Initial row
  ]);

  const handleAddRow = () => {
    setRows([
      ...rows,
      { parameter: "", costPerQty: "", totalQty: "", coins: "" }, // New row
    ]);
  };
  const [isGenerateBillEnabled, setIsGenerateBillEnabled] = useState(false);
  // Function to check if at least one row has been filled
  const validateRows = () => {
    return rows.some(
      (row) =>
        row.parameter.trim() !== "" ||
        row.costPerQty.trim() !== "" ||
        row.totalQty.trim() !== ""
    );
  };

  // Effect to enable or disable the Generate Bill button
  useEffect(() => {
    const isValid = validateRows();
    setIsGenerateBillEnabled(isValid);
  }, [rows]);
  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request ID";
    }
  }, []);
  //api
  // Fetch the total count of documents
  const { data: totalCountData, isLoading: isLoadingTotalCount } =
    useFrappeGetDocList("FM_Request_Master", {
      fields: ["name"], // Fetching just the name to get count
      filters: [["ride_status", "=", "Completed"]],
      limit: 0, // No pagination here, only count
    });

  useEffect(() => {
    if (totalCountData) {
      setTableDataLength(totalCountData.length);
    }
  }, [totalCountData]);
  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      filters: [["ride_status", "=", "Completed"]],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: itemsPerPage,
      start: (currentPage - 1) * itemsPerPage,
    }
  );

  // Set table data when the fetched data changes
  useEffect(() => {
    if (FM_Request_Master) {
      setTableData(FM_Request_Master);
    }
  }, [FM_Request_Master, currentPage, itemsPerPage]);

  const { data: specificData, isLoading: specificDataloading } =
    useFrappeGetDocList(doctypeName, {
      fields: ["*"],
      filters: [["name", "=", documentName]],
      orderBy: {
        field: "modified",
        order: "desc",
      },
      limit: 1,
    });

  // Set table data when the fetched data changes
  useEffect(() => {
    if (specificData && specificData.length > 0) {
      setDrawerData(specificData[0]); // Set the first item from the fetched data
    }
  }, [specificData]);
  // get call
  const { data: Travel_route } = useFrappeGetCall(
    "fleet_management.custom_function.get_all_travel_route_reports"
    // {
    //   fields: ["*"],
    //   orderBy: {
    //     field: "modified",
    //     order: "desc",
    //   },
    //   limit: 10000,
    // }
  );

  useEffect(() => {
    if (Travel_route) {
      setTravelData(Travel_route);
    }
  }, [Travel_route]);

  // console.log("api", travelData);
  // Handle drawer toggle
  const toggleDrawer = (open: boolean) => {
    setIsOpen(open);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  // Columns definition for the table
  const BookedRidescolumns = [
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
      key: "employee_name",
      label: "Request By",
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
      label: "Project Name ",
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
      key: "type",
      label: "Type of Service",
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
        width: "15%",
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
  const TravelRoutesColumns = [
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
      key: "date_time",
      label: "Travel Date",
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
      key: "route_id",
      label: "Route ID",
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
      key: "start_point",
      label: "Start Point",
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
      key: "end_point",
      label: "End Point",
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
      key: "total_employees",
      label: "Total Employees",
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
      key: "present_count",
      label: "Present Count",
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

  const [columns, setColumns] = useState(BookedRidescolumns);

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
    setDoctypeName(item.doctypename);
    setDocumentName(item.name);
  };

  const totalBillAmount = tableData.reduce(
    (acc, item) => acc + parseFloat(item.bill_amount || 0),
    0
  );
  //handle change
  const handleCancel = () => {
    toggleDrawer(false);
    setRows([{ parameter: "", costPerQty: "", totalQty: "", coins: "" }]); // Reset rows
  };

  const { createDoc } = useFrappeCreateDoc();
  // const { updateDoc, loading, error } = useFrappeUpdateDoc();

  const CreateBillRequest = async () => {
    try {
      // Step 1: Create Parent Document
      let parentBody;

      if (activeLog === "travelRoute") {
        parentBody = {
          date_time: drawerDetails.date_time,
          route_id: drawerDetails.route_id,
          start_point: drawerDetails.start_point,
          end_point: drawerDetails.end_point,
          total_employees: drawerDetails.total_employees,
          present_count: drawerDetails.present_count,
          doctypename: "FM_Bills",
          doctype_name: "FM_Travel_Route_Report",
          request_id: drawerDetails.name,
          total_amount: totalCost.toFixed(2),
        };
      } else {
        parentBody = {
          request_id: drawerData.name,
          requested_by: drawerData.employee_name,
          type: drawerData.type,
          service_type: drawerData.allotment,
          doctypename: "FM_Bills",
          requested_email_id: userEmailId,
          pro_dept_name: drawerData.project_name,
          doctype_name: drawerDetails.doctypename,
          total_amount: totalCost.toFixed(2),
        };
      }

      // Create the parent document and get its name (or ID)
      const parentResponse = await createDoc("FM_Bills", parentBody);
      const parentName = parentResponse?.name; // Adjust according to the API response

      if (!parentName) {
        throw new Error("Failed to create parent document.");
      }

      // // Step 2: Conditionally update the document if activeLog is "travelRoute"
      // if (activeLog === "travelRoute") {
      //   const updateData = { total_amount: totalCost.toFixed(2) };
      //   await updateDoc("FM_Travel_Route_Report", drawerData.name, updateData);
      // }

      // Step 3: Create Child Documents
      const childCreationPromises = rows.map((row) => {
        const childBody = {
          parent: parentName,
          parentfield: "bill_details",
          parenttype: "FM_Bills",
          parameter: row.parameter,
          cost_per_qty: row.costPerQty,
          total_quantity: row.totalQty,
          coins: row.coins,
        };

        return createDoc("FM_Bill_Parameters", childBody);
      });

      // Await all child document creation promises
      await Promise.all(childCreationPromises);

      // If all tasks (parent, update, and children) are completed successfully
      toast.success("Request Created Successfully");
      handleCancel();
    } catch (error) {
      console.log("Error creating", error);
      // Unified error handling logic
      if (error?.response) {
        const statusCode = error.response.status;
        const serverMessage = error.response.data?._server_messages;

        if (statusCode === 400) {
          toast.error("Bad request. Please check your input.");
        } else if (statusCode === 401) {
          toast.error("Unauthorized. Please log in.");
        } else if (statusCode === 404) {
          toast.error("Resource not found.");
        } else if (statusCode === 500) {
          toast.error("Internal server error. Please try again later.");
        } else if (serverMessage) {
          const parsedMessages = JSON.parse(serverMessage);
          const errorMessage = parsedMessages
            .map((msg) => JSON.parse(msg).message)
            .join(", ");
          toast.error(errorMessage);
        } else {
          toast.error(`Error: ${statusCode}`);
        }
      } else if (error?.request) {
        toast.error(
          "No response received from server. Please try again later."
        );
      } else if (error?.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
    }
  };

  const [expanded, setExpanded] = useState("request-details");
  // Calculate total cost
  const totalCost = useMemo(() => {
    return rows.reduce((sum, row) => {
      const costPerQty = parseFloat(row.costPerQty) || 0;
      const totalQty = parseFloat(row.totalQty) || 0;
      return sum + costPerQty * totalQty;
    }, 0);
  }, [rows]);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const handleLogClick = (logType) => {
    setActiveLog(logType);
    if (logType === "bookRide") {
      // setDoctypeName("FM_Fine_Log");
      setColumns(BookedRidescolumns);
    } else if (logType === "travelRoute") {
      // setDoctypeName("FM_Fuel_Log");
      setColumns(TravelRoutesColumns);
      // setTableData(travelData || []);
    }
    // Add more conditions if you have other log types
  };
  // Function to handle change in items per page
  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = parseInt(event.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  // Function to handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  // const tableDataLength = tableData.length;
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
        Generate Bills
      </Box>

      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          padding: "15px",
        }}
      >
        <Box sx={{ padding: "20px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "flex-start" },
              gap: "20px",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#DAEAEA",
                padding: "20px",
                borderRadius: "8px",
                borderTop: "4px solid #5A6868",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                // minWidth: "100px",
                width: "35%",
              }}
            >
              <Typography
                sx={{
                  color: "#5A6868",
                  fontSize: { xs: "14px", md: "16px" },

                  textAlign: "center",
                }}
              >
                Bills To Be Generated
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <DirectionsCarFilledIcon
                  sx={{ color: "#5A6868", marginRight: "8px" }}
                />
                <Typography
                  sx={{
                    fontSize: { xs: "24px", md: "32px" },

                    color: "#5A6868",
                  }}
                >
                  {tableDataLength}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flex: 1, padding: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: "10px",
                }}
              >
                {["bookRide", "travelRoute"].map((logType) => (
                  <Typography
                    key={logType}
                    onClick={() => handleLogClick(logType)}
                    sx={{
                      backgroundColor:
                        activeLog === logType ? "#E5F3E6" : "#f5f5f5",
                      cursor: "pointer",
                      padding: "16px",
                      borderRadius: "8px 8px 0 0",
                      flex: 1,
                      textAlign: "center",
                      fontSize: { xs: "14px", md: "16px" },
                      fontWeight: 600,
                      color: activeLog === logType ? "#375d33" : "#A1A1A1",
                      borderBottom:
                        activeLog === logType
                          ? "2px solid #487644"
                          : "2px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          activeLog === logType ? "#E5F3E6" : "#e0e0e0",
                      },
                    }}
                  >
                    {logType === "bookRide" ? "Booked Rides" : "Travel Route"}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* {JSON.stringify(
          activeLog === "bookRide" ? tableData : travelData.message
        )} */}

        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={
            activeLog === "bookRide"
              ? tableData // Show tableData when activeLog is "bookRide"
              : travelData?.message || [] // Fallback to travelData.message if available, or an empty array
          }
          itemsPerPage={itemsPerPage} // Current items per page
          activePage={currentPage} // Current page
          onActivePageChange={handlePageChange} // Handle page change
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
            S_no: (_item, index) => {
              return <td>{index + 1}</td>;
            },
            project_name: (item) => {
              return <td>{item?.project_name || "-"}</td>;
            },

            creation: (item) => {
              const date = new Date(item.creation);
              const formattedDate = `${date
                .getDate()
                .toString()
                .padStart(2, "0")}-${(date.getMonth() + 1)
                .toString()
                .padStart(2, "0")}-${date.getFullYear()}`;
              return <td>{formattedDate}</td>;
            },
            action: (item) => {
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
        <div
          style={{
            float: "right",
            display: "flex",
            justifyContent: "flex-end", // Corrected to 'flex-end' for alignment
            width: "15vw",
            alignItems: "center", // Added to align label and select vertically in the center
          }}
        >
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              marginRight: "18px",
              // padding: "10px 20px",
              // backgroundColor: "blue",
              // margin: "10px",
              // width: "10vw",
            }}
          >
            {" "}
            {/* Corrected style */}
            Items per page:
          </label>
          <Box
            sx={{
              width: "40%",
            }}
          >
            <CFormSelect
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              options={[
                { value: 5, label: "5" },
                { value: 10, label: "10" },
                { value: 20, label: "20" },
                { value: 30, label: "30" },
                { value: 50, label: "50" },
                { value: 100, label: "100" },
              ]}
            />
          </Box>
        </div>
      </div>
      {/* </div> */}
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
          "& .MuiAccordion-root.Mui-expanded": {
            margin: "16px 0",
            width: "auto",
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
                      Request Type -{" "}
                      {activeLog === "travelRoute"
                        ? "Travel Route"
                        : drawerDetails.type}{" "}
                    </Box>
                    <Button
                      className="closeX"
                      sx={{ color: darkMode ? "#d1d1d1" : "#5b5b5b" }}
                      onClick={handleCloseDrawer}
                    >
                      X
                    </Button>
                  </Box>
                  <br />
                  <br />
                  <Accordion
                    expanded={expanded === "request-details"}
                    onChange={handleChange("request-details")}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="request-details-content"
                      id="request-details-header"
                    >
                      <Typography>Request Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {drawerDetails.doctypename ===
                        "FM_Equipment_Vehicle_Request" && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                For
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.project_name || "N/A"}{" "}
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
                                Request Type
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.type || "N/A"}{" "}
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
                                Request Start Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.request_date_time || "N/A"}{" "}
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
                                From Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.from_location || "N/A"}
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
                                To Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.to_location || "N/A"}
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
                                Request Start Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.to_time || "N/A"}{" "}
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
                                Equipment type
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.equipment_type || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Ride
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.allotment || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Driver name
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.driver_name_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Vehicle Number
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.vehicle_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Purpose
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.purpose || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {drawerDetails.doctypename ===
                        "FM_Group_Vehicle_Request" && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                For
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.project_name || "N/A"}{" "}
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
                                Request Type
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.type || "N/A"}{" "}
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
                                No Of Passenger
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.passenger_count || "N/A"}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Ride
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.allotment || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Request Start Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
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
                                Request Start Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Driver name
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.driver_name_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Vehicle Number
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.vehicle_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Purpose
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.purpose || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {drawerDetails.doctypename ===
                        "FM_Passenger_Vehicle_Request" && (
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                For
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.project_name || "N/A"}{" "}
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
                                Request Type
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.type || "N/A"}{" "}
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
                                Request Start Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
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
                                Request Start Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
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
                                From Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.from_location || "N/A"}
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
                                To Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.to_location || "N/A"}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Ride
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.allotment || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Driver name
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.driver_name_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography sx={{ padding: 1, color: "#848484" }}>
                                Vehicle Number
                              </Typography>
                              <Typography sx={{ padding: 1, color: "#000" }}>
                                {drawerData.vehicle_no || "N/A"}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Purpose
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.purpose || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      {drawerDetails.doctypename ===
                        "FM_Goods_Vehicle_Request" && (
                        <>
                          <p>hisasa</p>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                For
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.project_name || "N/A"}{" "}
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
                                Request Type
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.type || "N/A"}{" "}
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
                                Category
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.category || "N/A"}{" "}
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
                                Request Start Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.request_date_time || "N/A"}{" "}
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
                                Request End Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
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
                                From Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.from_location || "N/A"}
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
                                To Location
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.to_location || "N/A"}
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
                                Request Start Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_start_time || "N/A"}{" "}
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
                                Request End Time
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerData.ride_end_time || "N/A"}{" "}
                                {/* Display the status or "N/A" if not available */}
                              </Typography>
                            </Grid>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Ride
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.allotment || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Driver name
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.driver_name_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography sx={{ padding: 1, color: "#848484" }}>
                              Vehicle Number
                            </Typography>
                            <Typography sx={{ padding: 1, color: "#000" }}>
                              {drawerData.vehicle_no || "N/A"}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#848484",
                              }}
                            >
                              Purpose
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.purpose || "N/A"}{" "}
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
                              Description
                            </Typography>
                            <Typography
                              sx={{
                                padding: 1,
                                color: "#000",
                              }}
                            >
                              {drawerData.description || "N/A"}{" "}
                              {/* Display the status or "N/A" if not available */}
                            </Typography>
                          </Grid>
                        </>
                      )}

                      {activeLog === "travelRoute" && (
                        <>
                          {/* {JSON.stringify(drawerDetails)} */}
                          <Grid container spacing={2}>
                            {/* Travel Date */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Travel Date
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.date_time
                                  ? new Date(
                                      drawerDetails.date_time
                                    ).toLocaleString()
                                  : "N/A"}
                                {/* Format the date and time or display "N/A" if not available */}
                              </Typography>
                            </Grid>

                            {/* Route ID */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Route ID
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.route_id || "N/A"}
                                {/* Display the route ID or "N/A" if not available */}
                              </Typography>
                            </Grid>

                            {/* Start Point */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Start Point
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.start_point || "N/A"}
                                {/* Display the start point or "N/A" if not available */}
                              </Typography>
                            </Grid>

                            {/* End Point */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                End Point
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.end_point || "N/A"}
                                {/* Display the end point or "N/A" if not available */}
                              </Typography>
                            </Grid>

                            {/* Total Employees */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                No of Request
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.total_employees !== undefined
                                  ? drawerDetails.total_employees
                                  : "N/A"}
                                {/* Display the total number of employees or "N/A" if not available */}
                              </Typography>
                            </Grid>

                            {/* Present Count */}
                            <Grid item xs={6}>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#848484",
                                }}
                              >
                                Present Count
                              </Typography>
                              <Typography
                                sx={{
                                  padding: 1,
                                  color: "#000",
                                }}
                              >
                                {drawerDetails.present_count !== undefined
                                  ? drawerDetails.present_count
                                  : "N/A"}
                                {/* Display the present count or "N/A" if not available */}
                              </Typography>
                            </Grid>
                          </Grid>
                        </>
                      )}
                    </AccordionDetails>
                  </Accordion>

                  <Accordion
                    expanded={expanded === "bills-details"}
                    onChange={handleChange("bills-details")}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="bills-details-content"
                      id="bills-details-header"
                    >
                      <Typography>Bills Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer
                        style={{
                          overflowX: "auto", // Enable horizontal scrolling
                          marginTop: 16, // Add space above the table
                          padding: "0 16px", // Add horizontal padding
                        }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Parameter</TableCell>
                              <TableCell>Cost per Qty</TableCell>
                              <TableCell>Total Qty</TableCell>
                              <TableCell>Coins</TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={handleAddRow}
                                  color="primary"
                                >
                                  <AddIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row, index) => {
                              const costPerQty =
                                parseFloat(row.costPerQty) || 0;
                              const totalQty = parseFloat(row.totalQty) || 0;
                              const coins = costPerQty * totalQty;

                              return (
                                <TableRow key={index}>
                                  <TableCell>
                                    <input
                                      type="text"
                                      value={row.parameter}
                                      onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].parameter =
                                          e.target.value;
                                        setRows(newRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      type="number"
                                      value={row.costPerQty}
                                      onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].costPerQty =
                                          e.target.value;
                                        // Recalculate coins based on updated costPerQty
                                        newRows[index].coins =
                                          parseFloat(e.target.value) *
                                          parseFloat(row.totalQty || 0);
                                        setRows(newRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      type="number"
                                      value={row.totalQty}
                                      onChange={(e) => {
                                        const newRows = [...rows];
                                        newRows[index].totalQty =
                                          e.target.value;
                                        // Recalculate coins based on updated totalQty
                                        newRows[index].coins =
                                          parseFloat(row.costPerQty || 0) *
                                          parseFloat(e.target.value);
                                        setRows(newRows);
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      type="number"
                                      value={coins}
                                      readOnly
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      color="error"
                                      onClick={() => {
                                        const newRows = rows.filter(
                                          (_, i) => i !== index
                                        );
                                        setRows(newRows);
                                      }}
                                    >
                                      <RemoveIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {rows.length > 0 && (
                        <Typography variant="h6" style={{ marginTop: 16 }}>
                          Total Cost: {totalCost.toFixed(2)}
                        </Typography>
                      )}
                    </AccordionDetails>
                  </Accordion>
                </div>
                <br />

                <Box display="flex" flexDirection="column" alignItems="center">
                  <Box sx={{ display: "flex" }}>
                    <Button className="cancelBtn" onClick={handleCancel}>
                      Cancel
                    </Button>

                    <Button
                      className="saveBtn"
                      disabled={!isGenerateBillEnabled}
                      onClick={CreateBillRequest}
                    >
                      Generate Bill
                    </Button>
                  </Box>
                </Box>
                {drawerDetails?.status === "Rejected" ||
                drawerDetails?.status === "Project Lead Rejected" ? (
                  <Box display="flex" flexDirection="column" alignItems="left">
                    <Box
                      width={{ xs: "100%", sm: "100%", md: "90%" }}
                      marginBottom="16px"
                      textAlign={"left"}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Reject Reason
                      </Typography>
                      <Typography variant="body1" sx={{ color: "red" }}>
                        {drawerDetails?.reason}
                      </Typography>
                    </Box>
                  </Box>
                ) : null}
                {drawerDetails.status === "Pending" && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  ></Box>
                )}
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default GenerateBills;
