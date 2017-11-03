"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const graphql_tag_1 = require("graphql-tag");
const react_apollo_1 = require("react-apollo");
const RideListWithData_1 = require("./RideListWithData");
const react_datepicker_1 = require("react-datepicker");
const moment_1 = require("moment");
require("moment/locale/de");
const constants_1 = require("../constants");
const rideSkipMandatoryFields = ['returnInfo'];
const resetRide = {
    start: '',
    end: '',
    activity: '',
    seats: 3,
    startDate: '',
    startTimeHour: '',
    startTimeMin: '',
    returnInfo: ''
};
const VIEWS = {
    FORM: 'FORM',
    SUCCESS: 'SUCCESS'
};
class CreateRide extends react_1.Component {
    constructor(props) {
        super(props);
        this._handleDatePicker = (date) => {
            this.setState({
                ride: Object.assign({}, this.state.ride, { startDate: date }),
            });
        };
        /**
         * set field value on state, reset error prop
         * @param evt
         * @private
         */
        this._setFieldValue = (evt) => {
            let { name, value } = evt.target;
            let newState = Object.assign({}, this.state, { error: null });
            newState['ride'][name] = value;
            this.setState(newState);
        };
        this._syncStartTimeFields = (value) => {
            let newState = null;
            if (this.state.ride.startTimeMin === '' && value !== '') {
                newState = {
                    ride: Object.assign({}, this.state.ride, { startTimeMin: '00' })
                };
            }
            if (value === '') {
                newState = {
                    ride: Object.assign({}, this.state.ride, { startTimeMin: '' })
                };
            }
            this.setState(newState);
        };
        /**
         * submit form
         * @private
         */
        this._submit = () => __awaiter(this, void 0, void 0, function* () {
            let rideData = this._buildRide();
            if (this._formIsValid(rideData)) {
                yield this.props.addRideMutation({
                    variables: {
                        ride: rideData
                    },
                    update: (store, { data: { addRide } }) => {
                        // show success message
                        this.setState({ view: VIEWS.SUCCESS });
                        // if rideListQuery was not queried yet, the store has no 'rides' prop and will err
                        try {
                            const data = store.readQuery({ query: RideListWithData_1.rideListQuery, variables: { start: '', end: '', activity: '' } });
                            data.rides.push(Object.assign({}, addRide));
                            store.writeQuery({ query: RideListWithData_1.rideListQuery, data });
                        }
                        catch (e) {
                            console.log('Update store not possible. Maybe it was not fetched yet.', e);
                        }
                    }
                });
                this.setState({ 'ride': resetRide });
            }
            else {
                this.setState({ error: true });
            }
        });
        /**
         * check ride props for not empty
         * @param ride
         * @returns {boolean}
         * @private
         */
        this._formIsValid = (ride) => {
            for (let prop in ride) {
                let isMandatory = !rideSkipMandatoryFields.includes(prop);
                if (isMandatory && !ride[prop]) {
                    return false;
                }
            }
            return true;
        };
        moment_1.default.locale('de');
        this.state = {
            ride: resetRide,
            error: null,
            view: VIEWS.FORM
        };
    }
    render() {
        if (this.state.view === VIEWS.FORM) {
            return (react_1.default.createElement("div", null,
                react_1.default.createElement("fieldset", { className: "ride-form-fieldset" },
                    react_1.default.createElement("h3", null, "Abfahrt und Ankunft"),
                    react_1.default.createElement("div", { className: "ride-form-row" },
                        react_1.default.createElement("label", { htmlFor: "ride-start" }, "Wo geht's los?"),
                        react_1.default.createElement("input", { type: "text", placeholder: "Zum Beispiel: Marienplatz, München", value: this.state.ride.start, name: "start", onChange: this._setFieldValue })),
                    react_1.default.createElement("div", { className: "ride-form-row" },
                        react_1.default.createElement("label", { htmlFor: "ride-end" }, "Wohin geht die Fahrt?"),
                        react_1.default.createElement("input", { type: "text", placeholder: "Zum Beispiel: Seesauna, Tegernsee", value: this.state.ride.end, name: "end", onChange: this._setFieldValue })),
                    react_1.default.createElement("div", { className: "ride-form-row" },
                        react_1.default.createElement("label", { htmlFor: "ride-activity" }, "Welche Aktivit\u00E4t haben Sie vor?"),
                        react_1.default.createElement("select", { onChange: this._setFieldValue, name: "activity" }, Object.keys(constants_1.ACTIVITIES).map((activity, index) => {
                            return react_1.default.createElement("option", { key: index, value: activity }, activity);
                        })))),
                react_1.default.createElement("fieldset", { className: "ride-form-fieldset" },
                    react_1.default.createElement("h3", null, "Datum und Uhrzeit"),
                    react_1.default.createElement("div", { className: "ride-form-row" },
                        react_1.default.createElement("label", { htmlFor: "ride-start" }, "Abfahrt"),
                        react_1.default.createElement("div", { className: "datepicker-wrapper" },
                            react_1.default.createElement(react_datepicker_1.default, { placeholderText: moment_1.default().add(4, 'days').format('LL'), selected: this.state.ride.startDate, onChange: this._handleDatePicker, dateFormat: "LL" }),
                            react_1.default.createElement("select", { className: "select-start-time-hour", onChange: (evt) => {
                                    this._setFieldValue(evt);
                                    this._syncStartTimeFields(evt.target.value);
                                }, value: this.state.ride.startTimeHour, name: "startTimeHour" }, constants_1.HOURS.map((hour, index) => {
                                return react_1.default.createElement("option", { key: index, value: hour }, hour);
                            })),
                            react_1.default.createElement("div", { className: "select-start-time-spacer" }, ":"),
                            react_1.default.createElement("select", { className: "select-start-time-min", onChange: this._setFieldValue, value: this.state.ride.startTimeMin, name: "startTimeMin" }, constants_1.MINS.map((min, index) => {
                                return react_1.default.createElement("option", { key: index, value: min }, min);
                            })),
                            react_1.default.createElement("div", { className: "select-start-time-spacer select-start-time-spacer--time" }, "Uhr"),
                            react_1.default.createElement("br", { style: { clear: "both" } }))),
                    react_1.default.createElement("div", { className: "ride-form-row" },
                        react_1.default.createElement("label", { htmlFor: "ride-return-info" }, "Infos zur R\u00FCckfahrt"),
                        react_1.default.createElement("textarea", { name: "returnInfo", placeholder: "Zum Beispiel: Rückfahrt um 16:00 Uhr am Parkplatz", onChange: this._setFieldValue }))),
                this.state.error &&
                    react_1.default.createElement("div", { className: "error-message dark-red" }, "Please fill in all fields."),
                react_1.default.createElement("div", { className: "ride-form-row ride-form-row--button" },
                    react_1.default.createElement("button", { className: 'f6 link br3 ba ph3 pv2 mb2 dib white bg-blue', onClick: () => this._submit() }, "Submit"))));
        }
        else if (this.state.view === VIEWS.SUCCESS) {
            return (react_1.default.createElement("div", null, "Your ride was saved successfully."));
        }
    }
    /**
     * _buildRide
     * - add userId
     * - add date object
     * @returns {*}
     * @private
     */
    _buildRide() {
        let startDate = this.state.ride.startDate
            .add(parseInt(this.state.ride.startTimeHour, 10), 'hours')
            .add(parseInt(this.state.ride.startTimeMin, 10), 'minutes')
            .toDate();
        console.log(startDate);
        return Object.assign({}, {
            userId: localStorage.getItem(constants_1.GC_USER_ID),
            start: this.state.ride.start,
            end: this.state.ride.end,
            activity: this.state.ride.activity,
            seats: this.state.ride.seats,
            startDate: startDate,
            returnInfo: this.state.ride.returnInfo
        });
    }
}
const AddRideMutation = graphql_tag_1.default `
  mutation addRide($ride: RideInput!) {
    addRide(ride: $ride) {
      id
      userId
      start
      end
      activity
      seats
      startDate
      returnInfo
    }
  }
`;
exports.default = react_apollo_1.graphql(AddRideMutation, { name: 'addRideMutation' })(CreateRide);
//# sourceMappingURL=CreateRide.js.map