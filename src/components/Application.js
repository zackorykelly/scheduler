import React, { useState, useEffect } from "react";
import axios from "axios";
import useApplicationData from "hooks/useApplicationData";

import "components/Application.scss";

import DayList from "components/DayList"
import Appointment from "components/Appointment/index"

import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "helpers/selectors"


export default function Application(props) {

  //Combined state
  // const [state, setState] = useState({
  //   day: 'Monday',
  //   days: [],
  //   appointments: {},
  //   interviewers: {}
  // });

  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();


  const dailyInterviewers = getInterviewersForDay(state, state.day);

  // const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({ ...prev, days }));



  // useEffect(() => {
  //   Promise.all([
  //     axios.get('/api/days'),
  //     axios.get('/api/appointments'),
  //     axios.get('/api/interviewers')
  //   ]).then((all) => {
  //     setState(prev => ({ ...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }))
  //   })
  // }, []);
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const appointmentItems = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);
    return <Appointment key={appointment.id} {...appointment} interview={interview} interviewers={dailyInterviewers} bookInterview={bookInterview} cancelInterview={cancelInterview} />
  });

  // function bookInterview(id, interview) {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: { ...interview }
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };
  //   return axios.put(`/api/appointments/${id}`, { interview })
  //     .then((res) => {
  //       setState({ ...state, appointments });
  //     })
  // }

  // function cancelInterview(id) {
  //   const appointment = {
  //     ...state.appointments[id],
  //     interview: null
  //   };
  //   const appointments = {
  //     ...state.appointments,
  //     [id]: appointment
  //   };
  //   return axios.delete(`/api/appointments/${id}`)
  //     .then((res) => {
  //       setState({ ...state, appointments });
  //     })
  // }

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            day={state.day}
            setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {/* Replace this with the schedule elements during the "The Scheduler" activity. */}
        {appointmentItems}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
