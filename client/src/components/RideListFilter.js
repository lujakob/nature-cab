import React, {Component} from 'react'

class RideListFilter extends Component {

  state = {
    start: this.props.start ? this.props.start : '',
    end: this.props.end ? this.props.end : '',
    activity: ''
  }

  render() {
    return (
      <div className="ride-list-filter">
        <div className="ride-list-filter-field">
          <input type="text" placeholder="Start" value={this.state.start} name="start" onChange={this._onChange}/>
        </div>
        <div className="ride-list-filter-field">
          <input type="text" placeholder="Start" value={this.state.end} name="end" onChange={this._onChange}/>
        </div>
        <div className="ride-list-filter-field">
          <div
            className='pointer mr2 button'
            onClick={this._filter}
          > Filter</div>
        </div>
      </div>
    )
  }

  _onChange = (evt) => {
    this.setState({[evt.target.name]: evt.target.value})
  }

  _filter = () => {
    this.props.filterFunc(this.state)
  }

}


export default RideListFilter