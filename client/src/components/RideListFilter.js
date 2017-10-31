import React, {Component} from 'react'
import {ACTIVITIES} from '../constants'

class RideListFilter extends Component {

  state = {
    start: this.props.start ? this.props.start : '',
    end: this.props.end ? this.props.end : '',
    activity: this.props.activity ? this.props.activity : '',
  }

  render() {
    return (
      <div className="ride-list-filter">
        <div className="ride-list-filter-field">
          <input
            type="text"
            placeholder="Start"
            value={this.state.start}
            name="start"
            onChange={this._onChange}
          />
        </div>
        <div className="ride-list-filter-field">
          <input
            type="text"
            placeholder="End"
            value={this.state.end}
            name="end"
            onChange={this._onChange}
          />
        </div>
        <div className="ride-list-filter-field">
          <select
            onChange={this._onChange}
            value={this.state.activity}
            name="activity"
          >
            {Object.keys(ACTIVITIES).map((activity, index) => {
              return <option
                key={index}
                value={activity}
              >{activity}</option>
            })}
          </select>
        </div>
        <div className="ride-list-filter-field">
          <div
            className='pointer mr2 button'
            onClick={this._filter}
          > Filter</div>
        </div>
      </div>
    )
  }

  _onChange = (evt) => {
    this.setState({[evt.target.name]: evt.target.value})
  }

  _filter = () => {
    this.props.filterFunc(this.state)
  }

}


export default RideListFilter