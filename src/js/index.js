import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3'

import '../css/styles.css'

import Calendar from './calendar';
import CalendarView from './calendarViewLandscape';
import {getCalendarCategories, getCalendarData} from "./dataRepository";

let calView = new CalendarView();
calView.width = getCalendarContainerWidth();

let calendars = [];
let currentCalendarIndex = 0;

// set the dimensions and margins of the bar chart
let margin = {top: 20, right: 20, bottom: 110, left: 40};
let width = 550 - margin.left - margin.right;
let height = 250 - margin.top - margin.bottom;

let svg = d3.select("#calendarContainer").append("svg")
    .attr("width", calView.width)
    .attr("height", calView.height)
    .append("g");
let svg1 = d3.select("#weekdayBarChart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

fillBarChart(svg1, true);

function generateBarChartData() {
    if (calendars.length - 1 < currentCalendarIndex) {
        return generateEmptyBarChartData();
    }

    let calendar = calendars[currentCalendarIndex];
    let data = [];
    for (let i = 0; i < Calendar.daysOfWeek().length; i++) {
        let count = calendar.activitiesByWeekday(i).length;
        let dayOfWeek = Calendar.daysOfWeek()[i];
        data.push({dayOfWeek: dayOfWeek, count: count});
    }
    return data;
}

function generateEmptyBarChartData() {
    let data = [];
    for (let i = 0; i < Calendar.daysOfWeek().length; i++) {
        let count = 0;
        let dayOfWeek = Calendar.daysOfWeek()[i];
        data.push({dayOfWeek: dayOfWeek, count: count});
    }
    return data;
}

function fillBarChart(svg, init) {
    // set the ranges and padding between bars
    let x = d3.scaleBand().range([0, width]).padding(0.1);
    let y = d3.scaleLinear().range([height, 0]);

    let data = generateBarChartData();

    // select all bars on the graph, take them out, and exit the previous data set.
    let bars = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(data);

    // Scale the range of the data in the domains
    x.domain(data.map(d => d.dayOfWeek));
    y.domain([0, d3.max(data, d => parseFloat(d.count) )]).nice(5).ticks(5);

    // append the rectangles for the bar chart
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.dayOfWeek); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(parseFloat(d.count)); })
        .attr("id", function(d) { return d.dayOfWeek;})
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


document.addEventListener('DOMContentLoaded', function () {
    populateCalendars();
    updateDateElement();
});

let nextCalendarButton = document.getElementById('nextCalendarBtn');
nextCalendarButton.addEventListener('click', () => onNextCalendarBtnClickHandler());

let prevCalendarButton = document.getElementById('prevCalendarBtn');
prevCalendarButton.addEventListener('click', () => onPrevCalendarBtnClickHandler());

let addButton = document.getElementById('addBtn');
addButton.addEventListener('click', () => onAddBtnClickHandler());


function updateCalendarView() {
    if (calendars.length === 0) { return; }
    let calendar = calendars[currentCalendarIndex];
    if (!calendar) { return; }
    calendars[currentCalendarIndex].activitiesByWeekday(Calendar.daysOfWeek()[0]);
    fillBarChart(svg1, false);

    calView.draw(svg, calendar.toBoolArray(), new Date());
    updateTitle(calendar.name + " Days");
}

function onNextCalendarBtnClickHandler() {
    currentCalendarIndex = (currentCalendarIndex + 1) % calendars.length;
    updateCalendarView();
}

function onPrevCalendarBtnClickHandler() {
    currentCalendarIndex = (currentCalendarIndex - 1 + calendars.length) % calendars.length;
    updateCalendarView();
}

function onAddBtnClickHandler() {
    window.location.href = window.location.origin + '/input.html'
}

function populateCalendars() {
    getCalendarCategories((categories) => {
        for (let category of categories) {
            addCalendar(category);
            getCalendarData(category.name, (activities) => {
                addActivities(category.name, activities);
                // calendar view should only be updated after data for the first calendar is received
                if (calendars.length !== 0 && calendars[0].name === category.name) {
                    updateCalendarView(); }
            });
        }
    });
}

function addCalendar(category) {
    let calendar;
    if (category.color === null || category.color === undefined) {
        calendar = new Calendar(category.name);
    } else {
        calendar = new Calendar(category.name, category.color);
    }
    calendars.push(calendar);
}

function addActivities(categoryName, activities) {
    for (let calendar of calendars) {
        if (calendar.name === categoryName) {
            calendar.setActivities(activities);
            break;
        }
    }
}

function getCalendarContainerWidth() {
    return document.getElementById('calendarContainer').offsetWidth;
}

function updateTitle(title) {
    let $title = $("#calendarTitle");
    $title.fadeOut(500);
    setTimeout(() => $title.html(title), 500);
    $title.fadeIn(500);
}

function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}