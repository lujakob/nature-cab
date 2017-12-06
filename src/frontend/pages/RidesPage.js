import React, {Component} from 'react'
// import RideListWithData from './RideListWithData'
import RideDetail from '../components/Ride/RideDetail'
// import RideListFilter from './RideListFilter'
import {Route} from 'react-router-dom'
import {withRouter} from 'react-router'
import Visual from '../components/Visual'

class RidesPage extends Component {

  state = {
    start: '',
    end: '',
    activity: ''
  }

  render () {
    const isListView = this.props.location.pathname === '/rides'
    return (
      <div className={'ride-list-page' + (isListView ? ' has-visual' : '')}>
        <Visual/>
        <Route exact path={`${this.props.match.url}`} render={() => {
          this.props.history.push('/')
          return ''
        }}/>

        {/*<Route exact path={`${this.props.match.url}`} render={() => (*/}
        {/*<RideListFilter filterFunc={({start, end, activity}) => this.setState({start, end, activity})}/>*/}

        {/*<div className="centered-container">*/}
            {/*<RideListWithData start={this.state.start} end={this.state.end} activity={this.state.activity}/>*/}
          {/*</div>*/}
        {/*)}/>*/}
        <Route path={`${this.props.match.url}/:id`} component={RideDetail}/>
      </div>
    )
  }

}

export default withRouter(RidesPage)