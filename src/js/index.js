import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './calendar';
import CalendarView from './calendarView';
import {getCalendarCategories, getCalendarData} from "./dataRepository";

let calendarView = new CalendarView();
let calendars = [];
let currentCalendarIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
    populateCalendar();
    initCalendarView();
    updateTitles();
    updateDateElement();
});

window.setInterval(switchCalendar, 2000);

function switchCalendar() {
    currentCalendarIndex = (currentCalendarIndex + 1) % calendars.length;
    updateTitles();
}

function updateTitles() {
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
    let calendar = new Calendar(category.name, category.color);
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
    calendarView.setWidth(getCalendarContainerWidth());

    let sketch = (p) => {
        p.setup = () => {
            p.createCanvas(calendarView.getWidth(), calendarView.getHeight());
        };
        p.draw = () => {
            p.background(255);
            p.noStroke();
            calendarView.draw(p, calendars[currentCalendarIndex]);
        };
    };

    let P5 = new p5(sketch, document.getElementById('calendarContainer'));
}

function getCalendarContainerWidth() {
    return document.getElementById('calendarContainer').offsetWidth;
}

function setLeftTitle(title) {
    document.getElementById("leftTitle").innerHTML = title;
}

function setCenterTitle(title) {
    document.getElementById("centerTitle").innerHTML = title;
}

function setRightTitle(title) {
    document.getElementById("rightTitle").innerHTML = title;
}

function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}