import React, {Component} from 'react'
import RideListWithData from '../components/Ride/RideListWithData'
import RideListFilter from '../components/Ride/RideListFilter'
import {withRouter} from 'react-router'
import Visual from '../components/Visual'
import {getActivityFromId} from '../utils/misc'

const limit = 5

const basePath = '/rides'

export const activityParamPrefix = 'zum-'
export const endParamPrefix = 'nach-'

class HomePage extends Component {

  state = {
    start: '',
    end: '',
    activity: '',
    latest: null
  }

  render () {
    const {start, end, activity} = this.state

    return (
      <div className="home-page has-visual">
        <Visual/>

        <RideListFilter filterFunc={(params) => {
          this.setState(params)
          this.props.history.push(this._buildUrl(params))
        }}/>

        <div className="centered-container">
          <RideListWithData
            start={start}
            end={end}
            activity={activity}
            limit={limit}
          />
        </div>
      </div>
    )
  }

  /**
   * add url params to base path if available
   * @param start
   * @param end
   * @param activity
   * @returns {string}
   * @private
   */
  _buildUrl = ({start, end, activity}) => {
    let url = basePath
    if (start) {
      url = url + '/' + start
    }
    if (end) {
      url = url + '/' + endParamPrefix + end
    }
    if (activity) {
      url = url + '/' + activityParamPrefix + getActivityFromId(activity)
    }

    return url
  }
}

export default withRouter(HomePage)