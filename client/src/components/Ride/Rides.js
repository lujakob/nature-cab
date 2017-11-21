import React, {Component} from 'react'
// import RideListWithData from './RideListWithData'
import RideDetail from './RideDetail'
// import RideListFilter from './RideListFilter'
import {Route} from 'react-router-dom'
import { withRouter } from 'react-router'
import homeImg from '../../img/home1.jpg'

class Rides extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    const isListView = this.props.location.pathname === '/rides'
    return (
      <div className={'ride-list-page' + (isListView ? ' has-visual' : '')}>
        <div className="visual">
          <img src={homeImg} alt=""/>
        </div>
        <Route exact path={`${this.props.match.url}`} render={() => {
          this.props.history.push('/')
          return ''
        }}/>
        {/*<Route exact path={`${this.props.match.url}`} render={() => (*/}
          {/*<div>*/}
            {/*<RideListFilter filterFunc={({start, end, activity}) => this.setState({start, end, activity})}/>*/}
            {/*<RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>*/}
          {/*</div>*/}
        {/*)}/>*/}
        <Route path={`${this.props.match.url}/:id`} component={RideDetail}/>
      </div>
    )
  }

}

export default withRouter(Rides)