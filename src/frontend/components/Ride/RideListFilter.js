import React, {Component} from 'react'
import {ACTIVITIES} from '../../../constants'
import {withRouter} from 'react-router-dom'
import {getSortedActivities, isMobile, ridesBuildUrl} from '../../utils/misc'
import {ridesBasePath} from '../../../constants'

class RideListFilter extends Component {

  activities = getSortedActivities(ACTIVITIES)

  state = {
    start: '',
    end: '',
    activity: '',
  }

  componentWillMount() {
    const {start = '', end = '', activity = ''} = this.props
    this.setState({start, end, activity})
  }

  render() {
    return (
      <div className="ride-list-filter">
        <h1 className="heading">Die Mitfahrgelegenheit in die Berge</h1>
        <div className="ride-list-filter__wrapper">
          <div className="ride-list-filter__field">
            <input
              type="text"
              placeholder="Von..."
              value={this.state.start}
              name="start"
              onChange={this._onChange}
              onBlur={this._onFieldBlur}
            />
          </div>
          {false &&
          <div className="ride-list-filter__field">
            <input
              type="text"
              placeholder="Nach..."
              value={this.state.end}
              name="end"
              onChange={this._onChange}
            />
          </div>
          }

          <div className="ride-list-filter__field ride-list-filter__field--activity">
            <select
              onChange={this._onChangeSelect}
              value={this.state.activity}
              name="activity"
            >
              {this.activities.map((activity, index) => {
                return <option
                  key={index}
                  value={activity.id}
                >{activity.title}</option>
              })}
            </select>
          </div>
          <div className="ride-list-filter__field ride-list-filter__field--button">
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

  _onFieldBlur = () => {
    // only call filter func on blur for mobile
    isMobile() && this._filter()
  }

  _onChange = (evt) => {
    this.setState({[evt.target.name]: evt.target.value})
  }

  _onChangeSelect = (evt) => {
    const {name, value} = evt.target
    this.setState({[name]: value}, () => this._filter())
  }

  _filter = () => {
    const {filterFunc} = this.props
    const url = ridesBuildUrl(ridesBasePath, this.state)
    this.props.history.push(url)

    filterFunc && filterFunc(this.state)
  }
}

export default withRouter(RideListFilter)