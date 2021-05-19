//Handle all app state logic using custom hook
import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });


  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
      const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
      webSocket.onopen = function (event) {
        webSocket.send('ping');
      };
      webSocket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        console.log(data);
      }
    })
  }, []);


  function bookInterview(id, interview) {
    // Create new appt and appt state using shallow copies
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };


    // Give the state days but the updated appointments so they can both be updated at the same time.
    const days = updateSpots(state.day, state.days, appointments);

    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        // Shallow copy the state with updated appts and days
        setState({ ...state, appointments, days });
      })
  }


  function cancelInterview(id) {
    // Set target appt's interview to null
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // See bookInterview for comments on below
    const days = updateSpots(state.day, state.days, appointments);

    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        setState({ ...state, appointments, days });
      })
  }


  // Helper - calculate the number of spots remaining given a day name and days/appointments states, used in book/cancel interview
  function updateSpots(dayName, days, appointments) {
    let newSpots = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        for (const appointment of days[i].appointments) {
          if (!appointments[appointment].interview) {
            newSpots ++;
          }
        }

        const newDay = {...days[i], spots: newSpots};
        const newDays = [...days];
        // Use loop index to splice in the new day, since no keys available to target
        newDays.splice(i, 1, newDay);
        return newDays;
      }
    }
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}