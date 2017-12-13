import React, {Component} from 'react'
import RideListWithData from '../components/Ride/RideListWithData'
import RideListFilter from '../components/Ride/RideListFilter'
import { withRouter } from 'react-router'
import Visual from '../components/Visual'

const limit = 2

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

        <RideListFilter filterFunc={({start, end, activity}) => {
          this.setState({start, end, activity})
          //this.props.history.push('/rides')
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
}

export default withRouter(HomePage)