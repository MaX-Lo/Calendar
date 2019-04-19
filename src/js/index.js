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

let svg = d3.select("#calendarContainer").append("svg")
    .attr("width", calView.width)
    .attr("height", calView.height)
    .append("g");


document.addEventListener('DOMContentLoaded', function () {
    populateCalendars();
    updateDateElement();
});

let nextCalendarButton = document.getElementById('nextCalendarBtn');
nextCalendarButton.addEventListener('click', () => onNextCalendarBtnClickHandler());
let prevCalendarButton = document.getElementById('prevCalendarBtn');
prevCalendarButton.addEventListener('click', () => onPrevCalendarBtnClickHandler());


function updateCalendarView() {
    if (calendars.length === 0) { return; }
    let calendar = calendars[currentCalendarIndex];
    if (!calendar) { return; }
    calView.drawMonthLabels(svg);
    calView.drawCalendarContent(svg, calendar.toBoolArray());
    calView.highlightCurrentDay(svg, new Date());
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