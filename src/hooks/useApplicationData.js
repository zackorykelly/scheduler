import { useState, useEffect } from "react";
import axios from "axios";

import getAppointmentsForDay from "helpers/selectors";

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
    })
  }, []);


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let day = getDay(id);
    let newDay = { ...day, spots: day.spots - 1 };
    let newDays = state.days;
    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].appointments.includes(id)) {
        newDays.splice(i, 1, newDay);
      }
    }
    return axios.put(`/api/appointments/${id}`, { interview })
      .then((res) => {
        setState({ ...state, appointments, days: newDays });
        // spotsRemaining(id);
      })
  }


  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    let day = getDay(id);
    let newDay = { ...day, spots: day.spots + 1 };
    let newDays = state.days;
    for (let i = 0; i < state.days.length; i++) {
      if (state.days[i].appointments.includes(id)) {
        newDays.splice(i, 1, newDay);
      }
    }
    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        setState({ ...state, appointments, days: newDays });
      })
  }

  function getDay(id) {
    return state.days.filter(day => day.appointments.includes(id))[0];
  }



  function spotsRemaining(id) {
    //Figure out which day we've affected
    let affectedDay = '';
    for (const day of state.days) {
      if (day.appointments.includes(id)) {
        affectedDay = { ...day };
      }
    }

    //Count how many spots there are in that day now
    let newSpots = 0;
    const appointments = getAppointmentsForDay(affectedDay.name);
    for (const appointment of appointments) {
      if (!appointment.interview) {
        newSpots++;
      }
    }

    //Set the copy to have the new spots value
    affectedDay.spots = newSpots;

    return affectedDay;
    //Update the state?
    // setState({ ...state, days: { ...state.days, affectedDay } });
  }



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
    spotsRemaining
  }
}