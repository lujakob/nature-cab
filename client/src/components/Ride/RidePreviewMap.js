import React, {PureComponent} from 'react'
import {MAP_CENTER_DEFAULT} from '../../constants'

const mapDomElId = 'map'
const DEFAULT_ZOOM = 7

class RidePreviewMap extends PureComponent {

  google = window.google
  map = null
  marker = null
  directionsDisplay = null
  directionsService = new this.google.maps.DirectionsService();

  componentDidMount() {
    this.initialize()
    const {startLatLng, endLatLng} = this.props
    this.calcRoute(startLatLng, endLatLng)
  }

  componentDidUpdate() {
    const {startLatLng, endLatLng} = this.props
    this.calcRoute(startLatLng, endLatLng)
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
    const zoom = this.props.zoom || DEFAULT_ZOOM

    this.directionsDisplay = new this.google.maps.DirectionsRenderer()

    const mapOptions = {
      zoom,
      center,
      streetViewControl: false,
      mapTypeControl: false
    }
    
    this.map = new this.google.maps.Map(document.getElementById(mapDomElId), mapOptions)
  }

  calcRoute(startLatLng, endLatLng) {

    if (this._startPointsSet(startLatLng) && this._endPointsSet(endLatLng)) {
      // remove marker
      this.marker && this.marker.setMap(null)
      this.directionsDisplay.setMap(this.map)

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

    } else if (this._startPointsSet(startLatLng) && !this._endPointsSet(endLatLng)) {
      this.directionsDisplay.setMap(null)

      this.marker = new this.google.maps.Marker({
        position: {lat: startLatLng[0], lng: startLatLng[1]},
        map: this.map
      })
    } else {
      this.marker && this.marker.setMap(null)
      this.directionsDisplay && this.directionsDisplay.setMap(null);

    }

  }

  _startPointsSet(startLatLng) {
    return !!startLatLng && startLatLng.length === 2
  }

  _endPointsSet(endLatLng) {
    return !!endLatLng && endLatLng.length === 2
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