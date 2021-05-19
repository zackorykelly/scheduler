# Interview Scheduler

Interview Scheduler is a single page React app that allows a user to book interview appointments between a student and a mentor. The app uses HTML, CSS, JS, and Axios on the front-end and a Node Express server as well as an SQL database on the back-end.

When an available time slot is clicked, the user can enter the student's name and select an available interviewer. The save button will update the state and the database with this information. The number of spots available for a given day will also update in real time on the left-hand side of the page. Appointments can also be canceled using the delete button, which will prompt the user to confirm their decision to prevent unwanted data loss.

The single page design allows for seamless transitioning between all of the possible states of the appointment items, and styling is simple, clean, and consistent. Testing was performed using Jest as well as Cypress to ensure proper functionality of the app for all users.

## Features

- Book, cancel, and track appointments for the week in a persisted state
- Set the student name and interviewer for any appointment
- Sleek and responsive SPA design

## Screenshots

#### Main Page

!["Main page"](https://github.com/zackorykelly/scheduler/blob/master/docs/main-screen.png?raw=true)

#### Appointment Form

!["Appointment form screen"](https://github.com/zackorykelly/scheduler/blob/master/docs/appointment-form.png?raw=true)

#### Cancel Confirmation

!["Appointment cancel confirmation"](https://github.com/zackorykelly/scheduler/blob/master/docs/delete-confirmation.png?raw=true)

## Setup

Install dependencies with `npm install`.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```

## Dependencies

- express
- node
- axios
- @testing-library/react-hooks
- react-test-renderer
