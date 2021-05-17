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
        // spotsRemaining(id);?????
      })
  }


  // function cancelInterview(id) {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: null
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };
  //   let day = getDay(id);
  //   let newDay = { ...day, spots: day.spots + 1 };
  //   let newDays = state.days;
  //   for (let i = 0; i < state.days.length; i++) {
  //     if (state.days[i].appointments.includes(id)) {
  //       newDays.splice(i, 1, newDay);
  //     }
  //   }
  //   return axios.delete(`/api/appointments/${id}`)
  //     .then((res) => {
  //       setState({ ...state, appointments, days: newDays });
  //     })
  // }

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



  function updateSpots2(dayName, days, appointments) {
    let spots = 0;

    for (let i = 0; i < days.length; i++) {
      if (days[i].name === dayName) {
        for (const appointment in appointments) {
          if (appointment)
        }
      }
    }
  }






  function getDay(id) {
    return state.days.filter(day => day.appointments.includes(id))[0];
  }

  function getDayName(id) {
    return state.days.filter(day => day.appointments.includes(id))[0].name;
  }

  function updateSpots(dayName, days, appointments) {
    let dayAppointments = [];
    let selectedDay = {}
    for (const day of days) {
      if (day.name === dayName) {
        selectedDay = day;
      }
    }

    dayAppointments = selectedDay.appointments;
    let spotCounter = 0;

    for (const appointment in appointments) {
      if (dayAppointments.includes(appointments[appointment].id) && !appointments[appointment].interview) {
        spotCounter++;
      }
    }

    const newDay = {
      ...selectedDay,
      spots: spotCounter
    }

    return newDay;
  }



  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}