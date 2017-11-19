import React, {Component} from 'react'
import RideListWithData from '../Ride/RideListWithData'
import RideDetail from '../Ride/RideDetail'
import RideListFilter from '../Ride/RideListFilter'
import {Route} from 'react-router-dom'
import { withRouter } from 'react-router'

class Home extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    return (
      <div className="home-page">
        <div className="home-visual">
          <img src="./home.jpg"/>
        </div>
        <RideListFilter filterFunc={({start, end, activity}) => {
          this.setState({start, end, activity})
          // go to list view
          this.props.history.push('/rides')
        }}/>
        <Route exact path={this.props.match.url} render={() => {
          return <RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>
        }}/>
        <Route path={`${this.props.match.url}/:id`} component={RideDetail}/>
      </div>
    )
  }
}

export default withRouter(Home)