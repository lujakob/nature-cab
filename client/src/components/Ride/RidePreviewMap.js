import React, {Component} from 'react'
import {MAP_CENTER_DEFAULT} from '../../constants'

class RidePreviewMap extends Component {

  google = window.google
  map = null

  componentDidMount() {
    this._initMap()
  }

  render(){
    return (
      <div className="ride-preview-map">
        <h3>
          Fahrtübersicht
        </h3>
        <div id="map"></div>
      </div>
    )
  }

  _initMap() {

    const {latitude: lat, longitude: lng} = MAP_CENTER_DEFAULT
    this.map = new this.google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat, lng}
    });

    if (this.props.startLatLng) {
      const marker = new this.google.maps.Marker({
        position: this.props.startLatLng,
        map: this.map
      })
    }

    // get map center coords from user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({coords}) => this._setCenter(coords))
    } else {
      this._setCenter(MAP_CENTER_DEFAULT)
    }
  }

  _setCenter({latitude: lat, longitude: lng}) {
    this.map.setCenter({lat, lng});
  }
}

export default RidePreviewMap