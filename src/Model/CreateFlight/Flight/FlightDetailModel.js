import BaseModel from '../../../Core/Model/BaseModel';
import FlightSummaryModel from './FlightSummaryModel';
import HoleUserModel from './HoleUserModel';
import ListPathModel from '../ListPathModel'

export default class FlightDetailModel extends BaseModel {
    constructor(baseComponent) {
        super(baseComponent);
        this.flight = {};
        this.flight_holes = [];
        this.flight_paths = {};
        this.similar_flights = [];
        this.similar_text = '';
    }

    parseData(jsonData) {
        super.parseData(jsonData);
        if (this.data.hasOwnProperty('flight')) {
            let flight = this.data['flight'];
            this.flight = new FlightSummaryModel();
            this.flight.parseData(flight ? flight : {});
        }
        if (this.data.hasOwnProperty('flight_holes')) {
            let holeDetails = this.data['flight_holes'];
            if (holeDetails) {
                for (let obj of holeDetails) {
                    let holeDetailModel = new HoleUserModel();
                    holeDetailModel.parseData(obj);
                    this.flight_holes.push(holeDetailModel);
                }
            }

        }
        if (this.data.hasOwnProperty('flight_paths')) {
            let flightPath = this.data['flight_paths'];
            this.flight_paths = new ListPathModel();
            this.flight_paths.parseJsonData(flightPath ? flightPath : {});
        }
        if (this.data.hasOwnProperty('similar_flights')) {
            let similarFlights = this.data['similar_flights'];
            if (similarFlights) {
                for (let obj of similarFlights) {
                    let similarFlight = new FlightSummaryModel();
                    similarFlight.parseData(obj);
                    this.similar_flights.push(similarFlight);
                }
            }

        }

        if (this.data.hasOwnProperty('similar_text')) {
            this.similar_text = this.data['similar_text'];
        }
    }

    getFlight() {
        return this.flight;
    }

    getFlightHoles() {
        return this.flight_holes;
    }

    getFlightPath() {
        return this.flight_paths;
    }

    setFlight(_flight) {
        this.flight = _flight;
    }

    setFlightPath(_flightPaths) {
        this.flight_paths = _flightPaths;
    }

    getSimilarFlights() {
        return this.similar_flights ? this.similar_flights : [];
    }

    getSimilarText() {
        return this.similar_text ? this.similar_text : '';
    }

}
