import React, {PureComponent} from 'react'
import {MAP_CENTER_DEFAULT} from '../../constants'

const mapDomElId = 'map'

class RidePreviewMap extends PureComponent {

  google = window.google
  map = null
  directionsDisplay = null
  directionsService = new this.google.maps.DirectionsService();

  componentDidMount() {
    this.initialize()
    this.calcRoute()
  }

  componentDidUpdate() {
    console.log("did update", this.props);
    this.calcRoute()
  }

  render(){
    return (
      <div className="ride-preview-map">
        <h3>
          Fahrtübersicht
        </h3>
        <div id={mapDomElId}></div>
      </div>
    )
  }

  initialize() {
    const {latitude: lat, longitude: lng} = MAP_CENTER_DEFAULT
    const center = {lat, lng}
    const zoom = this.props.zoom || 7

    this.directionsDisplay = new this.google.maps.DirectionsRenderer()

    var mapOptions = {
      zoom,
      center
    }
    this.map = new this.google.maps.Map(document.getElementById(mapDomElId), mapOptions);
    this.directionsDisplay.setMap(this.map);
  }

  calcRoute() {
    const {startLatLng, endLatLng} = this.props

    if (!startLatLng || startLatLng.length !== 2 || !endLatLng || endLatLng.length !== 2)
      return

    const request = {
      origin: {lat: startLatLng[0], lng: startLatLng[1]},
      destination: {lat: endLatLng[0], lng: endLatLng[1]},
      travelMode: 'DRIVING'
    }

    this.directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(result);
      }
    })
  }


  _initMap() {

    const {latitude: lat, longitude: lng} = MAP_CENTER_DEFAULT
    this.map = new this.google.maps.Map(document.getElementById('map'), {
      zoom: 8,
      center: {lat, lng}
    });

    if (this.props.startLatLng) {
      new this.google.maps.Marker({
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