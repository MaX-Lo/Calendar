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
        return 5*this.getDaySize() + 4*this.getDayMargin() + this.getMonthMargin() + 1.5 * this.getTextSize();
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
            .style("text-anchor", "start")
            .style("fill", "#222222");
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
            .style("fill", function (d, i) { return d ? "#007bff" : "#eeeeee"; });
    }

    highlightCurrentDay(svg, date) {
        let month = date.getMonth();
        let day = date.getDate() - 1;
        console.log(`day ${day} month ${month}`);
        let x = (month % 6) * this.getMonthXOffset() +
            (day % 7) * (this.getDaySize() + this.getDayMargin());
        let y = 3/2 * this.getTextSize() + Math.floor(month / 6) * this.getMonthYOffset() +
            Math.floor(day/7) * (this.getDaySize() + this.getDayMargin());
        svg.selectAll(".monthLabel").data([1]).join("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", this.getDaySize())
            .attr("height", this.getDaySize())
            .style("fill-opacity", 0)
            .style("stroke", "#ff1111") ;
    }
}
