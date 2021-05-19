//Individual day items for daylist menu
import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {

  const DayListItemClass = classNames('day-list__item', {
    'day-list__item--selected': props.selected,
    'day-list__item--full': props.spots === 0
  })

  const formatSpots = (spots) => {
    if (spots === 0) {
      return 'no spots remaining';
    } else if (spots === 1) {
      return '1 spot remaining';
    }
    return `${spots} spots remaining`;
  }

  return (
    <li className={DayListItemClass} data-testid="day" onClick={() => props.setDay(props.name)}>
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}