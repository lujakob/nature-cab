import React, {Component} from 'react'
import RideListWithData from '../components/Ride/RideListWithData'
import RideListFilter from '../components/Ride/RideListFilter'
import {withRouter} from 'react-router'
import Visual from '../components/Visual'
import {getActivityIdFromTitle} from '../utils/misc'
import {activityParamPrefix, endParamPrefix} from './HomePage'

class RidesPage extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  componentWillMount() {
    const {params} = this.props.match
    this._setStateFromParams(params)
  }

  render () {

    const {start, end, activity} = this.state

    return (
      <div className={'ride-list-page  has-visual'}>
        <Visual/>
        <RideListFilter
          start={start}
          end={end}
          activity={activity}
          filterFunc={({start, end, activity}) => this.setState({start, end, activity})}
        />

        <div className="centered-container">
          <RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>
        </div>
      </div>
    )
  }

  _setStateFromParams = ({start: first, end: second, activity: third}) => {

    let res = {}

    // params start, end, activity are defined by position, not name.
    // Hence if 'start' is missing, 'end' moves on first position, etc

    if (this._isActivityParam(first)) {
      setActivity(first)

    } else if (this._isEndParam(first) ) {
      Object.assign(res, {end: decodeURI(first)})

      if (this._isActivityParam(second)) {
        setActivity(second)
      }
    } else {
      first && Object.assign(res, {start: decodeURI(first)})
      second && Object.assign(res, {end: decodeURI(second)})
      third && setActivity(third)
    }

    this.setState(res)

    function setActivity(activity) {
      // 'zum-wandern' - remove prefix first, get ID from activity-id map
      const act = decodeURI(activity).substr(activityParamPrefix.length)
      const id = getActivityIdFromTitle(act)
      Object.assign(res, {activity: String(id)})
      console.log("res", res);
    }
  }

  _isActivityParam = (val) => {
    // activity param starts with 'activityParamPrefix'
    return val.indexOf(activityParamPrefix) === 0
  }

  _isEndParam = (val) => {
    // activity param starts with 'activityParamPrefix'
    return val && val.indexOf(endParamPrefix) === 0
  }


}

export default withRouter(RidesPage)