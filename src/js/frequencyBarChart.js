import * as d3 from "d3";
import Calendar from "./calendar";

/**
 * a bar chart showing for a calendar the entry count by weekday
 */

// set the dimensions and margins of the bar chart
let margin = {top: 20, right: 20, bottom: 110, left: 40};
let width = 550 - margin.left - margin.right;
let height = 250 - margin.top - margin.bottom;

let svg = d3.select("#weekdayBarChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

export function fillBarChart(calendar, init) {
    // set the ranges and padding between bars
    let x = d3.scaleBand().range([0, width]).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);

    let data = generateBarChartData(calendar);

    // select all bars on the graph, take them out, and exit the previous data set.
    let bars = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(data);

    // Scale the range of the data in the domains
    x.domain(data.map(d => d.dayOfWeek));
    y.domain([0, d3.max(data, d => parseFloat(d.count))]).nice(5).ticks(5);

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
            return height - y(parseFloat(d.count));
        })
        .attr("id", function (d) {
            return d.dayOfWeek;
        })
        .style("fill", "#007bff");

    if (init) {
        // add the x Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 17)
            .attr("x", -8)
            .attr("dy", ".35em")
            //.attr("transform", "rotate(90)")
            .style("text-anchor", "start");
        // add the y Axis
        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .attr("dy", "0em");
    } else {
        // update the y Axis
        svg.select(".y").call(d3.axisLeft(y));
    }
}

/**
 * @param calendar - the calendar the bar chart should show frequency by weekday for
 * @returns {[]}
 */
function generateBarChartData(calendar) {
    console.log("calendar:" + calendar);
    if (calendar === undefined) {
        return generateEmptyBarChartData();
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
function generateEmptyBarChartData() {
    let data = [];
    for (let i = 0; i < Calendar.daysOfWeek().length; i++) {
        let count = 0;
        let dayOfWeek = Calendar.daysOfWeek()[i];
        data.push({dayOfWeek: dayOfWeek, count: count});
    }
    return data;
}

