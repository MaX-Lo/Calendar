import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import '../css/styles.css'

import Calendar from './calendar';
import CalendarViewLandscape from './calendarViewLandscape';
import CalendarViewPortrait from './calendarViewPortrait';
import {getCalendarCategories, getCalendarData} from "./dataRepository";
import BarChart from "./frequencyBarChart";

let calView;
if(isMobile()) {
    calView = new CalendarViewPortrait(getCalendarContainerWidth());
} else {
    calView = new CalendarViewLandscape(getCalendarContainerWidth());
}

let calendars = [];
let currentCalendarIndex = 0;


let barChart = new BarChart(getCalendarContainerWidth());
barChart.fillBarChart(calendars[currentCalendarIndex], true);


document.addEventListener('DOMContentLoaded', function () {
    populateCalendars();
    updateDateElement();
});

initBtnClickListener();

function initBtnClickListener() {
    let nextCalendarButton = document.getElementById('nextCalendarBtn');
    nextCalendarButton.addEventListener('click', () => onNextCalendarBtnClickHandler());

    let prevCalendarButton = document.getElementById('prevCalendarBtn');
    prevCalendarButton.addEventListener('click', () => onPrevCalendarBtnClickHandler());

    let addButton = document.getElementById('addBtn');
    addButton.addEventListener('click', () => onAddBtnClickHandler());
}

function updateCalendarView() {
    if (calendars.length === 0) { return; }
    let calendar = calendars[currentCalendarIndex];
    if (!calendar) { return; }
    calendars[currentCalendarIndex].activitiesByWeekday(Calendar.daysOfWeek()[0]);
    barChart.fillBarChart(calendars[currentCalendarIndex],  false);

    calView.draw(calendar.toBoolArray(), new Date());
    updateTitle(calendar.name + " Days");
}

/**
 * sets the current calendar index to the next calendar (or first one in case the current
 * calendar is the last one) and updates the calendar view afterwards
 */

function onNextCalendarBtnClickHandler() {
    currentCalendarIndex = (currentCalendarIndex + 1) % calendars.length;
    updateCalendarView();
}


/**
 * sets the current calendar index to the previous calendar (or last one in case the current
 * calendar is the first one) and updates the calendar view afterwards
 */
function onPrevCalendarBtnClickHandler() {
    currentCalendarIndex = (currentCalendarIndex - 1 + calendars.length) % calendars.length;
    updateCalendarView();
}


/**
 * handles a add button click by navigating to the input page
 */
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

/**
 * updates the page title via a fading animation
 * @param title - the new title
 */
function updateTitle(title) {
    let $title = $("#calendarTitle");
    $title.fadeOut(500);
    setTimeout(() => $title.html(title), 500);
    $title.fadeIn(500);
}

/**
 * updates the date element with the current date
 */
function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

/**
 * get the current date formated as string
 * @returns {string} the current date as DD.MM
 */
function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}

/**
 * returns whether the current user agent is a mobile device
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}