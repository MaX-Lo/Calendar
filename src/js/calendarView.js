import * as d3 from "d3";


/**
 * @class abstract class representing a calendar view
 * should be inherited by a specific calendar view implementation
 */
export default class CalendarView {

    // static const aren't supported
    static TRANSITION_DURATION() { return 1500; }

    constructor(width = 0) {
        this._width = width;
        this.svg = d3.select("#calendarContainer").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("g");
    }

    set width(width) {
        if (width < 0) throw new Error("Can't set width to a negative value!");
        this._width = width;
    }

    get width() {
        return this._width;
    }

    get height() {
        throw new Error("Method get height() not implemented!");
    }

    /**
     * abstract draw method which should be overridden by inheriting calendar View
     * @param data - the calendar data as bool array
     * @param date - the current date as Date object
     */
    draw(data, date) {
        throw new Error("Method draw() not implemented!")
    }
}
