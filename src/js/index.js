import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as d3 from 'd3'

import '../css/styles.css'

import Calendar from './calendar';
import CalendarView from './calendarViewLandscape';
import {getCalendarCategories, getCalendarData} from "./dataRepository";

let calView = new CalendarView();
let calendars = [];
let currentCalendarIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    populateCalendars();
    updateTitles();
    updateDateElement();
});

calView.width = getCalendarContainerWidth();

let svg = d3.select("#calendarContainer").append("svg")
    .attr("width", calView.width)
    .attr("height", calView.height)
    .append("g");


function updateCalendarView() {
    let calendar = calendars[0];
    for (let i=0; i < calendars.length; i++) {
        if (calendars[i].name === "Climbing") {
            calendar = calendars[i];
            break;
        }
    }
    if (!calendar)
        return;
    calView.drawMonthLabels(svg);
    calView.drawCalendarContent(svg, calendar.toBoolArray());
    updateTitle(calendar.name, "#calendarTitle");
}

function populateCalendars() {
    getCalendarCategories((categories) => {
        for (let category of categories) {
            addCalendar(category);
            getCalendarData(category.name, (activities) => {
                addActivities(category.name, activities);
                console.log(category.name);
                if (category.name === "Climbing") {
                    updateCalendarView()
                }
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
    $title.fadeOut(500);
    setTimeout(() => $title.html(title), 1500);
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