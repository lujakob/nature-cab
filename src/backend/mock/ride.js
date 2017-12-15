import {ACTIVITIES} from '../../constants'
import moment from 'moment'
import 'moment/locale/de'

moment.locale('de')

export const rides = [
  {startLocation: 'München Hauptbahnhof, München, Deutschland', startLatLng:
    [48.1412956, 11.559116399999994], startCity: 'München', endLocation: 'Tegernsee, Deutschland', endLatLng:
    [47.71315240000001, 11.758015999999998], endCity: 'Tegernsee', seats: 3, price: 20, vehicle: 'CAR', activity: ACTIVITIES[1]['id'], id: 1, startDate: moment().add(-1, 'days').startOf('hour').toDate(), user: 0},
  {startLocation: 'Bahnhofstrasse Augsburg, Deutschland', startLatLng:
    [48.3661526, 10.890635100000054], startCity: 'Augsburg', endLocation: 'Tegernsee, Deutschland', endLatLng:
    [47.71315240000001, 11.758015999999998], endCity: 'Tegernsee', seats: 2, price: 28, vehicle: 'CAR', activity: ACTIVITIES[1]['id'], id: 2, startDate: moment().startOf('hour').toDate(), user: 1, description: 'Ich würde gerne um 16 Uhr am Parkplatz zurück sein und dann gemütlich heimfahren.'},
  {startLocation: 'München Hauptbahnhof, München, Deutschland', startLatLng:
    [48.1412956, 11.559116399999994], startCity: 'München', endLocation: 'Garmisch-Partenkirchen, Deutschland', endLatLng:
    [47.4916945, 11.095498399999997], endCity: 'Garmisch-Partenkirchen', seats: 2, price: 28, vehicle: 'TRAIN', activity: ACTIVITIES[2]['id'], id: 3, startDate: moment().add(4, 'days').startOf('hour').toDate(), user: 0, description: 'Wir können gerne zusammen laufen gehen. Ich denke Tempo mittel, 2h hoch und 1h runter.'},
  {startLocation: 'München Hauptbahnhof, München, Deutschland', startLatLng:
    [48.1412956, 11.559116399999994], startCity: 'München', endLocation: 'Bayerischzell, Deutschland', endLatLng:
    [47.6732016, 12.014080799999988], endCity: 'Bayerischzell', seats: 2, price: 30, vehicle: 'CAR', activity: ACTIVITIES[1]['id'], id: 4, startDate: moment().add({days: 4, hours: 2}).startOf('hour').toDate(), user: 0}
]