import React, {Component} from 'react'
import RideListWithData from '../Ride/RideListWithData'
import RideListFilter from '../Ride/RideListFilter'
import { withRouter } from 'react-router'
import homeImg from '../../img/home1.jpg'

class Home extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    return (
      <div className="home-page has-visual">
        <div className="visual">
          <img src={homeImg}/>
        </div>

        <RideListFilter filterFunc={({start, end, activity}) => {
          this.setState({start, end, activity})

          // go to list view
          //this.props.history.push('/rides')
        }}/>

        <RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>
      </div>
    )
  }
}

export default withRouter(Home)