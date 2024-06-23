import React, { useState, useEffect } from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useCookies } from 'react-cookie';
import { Header } from '../components';
const PropertyPane = (props) => <div className="mt-5">{props.children}</div>;
const Scheduler = () => {
  const [scheduleObj, setScheduleObj] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(['hash']); // Corrected the useCookies hook usage
  
  // Function to change the selected date in the calendar
  const change = (args) => {
    if(scheduleObj) {
      scheduleObj.selectedDate = args.value;
      scheduleObj.dataBind();
    }
  };
  const onDragStart = (arg) => {
    // eslint-disable-next-line no-param-reassign
    arg.navigation.enable = true;
  };
  // Effect to fetch user details
  useEffect(() => {
    // Assuming the 'hash' cookie is available and valid
    const hash = cookies['hash'];
    if (hash) {
      fetch(`http://localhost:8080/ipfs/${hash}`)
        .then(res => res.json())
        .then(res => {
          // Assuming email is part of the response and is used to fetch appointments
          fetchAcceptedAppointments(res.mail);
        });
    }
  }, [cookies, cookies.hash]); // Added cookies.hash to the dependency array

  // Function to fetch accepted appointments
  const fetchAcceptedAppointments = (email) => {
    fetch(`http://localhost:8050/api/appointments/acceptedAppointments/${email}`)
      .then(response => response.json())
      .then(data => {
        setAppointments(data.map(appointment => ({
          Id: appointment._id,
          Subject: `${appointment.description}, for ${appointment.patientName}`,
          StartTime: new Date(appointment.date),
          EndTime: new Date(new Date(appointment.date).getTime() + 60 * 60000), // Assuming 1 hour duration
          IsAllDay: false,
          Description: `Mode: ${appointment.mode}, Patient Name: ${appointment.patientName}`,
        })));
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching accepted appointments:', error);
        setLoading(false);
      });
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ScheduleComponent
          height="650px"
          ref={setScheduleObj}
          selectedDate={new Date()} // Dynamically set the current date or a specific date
          eventSettings={{ dataSource: appointments }} // Use the state variable
          dragStart={onDragStart}
        >
          <ViewsDirective>
            {['Day', 'Week', 'WorkWeek', 'Month', 'Agenda'].map((item) => (
              <ViewDirective key={item} option={item} />
            ))}
          </ViewsDirective>
          <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
        </ScheduleComponent>
      )}
      <PropertyPane>
        <table style={{ width: '100%', background: 'white' }}>
          <tbody>
            <tr style={{ height: '50px' }}>
              <td style={{ width: '100%' }}>
                <DatePickerComponent
                  value={new Date()} // Dynamically set to the current date
                  showClearButton={false}
                  placeholder="Select Date"
                  floatLabelType="Always"
                  change={change}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </PropertyPane>
    </div>
  );
};

export default Scheduler;
