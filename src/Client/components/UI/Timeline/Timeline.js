import moment from "moment";
import React, { Component } from "react";
import PropTypes from "prop-types";
import TimelineItem from "./TimelineItem";
import './TimelineStyles.scss';

class Timeline extends Component {

    state = {
        deleteItem: null
    }

    getFormattedData(items) {
        const activities = {};
        items.forEach(({ ts, text }, index) => {
          const date = moment(ts);
          const dateStr = date.format("DD MMM YYYY");
          const list = activities[dateStr] || [];
          list.push({
            time: date.format("hh:mm"),
            text,
            key: index,
          });
          activities[dateStr] = list;
        });
        return activities;
      }

      deleteItem = (e) => {
          this.props.deleteItem(e);
      }
      
    render() {
    
        
        const activities = this.getFormattedData(this.props.items);
        const dates = Object.keys(activities);
      
        return (
          <div className="time-line-ctnr">
            {dates.map(d => (
              <ul className="time-line" key={d}>
                <li className="time-label">
                  <span>{d}</span>
                </li>
                {activities[d].map(({ time, text, key }, i) => (
                  <TimelineItem time={time} text={text} key={key} index={i} deleteTimelineItem={this.deleteItem} />
                //   
                ))}
              </ul>
            ))}
          </div>
        );
    
    }
    
    }
    
    export default Timeline;


Timeline.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ts: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
};