import Calendar from "./calendar"
import CalendarView from  "./calendarView"

export default class CalendarViewLandscape extends CalendarView {

    constructor(width = 0) {
        super(width);
        this.daysInALine = 21;

    }

    getDaySize() {
        // eg. for 16 day in a line
        // _width = 6*7 * day_size + 6*6 * day_margin + 5 * month_margin
        // _width = 42 * day_size + 36 * day_size / 10 + 5 * day_size / 2
        // _width = day_size * (42 + 36/10 + 5/2)
        // _width = day_size * 48.1
        return this.width / 48.1
    }

    getDayMargin() {
        return this.getDaySize() / 10;
    }

    get height() {
        return (this.getMonthYOffset() + this.getTextSize()) * 2;
    }

    getMonthMargin() {
        return this.getDaySize() / 2;
    }

    getMonthYOffset() {
        return 5*this.getDaySize() + 4*this.getDayMargin() + this.getMonthMargin() + this.getTextSize();
    }

    getMonthXOffset() {
        return 7*this.getDaySize() + 6*this.getDayMargin() + this.getMonthMargin();
    }

    getTextSize() {
        return this._width / 60;
    }

    drawMonthLabels(svg) {
        let calView = this;
        let monthLabels = svg.selectAll(".monthLabel")
            .data(Calendar.monthNames())
            .enter().append("text")
            .text(function (d) { return d;})
            .attr("x", function (d, i) { return (i % 6) * calView.getMonthXOffset(); })
            .attr("y", function (d, i) { return calView.getTextSize() + Math.floor(i / 6) * calView.getMonthYOffset(); })
            .style("text-anchor", "start");
    }

    drawCalendarContent(svg, data) {
        let calView = this;
        let monthArea = svg.selectAll(".monthRect")
            .data(data)
            .enter().append("g") // g elements are used in svg to group elements
            .attr("transform", function (d, i) {
                return 'translate(' + (i % 6) * calView.getMonthXOffset() + ','
                    + (3/2 * calView.getTextSize() + Math.floor(i/6) * (calView.getMonthYOffset())) + ')'; })
            .selectAll(".dayRect")
            .data(function(d, i) { return d; }) // d is daysData[i]
            .join("rect")
            .attr("x", function (d, i) { return (i % 7) * (calView.getDaySize() + calView.getDayMargin()); })
            .attr("y", function (d, i) { return Math.floor(i/7) * (calView.getDaySize() + calView.getDayMargin()); })
            .attr("width", calView.getDaySize())
            .attr("height", calView.getDaySize())
            .style("fill", "#ffffff")
            .transition().duration(1000)
            .style("fill", function (d, i) { return d ? "#8dff81" : "#eeeeee"; });
    }

    getColor(oldColor, newColor, transitionProgress) {
        return [
            oldColor[0] * (1 - transitionProgress) + newColor[0] * transitionProgress,
            oldColor[1] * (1 - transitionProgress) + newColor[1] * transitionProgress,
            oldColor[2] * (1 - transitionProgress) + newColor[2] * transitionProgress,
        ];
    }
}
