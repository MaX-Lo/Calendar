import Calendar from "./calendar";

export default class CalendarView {

    // static const aren't supported
    static TRANSITION_DURATION() { return 1500; }

    constructor(width = 0) {
        this._width = width;
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

    draw(p, calendar, oldCalendar = calendar, transitionProgress = 1) {
        throw new Error("Method draw() not implemented!")
    }
}
