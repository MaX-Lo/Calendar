import Calendar from "./calendar"
import CalendarView from  "./calendarView"



export default class CalendarViewLandscape extends CalendarView {

    constructor(width = 0) {
        super(width);
    }

    getDaySize() {
        // eg. for 7 days in a line
        // _width = 7 * day_size + 6 * day_margin
        // _width = 7 * day_size + 6 * day_size / 10
        // _width = day_size * (7 + 6/10)
        // _width = day_size * 7.6
        return this.width / 7.6
    }

    getDayMargin() {
        return this.getDaySize() / 10;
    }

    get height() {
        return this.getMonthYOffset(12);
    }

    getMonthMargin() {
        return this.getDaySize() / 2;
    }

    getMonthYOffset(monthIdx) {
        return this.getTextSize() +
            monthIdx * (5*this.getDaySize() + 4*this.getDayMargin() + this.getMonthMargin()
                + 2 * this.getTextSize() + (this.getMondayHintRadi() * 2 + 8));
    }

    getMonthXOffset() {
        return 0;
    }

    getTextSize() {
        return this.width / 25;
    }

    getMondayHintRadi() {
        return this.getTextSize() / 4;
    }

    /**
     * @override
     * draws the calendar
     */
    draw(data, date) {

        this.clear();
        this.drawMonthLabels();
        this.drawCalendarContent(data);
        this.drawMondayDots();
        this.drawCurrDayHighlight(date);
    }

    clear() {
        this.svg.selectAll("*").remove();
    }

    drawMonthLabels() {
        let calView = this;
        let monthLabels = this.svg.selectAll(".monthLabel")
            .data(Calendar.monthNames())
            .enter().append("text")
            .text(function (d) { return d;})
            .attr("x", function (d, i) { return calView.getMonthXOffset(); })
            .attr("y", function (d, i) { return calView.getMonthYOffset(i); })
            .style("text-anchor", "start")
            .style("fill", "#222222")
            .style("font-size", this.getTextSize().toString() + "px");
    }

    /**
     * for each month draw a dot above the column corresponding to mondays
     */
    drawMondayDots() {
        let data = [];
        let date = new Date();
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
            date.setMonth(monthIdx);
            date.setDate(1);
            let mondayColumnIdx =  (8 - date.getDay()) % 7;
            data.push(mondayColumnIdx);
        }
        console.log("Month data: " + data);
        let calView = this;

        this.svg.selectAll(".mondayDots")
            .data(data)
            .join("circle")
            .attr("transform", function (d, i) {
                return 'translate(' + i * calView.getMonthXOffset() + ','
                    + (2 * calView.getTextSize() + calView.getMonthYOffset(i)) + ')'; })
            .attr("cx", function (d, i) {
                return d * (calView.getDaySize() + calView.getDayMargin()) + calView.getDaySize() / 2
            })
            .attr("cy", -calView.getDaySize()/4)
            .attr("r", this.getMondayHintRadi())
            .style("fill", "#007bff")
    }

    drawCalendarContent(data) {
        let calView = this;
        let monthArea = this.svg.selectAll(".monthRect")
            .data(data)
            .enter().append("g") // g elements are used in svg to group elements
            .attr("transform", function (d, i) {
                return 'translate(' + i * calView.getMonthXOffset() + ','
                    + (2 * calView.getTextSize() + calView.getMonthYOffset(i)) + ')'; })
            .selectAll(".dayRect")
            .data(function(d, i) { return d; }) // d is daysData[i]
            .join("rect")
            .attr("x", function (d, i) { return (i % 7) * (calView.getDaySize() + calView.getDayMargin()); })
            .attr("y", function (d, i) { return Math.floor(i/7) * (calView.getDaySize() + calView.getDayMargin()); })
            .attr("width", calView.getDaySize())
            .attr("height", calView.getDaySize())
            .style("fill", "#ffffff")
            .transition().duration(CalendarView.TRANSITION_DURATION)
            .style("fill", function (d, i) { return d ? "#007bff" : "#eeeeee"; });
    }

    drawCurrDayHighlight(date) {
        let month = date.getMonth();
        let day = date.getDate() - 1;
        let x = month * this.getMonthXOffset() +
            (day % 7) * (this.getDaySize() + this.getDayMargin());
        let y = 2 * this.getTextSize() + this.getMonthYOffset(month) +
            Math.floor(day/7) * (this.getDaySize() + this.getDayMargin());
        this.svg.selectAll(".monthLabel").data([1]).join("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", this.getDaySize())
            .attr("height", this.getDaySize())
            .style("fill-opacity", 0)
            .style("stroke", "#ff1111")
            .style("stroke-width", 1.5)
            .style("stroke-opacity", 0)
            .transition().duration(CalendarView.TRANSITION_DURATION)
            .style("stroke-opacity", 1) ;
    }
}
