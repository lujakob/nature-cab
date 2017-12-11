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
    const {start = '', end = '', activity = ''} = this.props.match.params
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
              onBlur={this._filter}
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
              onChange={this._onChangeSelect}
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
          <div className="ride-list-filter-field ride-list-filter-field--button">
            <button
              className='link white bg-blue'
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

  _onChangeSelect = (evt) => {
    this.setState({[evt.target.name]: evt.target.value}, () => this._filter())
  }

  _filter = () => {
    this.props.filterFunc(this.state)
  }
}


export default withRouter(RideListFilter)