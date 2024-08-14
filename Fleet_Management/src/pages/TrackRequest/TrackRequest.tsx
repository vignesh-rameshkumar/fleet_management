import React, { useState, useEffect, useMemo } from "react";
import { CSmartTable } from "@coreui/react-pro";
import {
  Box,
  Drawer,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  CircularProgress,
  InputAdornment,
  IconButton,
  Checkbox,
} from "@mui/material";
import {
  MdOutlineVisibility,
  MdFilterList,
  MdOutlineModeEdit,
  MdDeleteForever,
} from "react-icons/md";
import {
  useFrappeGetDocList,
  useFrappeDeleteDoc,
  useFrappeUpdateDoc,
} from "frappe-react-sdk";
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
      // formatter: (item, rowIndex) => rowIndex + 1,
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

  // No Due API
  const { data: FM_Request_Master }: any = useFrappeGetDocList(
    "FM_Request_Master",
    {
      fields: ["*"],
      // filters: [["useremailid", "=", userEmailId]],

      orderBy: {
        field: "modified",
        order: "desc",
      },
    }
  );

  const [tableData, settableData] = useState(FM_Request_Master);

  useEffect(() => {
    settableData(FM_Request_Master);
  }, [FM_Request_Master]);

  return (
    <>
      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "#d1d1d1" : "#5b5b5b",
          padding: "15px",
        }}
      >
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
            S_no: (item: any, index: number) => {
              return <td>{index + 1}</td>;
            },
            project_name: (item: any, index: number) => {
              return <td>{item?.project_name ? item.project_name : "-"}</td>;
            },
            creation: (item, index) => {
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
                      // onClick={() => {
                      //   toggleDrawer(true, "visibility");
                      //   DataFun(item);
                      // }}
                    />
                  </div>

                  {/* <div className="editicon">
                    <MdOutlineModeEdit
                      size={20}
                      onClick={() => {
                        toast.warning("Edit Comming Soon");
                        DataFun(item);
                      }}
                    />
                  </div> */}
                  <div className="editicon">
                    {item.status.includes("Pending") ||
                    (item?.reports_to === "" &&
                      item?.status === "Project Lead Approved") ? (
                      <MdDeleteForever
                        size={20}
                        // onClick={() => handleClickOpen(item)}
                      />
                    ) : (
                      <MdDeleteForever
                        size={20}
                        className="deleteIcon"
                        // onClick={deleteFun}
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
  );
};

export default TrackRequest;
