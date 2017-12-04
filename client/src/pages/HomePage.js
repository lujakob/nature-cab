import React, {Component} from 'react'
import RideListWithData from '../components/Ride/RideListWithData'
import RideListFilter from '../components/Ride/RideListFilter'
import { withRouter } from 'react-router'
import homeImg from '../img/home1.jpg'

class HomePage extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    return (
      <div className="home-page has-visual">
        <div className="visual">
          <img src={homeImg} alt='NatureCab Mitfahrgelegenheit Visual'/>
        </div>

        <RideListFilter filterFunc={({start, end, activity}) => {
          this.setState({start, end, activity})
          //this.props.history.push('/rides')
        }}/>

        <div className="centered-container">
          <RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>
        </div>
      </div>
    )
  }
}

export default withRouter(HomePage)