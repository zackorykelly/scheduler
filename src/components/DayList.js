//Used to display and select names on left hand menu
import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {

  return (
    props.days.map(day => {
      return <DayListItem
        key={day.id}
        name={day.name}
        spots={day.spots}
        selected={day.name === props.day}
        setDay={props.setDay} />
    })
  );
}