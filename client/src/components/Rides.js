import React, {Component} from 'react'
import RideListWithData from './RideListWithData'
import RideDetail from './RideDetail'
import RideListFilter from './RideListFilter'
import {Route} from 'react-router-dom'
import { withRouter } from 'react-router'

class Rides extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    return (
      <div>
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

export default withRouter(Rides)