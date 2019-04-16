import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3'

import '../css/styles.css'

import Calendar from './calendar';
import CalendarView from './calendarViewLandscape';
import {getCalendarCategories, getCalendarData} from "./dataRepository";

let calendarView = new CalendarView();
let calendars = [];
let currentCalendarIndex = 0;
let lastCalendarChange = new Date();

document.addEventListener('DOMContentLoaded', function () {
    populateCalendar();
    initCalendarView();
    updateTitles();
    updateDateElement();
});

window.addEventListener('resize', () => calendarView.width = getCalendarContainerWidth());

window.setInterval(switchCalendar, 5000);

let margin = { top: 50, right: 30, bottom: 100, left: 30 };
let width = getCalendarContainerWidth();
let daySize = width / 48.1;
let dayMargin = daySize / 10;
let monthMargin = daySize / 2;
let textSize = width / 60;
let monthYOffset = 5 * daySize + 4 * dayMargin + monthMargin + textSize;
let monthXOffset = 7 * daySize + 6 * dayMargin + monthMargin;
let height = monthYOffset + 2 * textSize;
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let mockDaysData = [];
for (let i = 0; i < 12; i++) {
    let monthData = Array.from({length: monthLengths[i]}, () => Math.random() > 0.5);
    mockDaysData.push(monthData);
}
let data = mockDaysData;

let svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let monthLabels = svg.selectAll(".monthLabel")
    .data(months)
    .enter().append("text")
    .text(function (d) { return d;})
    .attr("x", function (d, i) { return (i % 6) * monthXOffset; })
    .attr("y", function (d, i) { return Math.floor(i / 6) * monthYOffset; })
    .style("text-anchor", "start");

function cal(data) {
    let monthArea = svg.selectAll(".monthRect")
        .data(data)
        .enter().append("g") // g elements are used in svg to group elements
        .attr("transform", function (d, i) {
            return 'translate(' + (i % 6) * monthXOffset + ','
                + (textSize/2 + Math.floor(i/6) * (monthYOffset)) + ')'; })
        .selectAll(".dayRect")
        .data(function(d, i) { return d; }) // d is daysData[i]
        .join("rect")
        .attr("x", function (d, i) { return (i % 7) * (daySize + dayMargin); })
        .attr("y", function (d, i) { return Math.floor(i/7) * (daySize + dayMargin); })
        .attr("width", daySize)
        .attr("height", daySize)
        .style("fill", "#ffffff")
        .transition().duration(1000)
        .style("fill", function (d, i) { return d ? "#8dff81" : "#eeeeee"; });
}

function switchCalendar() {
    currentCalendarIndex = (currentCalendarIndex + 1) % calendars.length;
    lastCalendarChange = new Date();
    updateCalendarView();
    updateTitles();
}

function updateCalendarView() {
    let calendar = calendars[currentCalendarIndex];
    data = calendarToBoolArray(calendar);
   cal(data);
}

function calendarToBoolArray(calendar) {
    let year = new Date().getFullYear();
    let yearsData = [];
    for (let monthNum = 0; monthNum < 12; monthNum++) {
        let monthData = [];
        for (let dayNum = 0; dayNum < monthLengths[monthNum]; dayNum++) {
            let date = new Date(year, monthNum, dayNum + 2);
            if (calendar.getActivitiesForDate(date).length > 0) {
                monthData.push(true);
            } else {
                monthData.push(false);
            }
        }
        yearsData.push(monthData)
    }
    return yearsData;
}

function updateTitles() {
    if (calendars.length === 0) {
        return;
    }
    setCenterTitle(calendars[currentCalendarIndex].name);
    if (calendars.length > 1) {
        let lastIndex = (currentCalendarIndex - 1 + calendars.length) % calendars.length;
        setLeftTitle(calendars[lastIndex].name);
    }
    if (calendars.length > 2) {
        let nextIndex = (currentCalendarIndex + 1) % calendars.length;
        setRightTitle(calendars[nextIndex].name);
    }
}

function populateCalendar() {
    getCalendarCategories((categories) => {
        for (let category of categories) {
            addCalendar(category);
            getCalendarData(category.name, (activities) => addActivities(category.name, activities));
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

function initCalendarView() {
    calendarView.width = getCalendarContainerWidth();

    let sketch = (p) => {
        p.setup = () => {
            p.createCanvas(calendarView.width, calendarView.height);
        };
        p.draw = () => {
            p.background(255);
            p.noStroke();
            if (calendars.length > 0) {
                if (calendars.length > 1) {
                    let lastIndex = (currentCalendarIndex - 1 + calendars.length) % calendars.length;
                    let transitionProgress = Math.min((new Date() - lastCalendarChange) / 1500, 1);
                    // console.log(transitionProgress);
                    calendarView.draw(p, calendars[currentCalendarIndex], calendars[lastIndex], transitionProgress)
                } else {
                    calendarView.draw(p, calendars[currentCalendarIndex]);
                }
            }
        };
        p.windowResized = () => {
            p.resizeCanvas(calendarView.width, calendarView.height)
        }
    };

    let P5 = new p5(sketch, document.getElementById('calendarContainer'));
}

function getCalendarContainerWidth() {
    return document.getElementById('calendarContainer').offsetWidth;
}

function setLeftTitle(title) {
    updateTitle(title, "#leftTitle");
}

function setCenterTitle(title) {
    updateTitle(title, "#centerTitle");
}

function setRightTitle(title) {
    updateTitle(title, "#rightTitle");
}

function updateTitle(title, elementId) {
    let $title = $(elementId);
    $title.fadeOut(1500);
    setTimeout(() => $title.html(title), 1500);
    $title.fadeIn(1500);
}

function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}