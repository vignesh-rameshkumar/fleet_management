import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  Button,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { MdOutlineVisibility, MdDeleteForever } from "react-icons/md";
import { useFrappeGetDocList, useFrappeUpdateDoc } from "frappe-react-sdk";

interface DepartmentSpendsProps {
  darkMode: boolean;
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

const DepartmentSpends: React.FC<DepartmentSpendsProps> = ({
  darkMode,
  onCloseDrawer,
  userEmailId,
}) => {
  // State
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [drawerDetails, setDrawerDetails] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [drawerData, setDrawerData] = useState<any[]>([]);
  const [view, setView] = useState<boolean>(false);

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);

  const { data: FM_Request_Master, isLoading } = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      filters: [["owner", "=", userEmailId]],

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

  const handleCloseDrawer = () => {
    toggleDrawer(false);
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
      key: "bill_amount",
      label: "Coins Consumed",
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
      key: "payment_status",
      label: "Payment Status",
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

  // if (isLoading || isLoadingSpecific) {
  //   return (
  //     <Box
  //       sx={{
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         minHeight: "100vh",
  //       }}
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  const handleRowClick = (item: any) => {
    //setSelectedRowItem(item);
    toggleDrawer(true);
    setView(true);
    setDrawerDetails(item);
  };

  const totalcoinAmount = tableData.reduce(
    (acc, item) => acc + parseFloat(item.bill_amount || 0),
    0
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
        Department Spends
      </Box>

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
          }}
        >
          Coins Consumed : {totalcoinAmount}
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
            project_name: (item: any) => {
              return <td>{item?.project_name || "-"}</td>;
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
                      Request Type - {drawerDetails.type}
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
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Coins Consumed
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails?.bill_amount}
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
                        {drawerDetails?.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        Payment Status
                      </Typography>
                      <Typography variant="body1">
                        {drawerDetails.payment_status}
                      </Typography>
                    </Grid>

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
                  <br />
                  {drawerDetails?.status === "Rejected" ||
                  drawerDetails?.status === "Project Lead Rejected" ? (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="left"
                    >
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
                </div>
              </Box>
            </Box>
          </>
        )}
      </Drawer>
    </>
  );
};

export default DepartmentSpends;
