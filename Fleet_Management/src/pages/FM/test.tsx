import React, { useState, useEffect } from "react";
import { CSmartTable } from "@coreui/react-pro";
import { Box, Drawer, TextField, Button, Typography } from "@mui/material";
import { useFrappeGetDocList } from "frappe-react-sdk";
import { createTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  MdOutlineVisibility,
  MdFilterList,
  MdOutlineModeEdit,
} from "react-icons/md";
import { toast } from "react-toastify";
interface LeaveTrackerHRAProps {
  darkMode: boolean;
  userEmailId: string;
}

const LeaveTrackerHR: React.FC<LeaveTrackerHRAProps> = ({
  darkMode,
  userEmailId,
}) => {
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [leaveData, setLeaveData] = useState<any[]>([]);
  const [employeeLeaveData, setEmployeeLeaveData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  // Fetch employee data
  const { data: Employee } = useFrappeGetDocList("Employee", {
    fields: ["*"],
    limit: 10000,
    orderBy: {
      field: "modified",
      order: "desc",
    },
  });

  useEffect(() => {
    if (Employee) {
      setEmployeeData(Employee);
    }
  }, [Employee]);

  // Fetch leave data based on empID and userEmailId
  const { data: PR_Leave_Request } = useFrappeGetDocList("PR_Leave_Request", {
    fields: ["*"],
    filters: [
      // ["reports_to", "=", empID],
      // ["useremailid", "!=", userEmailId],
      // ["status", "=", "Department Lead Approved"],
    ],
    orderBy: {
      field: "creation",
      order: "desc",
    },
    limit: 100000,
  });

  useEffect(() => {
    if (PR_Leave_Request) {
      setLeaveData(PR_Leave_Request);
    }
  }, [PR_Leave_Request]);

  // Calculate aggregated leave data
  useEffect(() => {
    if (leaveData.length > 0) {
      const aggregatedData: any = {};

      leaveData.forEach((item: any) => {
        const { employee_id, leave_type, no_of_days } = item;

        if (!aggregatedData[employee_id]) {
          aggregatedData[employee_id] = {
            CasualLeave: 0,
            SickLeave: 0,
          };
        }

        if (leave_type === "CasualLeave" && no_of_days) {
          aggregatedData[employee_id].CasualLeave += parseFloat(no_of_days);
        } else if (leave_type === "SickLeave" && no_of_days) {
          aggregatedData[employee_id].SickLeave += parseFloat(no_of_days);
        }
      });

      const aggregatedArray = Object.keys(aggregatedData).map((key) => ({
        employee_id: key,
        CasualLeave: aggregatedData[key].CasualLeave,
        SickLeave: aggregatedData[key].SickLeave,
      }));

      setEmployeeLeaveData(aggregatedArray);
    }
  }, [leaveData]);

  // Prepare data for CSmartTable
  useEffect(() => {
    if (employeeData.length > 0 && employeeLeaveData.length > 0) {
      const newData = employeeData.map((emp) => {
        const foundLeave = employeeLeaveData.find(
          (x) => x.employee_id === emp.name
        );
        const CasualLeave = foundLeave ? foundLeave.CasualLeave : 0;
        const SickLeave = foundLeave ? foundLeave.SickLeave : 0;
        const EarnedLeaves =
          Math.max(CasualLeave - 10, 0) + Math.max(SickLeave - 10, 0);

        let LOP = 0;

        if (CasualLeave > 10) {
          LOP += CasualLeave - 10;
        }
        if (SickLeave > 10) {
          LOP += SickLeave - 10;
        }

        return {
          name: emp.name,
          employee_name: emp.employee_name,
          CasualLeave: CasualLeave,
          SickLeave: SickLeave,
          LOP: LOP,
        };
      });

      setAllData(newData);
    }
  }, [employeeData, employeeLeaveData]);

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
      label: "Emp ID",
      _style: {
        width: "13%",
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
      label: " Emp Name",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "CasualLeave",
      label: "Causal Leave",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "SickLeave",
      label: "Sick Leave",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: true,
    },
    {
      key: "LOP",
      label: "LOP",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: false,
      colSpan: 2,
    },
    {
      key: "EarnedLeaves",
      label: "Earned Leaves",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",
      },
      filter: true,
      sorter: false,
    },
    {
      key: "CarryForward",
      label: "Carry Forward",
      _style: {
        width: "13%",
        fontSize: "14px",
        textAlign: "center",
        color: darkMode ? "#FFF" : "#222222",
        backgroundColor: darkMode ? "#4d8c52" : "#A5D0A9",

        borderTopRightRadius: "5px",
      },
      filter: true,
      sorter: false,
    },
  ];

  useEffect(() => {
    const filterInput = document.querySelector(".form-control");
    if (filterInput) {
      filterInput.placeholder = "Request Type";
    }
  }, []);
  return (
    <>
      <div
        style={{
          backgroundColor: darkMode ? "#222222" : "#fff",
          color: darkMode ? "#d1d1d1" : "#5b5b5b",
          padding: "15px",
          // animation: "slideFromLeft 1s ease forwards",
        }}
      >
        {/* {JSON.stringify(allData)} */}
        <CSmartTable
          cleaner
          clickableRows
          columns={columns}
          items={allData}
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
            employee_name: (item: any, index: number) => {
              return <td>{item.employee_name}</td>; // Corrected field name
            },

            LOP: (item: any) => {
              return <td>{item.LOP}</td>;
            },
            EarnedLeaves: (item: any, index: number) => {
              return <td>{item.CausalLeave === null ? "" : "-"}</td>;
            },

            CarryForward: (item: any, index: number) => {
              return <td>{item.CausalLeave === null ? "" : "-"}</td>;
            },
          }}
        />
      </div>
    </>
  );
};

export default LeaveTrackerHR;
