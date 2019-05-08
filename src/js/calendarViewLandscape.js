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

    draw(svg, data, date) {
        this.clear(svg);
        this.drawMonthLabels(svg);
        this.drawCalendarContent(svg, data);
        this.drawMondayDots(svg);
        this.drawCurrDayHighlight(svg, date);
    }

    clear(svg) {
        svg.selectAll("*").remove();
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

    /**
     * for each month draw a dot above the column corresponding to mondays
     * @param  svg - to draw on
     * @param data - a array of length 12 containing for each month (index) which column index corresponds
     *               to mondays
     */
    drawMondayDots(svg) {
        let data = [];
        let date = new Date();
        for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
            date.setMonth(monthIdx);
            date.setDate(1);
            console.log(date);
            let mondayColumnIdx =  (8 - date.getDay()) % 7;
            console.log(mondayColumnIdx);
            data.push(mondayColumnIdx);
        }
        console.log("Month data: " + data);
        let calView = this;

        let mondayDots = svg.selectAll(".mondayDots")
            .data(data)
            .join("circle")
            .attr("transform", function (d, i) {
                return 'translate(' + (i % 6) * calView.getMonthXOffset() + ','
                    + (2 * calView.getTextSize() + Math.floor(i/6) * (calView.getMonthYOffset())) + ')'; })
            .attr("cx", function (d, i) {
                return d * (calView.getDaySize() + calView.getDayMargin()) + calView.getDaySize() / 2
            })
            .attr("cy", -calView.getDaySize()/4)
            .attr("r", 3)
            .style("fill", "#007bff")
    }

    drawCalendarContent(svg, data) {
        let calView = this;
        let monthArea = svg.selectAll(".monthRect")
            .data(data)
            .enter().append("g") // g elements are used in svg to group elements
            .attr("transform", function (d, i) {
                return 'translate(' + (i % 6) * calView.getMonthXOffset() + ','
                    + (2 * calView.getTextSize() + Math.floor(i/6) * (calView.getMonthYOffset())) + ')'; })
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

    drawCurrDayHighlight(svg, date) {
        let month = date.getMonth();
        let day = date.getDate() - 1;
        let x = (month % 6) * this.getMonthXOffset() +
            (day % 7) * (this.getDaySize() + this.getDayMargin());
        let y = 2 * this.getTextSize() + Math.floor(month / 6) * this.getMonthYOffset() +
            Math.floor(day/7) * (this.getDaySize() + this.getDayMargin());
        svg.selectAll(".monthLabel").data([1]).join("rect")
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
