const getAppointmentsForDay = (state, day) => {
  //... returns an array of appointments for that day
  let appointmentIDs = [];
  const result = [];

  for (const selectedDay of state.days) {
    if (selectedDay.name === day) {
      appointmentIDs = selectedDay.appointments;
    }
  }

  for (const selectedAppointment in state.appointments) {
    if (appointmentIDs.includes(Number(selectedAppointment))) {
      result.push(state.appointments[selectedAppointment])
    }
  }

  return result;
}

const getInterviewersForDay = (state, day) => {
  //... returns an array of interviewers for that day
  let interviewerIDs = [];
  const result = [];

  for (const selectedDay of state.days) {
    if (selectedDay.name === day) {
      interviewerIDs = selectedDay.interviewers;
    }
  }

  for (const selectedInterviewer in state.interviewers) {
    if (interviewerIDs.includes(Number(selectedInterviewer))) {
      result.push(state.interviewers[selectedInterviewer])
    }
  }

  return result;
}

const getInterviewerByID = (state, id) => {
  for (const interviewer in state.interviewers) {
    if (Number(interviewer) === id) {
      return state.interviewers[interviewer];
    }
  }
}

const getInterview = (state, interview) => {
  if (!interview) {
    return null;
  }

  const returnInterview = {
    "student": interview.student,
    "interviewer": getInterviewerByID(state, interview.interviewer)
  }

  return returnInterview;
}

module.exports = {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay
}