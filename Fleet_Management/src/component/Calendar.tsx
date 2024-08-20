// import {
//   Eventcalendar,
//   getJson,
//   MbscCalendarEvent,
//   MbscEventcalendarView,
//   MbscEventClickEvent,
//   setOptions,
//   Toast,
// } from "@mobiscroll/react";
// import { FC, useCallback, useEffect, useMemo, useState } from "react";

// setOptions({
//   theme: "material",
//   themeVariant: "light",
// });

// const Calendar: FC = () => {
//   const [myEvents, setEvents] = useState<MbscCalendarEvent[]>([]);
//   const [isToastOpen, setToastOpen] = useState<boolean>(false);
//   const [toastText, setToastText] = useState<string>();

//   useEffect(() => {
//     getJson(
//       "https://trial.mobiscroll.com/events/?vers=5",
//       (events: MbscCalendarEvent[]) => {
//         setEvents(events);
//       },
//       "jsonp"
//     );
//   }, []);

//   const handleToastClose = useCallback(() => {
//     setToastOpen(false);
//   }, []);

//   const handleEventClick = useCallback((args: MbscEventClickEvent) => {
//     setToastText(args.event.title);
//     setToastOpen(true);
//   }, []);

//   const view = useMemo<MbscEventcalendarView>(
//     () => ({
//       calendar: { labels: true },
//     }),
//     []
//   );

//   return (
//     <>
//       <Eventcalendar
//         clickToCreate={false}
//         dragToCreate={false}
//         dragToMove={false}
//         dragToResize={false}
//         eventDelete={false}
//         data={myEvents}
//         view={view}
//         onEventClick={handleEventClick}
//       />
//       <Toast
//         message={toastText}
//         isOpen={isToastOpen}
//         onClose={handleToastClose}
//       />
//     </>
//   );
// };
// export default Calendar;
