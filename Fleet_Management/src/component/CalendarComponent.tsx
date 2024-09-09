import React, { useState, useEffect } from "react";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import "./calendar.css";
import { useFrappeGetDocList, useFrappeGetCall } from "frappe-react-sdk";

// Define the type for an Event item
interface EventItem {
  startTime: Date;
  endTime: Date;
  title: string;
  employeeName: string;
  requestId: string;
}
interface CalendarProps {
  onCloseDrawer: () => void;
  userEmailId: string;
  employeeID: string;
  userName: string;
}

// Function to process the `overAllRequestData` into `EventItem`
function processRequestData(data: any[]): EventItem[] {
  return data.map((item) => {
    const creationDate = new Date(item.creation);
    // Assuming events last for 1 hour by default
    const endTime = new Date(creationDate.getTime() + 60 * 60 * 1000);

    return {
      startTime: creationDate,
      endTime: endTime,
      title: item.type,
      employeeName: item.employee_name,
      requestId: item.request_id,
    };
  });
}

// Function to get events for a specific date
function getEventsForDate(date: Date, events: EventItem[]): EventItem[] {
  return events.filter((event) => {
    const isSameDayAsStart =
      date.toDateString() === event.startTime.toDateString();
    const isSameDayAsEnd = date.toDateString() === event.endTime.toDateString();
    const isBetween = date > event.startTime && date < event.endTime;

    return isSameDayAsStart || isSameDayAsEnd || isBetween;
  });
}
const CalendarComponent: React.FC<CalendarProps> = ({
  userEmailId,
  onCloseDrawer,
  employeeID,
  userName,
}) => {
  const [userRole, setUserRole] = useState<any[]>([]);

  // api
  // Function to build filters based on roles (use the prop userEmailId)
  const buildFilters = (userRole: any, userEmailId: string) => {
    const rolesEnabled = userRole?.message?.roles_enabled || [];

    // Base filter
    let filters = [["status", "=", "Approved"]];

    // Apply filters based on roles
    if (rolesEnabled.includes("Fleet Manager")) {
      return filters;
    } else if (
      rolesEnabled.includes("Project Lead") ||
      rolesEnabled.includes("Department Head")
    ) {
      filters.push(["reports_to", "=", userEmailId]);
    } else if (
      rolesEnabled.includes("Employee") &&
      !rolesEnabled.includes("Project Lead") &&
      !rolesEnabled.includes("Department Head")
    ) {
      filters.push(["employee_email", "=", userEmailId]);
    }

    return filters;
  };
  const { data: MasterData }: any = useFrappeGetDocList("FM_Request_Master", {
    fields: ["employee_name", "type", "creation", "request_id"],
    filters: buildFilters(userRole, userEmailId),
    limit: 100000,
    orderBy: {
      field: "modified",
      order: "desc",
    },
  });

  const [overAllRequestData, setOverAllRequestData] = useState<EventItem[]>([]);
  useEffect(() => {
    if (MasterData) {
      setOverAllRequestData(processRequestData(MasterData));
    }
  }, [MasterData]);

  const { data: RolesData } = useFrappeGetCall(
    "fleet_management.custom_function.get_user_roles"
  );

  useEffect(() => {
    if (RolesData) {
      setUserRole(RolesData);
    }
  }, [RolesData]);
  console.log("userRole", userRole);
  // api end
  const renderCell = (date: Date) => {
    // Get events for the specified date
    const eventList = getEventsForDate(date, overAllRequestData);
    const combinedList = eventList.map((event) => ({
      time: event.startTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      requestId: event.requestId,
      employeeName: event.employeeName,
      title: event.title,
    }));

    // Create popover content
    const popoverContent = (
      <Popover>
        {eventList
          .map((event) => ({
            time: event.startTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            requestId: event.requestId,
            employeeName: event.employeeName,
            title: event.title,
          }))
          .map((item, index) => (
            <p key={index}>
              <b>{item.time}</b> - <b>Request ID:</b> {item.requestId} -{" "}
              <b>Employee:</b> {item.employeeName} - <b>Type:</b> {item.title}
            </p>
          ))}
      </Popover>
    );
    return (
      <div className="calendar-cell-content">
        {combinedList.length > 0 && (
          <ul className="calendar-todo-list">
            {combinedList.slice(0, 2).map((item, index) => (
              <Whisper
                key={index}
                placement="top"
                trigger="hover"
                speaker={popoverContent}
              >
                <li>
                  <Badge /> <b>{item.time}</b> - <b>Request ID:</b>{" "}
                  {item.requestId} - <b>Employee:</b> {item.employeeName} -{" "}
                  <b>Type:</b> {item.title}
                </li>
              </Whisper>
            ))}
            {combinedList.length > 2 && (
              <li key="more">
                <Whisper
                  placement="top"
                  trigger="click"
                  speaker={popoverContent}
                >
                  <a href="#!">{combinedList.length - 2} more</a>
                </Whisper>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  };

  return <Calendar bordered renderCell={renderCell} />;
};

export default CalendarComponent;
