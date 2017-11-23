import React, {Component} from 'react'
import {ACTIVITIES} from '../../constants'
import {withRouter} from 'react-router-dom'

class RideListFilter extends Component {

  state = {
    start: this.props.start ? this.props.start : '',
    end: this.props.end ? this.props.end : '',
    activity: this.props.activity ? this.props.activity : '',
  }

  componentWillMount() {
    const {start, end, activity} = this.props.match.params
    this.setState({start, end, activity})
  }

  render() {
    return (
      <div className="ride-list-filter">
        <div className="heading">Dein Taxi ins Gr&uuml;ne - oder in den Schnee.</div>
        <div className="ride-list-filter__wrapper">
          <div className="ride-list-filter-field">
            <input
              type="text"
              placeholder="Von..."
              value={this.state.start}
              name="start"
              onChange={this._onChange}
            />
          </div>
          {false &&
          <div className="ride-list-filter-field">
            <input
              type="text"
              placeholder="Nach..."
              value={this.state.end}
              name="end"
              onChange={this._onChange}
            />
          </div>
          }

          <div className="ride-list-filter-field">
            <select
              onChange={this._onChange}
              value={this.state.activity}
              name="activity"
            >
              {ACTIVITIES.map((activity, index) => {
                return <option
                  key={index}
                  value={activity.id}
                >{activity.title}</option>
              })}
            </select>
          </div>
          <div className="ride-list-filter-field">
            <button
              className='link ph3 pv2 white bg-blue'
              onClick={() => this._filter()}
            >
              Fahrt finden
            </button>
          </div>
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


export default withRouter(RideListFilter)