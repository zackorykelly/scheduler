import React from "react";

import { render, cleanup, waitForElement, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";
import { fireEvent } from "@testing-library/react/dist";

import { getByText } from "@testing-library/react"

import axios from "axios";

afterEach(cleanup);

describe("Application", () => {
//Modified version test using async/await syntax
it("changes the schedule when a new day is selected", async () => {
  const { getByText } = render(<Application />);

  await waitForElement(() => getByText("Monday"));

  fireEvent.click(getByText("Tuesday"));

  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});

it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
  const { container, debug } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));
  expect(getByText(appointment, "SAVING")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  expect(getByAltText(appointment, "Edit")).toBeInTheDocument();

  const Monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  expect(getByText(Monday, "no spots remaining")).toBeInTheDocument();
});

it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
   // 1. Render the Application.
   const { container, debug } = render(<Application />);

   // 2. Wait until the text "Archie Cohen" is displayed.
   await waitForElement(() => getByText(container, "Archie Cohen"));
 
   // 3. Click the "Delete" button on the second appointment.
   const appointments = getAllByTestId(container, "appointment");
   const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

   fireEvent.click(getByAltText(appointment, "Delete"));
   
   // 4. Check that the confirmation message is shown.
   expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

   // 5. Click the "Confrim" button on the confirmation.
   fireEvent.click(getByText(appointment, "Confirm"));

   // 6. Check that the element with the text "DELETING" is displayed.
  expect(getByText(appointment, "DELETING")).toBeInTheDocument();

   // 7. Wait until the element with alt text "Add" is displayed.
   await waitForElement(() => getByAltText(appointment, "Add"));

   // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
   const Monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  expect(getByText(Monday, "2 spots remaining")).toBeInTheDocument();

});

it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
   // 1. Render the Application.
   const { container, debug } = render(<Application />);

   // 2. Wait until the text "Archie Cohen" is displayed.
   await waitForElement(() => getByText(container, "Archie Cohen"));
 
   // 3. Click the "Edit" button on the second appointment.
   const appointments = getAllByTestId(container, "appointment");
   const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));

   fireEvent.click(getByAltText(appointment, "Edit"));
   // 4. Check that the form is shown and update the values.
   expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();

   fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
    });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
   // 5. Click the "Save" button on the form.
   fireEvent.click(getByText(appointment, "Save"));

   // 6. Check that the element with the text "DELETING" is displayed.
   expect(getByText(appointment, "SAVING")).toBeInTheDocument();

   // 7. Wait until the element with text "Lydia Miller-Jones" is displayed.
   await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
   expect(getByAltText(appointment, "Edit")).toBeInTheDocument();

   // 8. Check that the DayListItem with the text "Monday" also has the text "1 spot remaining".
   const Monday = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"));
  expect(getByText(Monday, "1 spot remaining")).toBeInTheDocument();

});

it("shows the save error when failing to save an appointment", async () => {
  axios.put.mockRejectedValueOnce();

  const { container, debug } = render(<Application />);

  await waitForElement(() => getByText(container, "Archie Cohen"));

  const appointments = getAllByTestId(container, "appointment");
  const appointment = appointments[0];

  fireEvent.click(getByAltText(appointment, "Add"));

  fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
    target: { value: "Lydia Miller-Jones" }
  });

  fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

  fireEvent.click(getByText(appointment, "Save"));
  expect(getByText(appointment, "SAVING")).toBeInTheDocument();

  await waitForElement(() => getByText(appointment, "Could not save appointment."));
  expect(getByText(appointment, "Could not save appointment.")).toBeInTheDocument();
});

it("shows the save error when failing to delete an existing appointment", async () => {
  axios.delete.mockRejectedValueOnce();

     // 1. Render the Application.
     const { container, debug } = render(<Application />);

     // 2. Wait until the text "Archie Cohen" is displayed.
     await waitForElement(() => getByText(container, "Archie Cohen"));
   
     // 3. Click the "Delete" button on the second appointment.
     const appointments = getAllByTestId(container, "appointment");
     const appointment = appointments.find(appointment => queryByText(appointment, "Archie Cohen"));
  
     fireEvent.click(getByAltText(appointment, "Delete"));
     
     // 4. Check that the confirmation message is shown.
     expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();
  
     // 5. Click the "Confrim" button on the confirmation.
     fireEvent.click(getByText(appointment, "Confirm"));
  
     // 6. Check that the element with the text "DELETING" is displayed.
    expect(getByText(appointment, "DELETING")).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Could not cancel appointment."));
    expect(getByText(appointment, "Could not cancel appointment.")).toBeInTheDocument();
});

});