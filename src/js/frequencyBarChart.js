import * as d3 from "d3";
import Calendar from "./calendar";

/**
 * a bar chart showing for a calendar the entry count by weekday
 */

export default class FrequencyBarChart {

    constructor(width) {
        // set the dimensions and margins of the bar chart
        this.margin = {top: 20, right: 20, bottom: 110, left: 25};
        if (width === undefined) {
            this.width = 550 - this.margin.left - this.margin.right;
        } else {
            this.width = width;
        }
        this.height = 250 - this.margin.top - this.margin.bottom;

        this.svg = d3.select("#weekdayBarChart").append("svg")
            .attr("width", this.width)
            .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    }


    fillBarChart(calendar, init) {
        // set the ranges and padding between bars
        let x = d3.scaleBand().range([0, this.width]).padding(0.1);
        let y = d3.scaleLinear().range([this.height, 0]);

        let data = this.generateBarChartData(calendar);

        // select all bars on the graph, take them out, and exit the previous data set.
        let bars = this.svg.selectAll(".bar")
            .remove()
            .exit()
            .data(data);

        // Scale the range of the data in the domains
        x.domain(data.map(d => d.dayOfWeek));
        y.domain([0, d3.max(data, d => parseFloat(d.count))]).nice(5).ticks(5);

        let h = this.height;
        // append the rectangles for the bar chart
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function (d) {
                return x(d.dayOfWeek);
            })
            .attr("width", x.bandwidth())
            .attr("y", function (d) {
                return y(d.count);
            })
            .attr("height", function (d) {
                return h - y(parseFloat(d.count));
            })
            .attr("id", function (d) {
                return d.dayOfWeek;
            })
            .style("fill", "#007bff");

        if (init) {
            // add the x Axis
            this.svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0," + h + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("y", 17)
                .attr("x", -8)
                .attr("dy", ".35em")
                //.attr("transform", "rotate(90)")
                .style("text-anchor", "start");
            // add the y Axis
            this.svg.append("g")
                .attr("class", "y axis")
                .call(d3.axisLeft(y))
                .selectAll("text")
                .attr("dy", "0em");
        } else {
            // update the y Axis
            this.svg.select(".y").call(d3.axisLeft(y).tickFormat(d3.format("d")));
        }
    }

    /**
     * @param calendar - the calendar the bar chart should show frequency by weekday for
     * @returns {[]}
     */
    generateBarChartData(calendar) {
        console.log("calendar:" + calendar);
        if (calendar === undefined) {
            return this.generateEmptyBarChartData();
        }

        let data = [];
        for (let i = 0; i < Calendar.daysOfWeek().length; i++) {
            let count = calendar.activitiesByWeekday(i).length;
            let dayOfWeek = Calendar.daysOfWeek()[i];
            data.push({dayOfWeek: dayOfWeek, count: count});
        }
        return data;
    }

    /**
     * @returns [] with a activity count of 0 for every weekday which can be used in case of an undefined calendar
     **/
    generateEmptyBarChartData() {
        let data = [];
        for (let i = 0; i < Calendar.daysOfWeek().length; i++) {
            let count = 0;
            let dayOfWeek = Calendar.daysOfWeek()[i];
            data.push({dayOfWeek: dayOfWeek, count: count});
        }
        return data;
    }
}

