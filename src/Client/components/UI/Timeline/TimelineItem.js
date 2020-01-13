import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const trashIcon = <FontAwesomeIcon icon={faTrash} />;
/**
 * @usage
 * <TimelineItem time={time} text={text} />
 */
const TimelineItem = (props) => {
  return (
    <li>

      <i className="fa" />
      <div className="time-line-item">
        <span className="time">
          <i className="fa fa-clock-o" />
          <i className="fa fa-trash-o" />
          <span onClick={() => props.deleteTimelineItem(props.index)} 
          className="deleteTimelineItem">{trashIcon} </span><span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          {props.time} 
        </span>
        
        <div className="time-line-header">{props.text}</div>
      </div>
    </li>
  );
}

TimelineItem.defaultProps = {};

TimelineItem.propTypes = {
  time: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default TimelineItem;