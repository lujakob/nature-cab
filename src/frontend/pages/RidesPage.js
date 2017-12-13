import React, {Component} from 'react'
import RideListWithData from '../components/Ride/RideListWithData'
import RideListFilter from '../components/Ride/RideListFilter'
import {withRouter} from 'react-router'
import Visual from '../components/Visual'

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

    const {match} = this.props

    return (
      <div className={'ride-list-page  has-visual'}>
        <Visual/>
        <RideListFilter filterFunc={({start, end, activity}) => this.setState({start, end, activity})}/>

        <div className="centered-container">
          <RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>
        </div>
      </div>
    )
  }

  _setStateFromParams = ({start, end, activity}) => {

    let params = {}

    start && Object.assign(params, {start: decodeURI(start)})
    end && Object.assign(params, {end: decodeURI(end)})

    if (activity) {
      const id = getActivityIdFromTitle(decodeURI(activity))
      activity && Object.assign(params, {activity: String(id)})
    }

    this.setState(params)
  }
}

export default withRouter(RidesPage)