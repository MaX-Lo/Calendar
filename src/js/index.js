import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './calendar';
import CalendarView from './calendarView';
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

window.addEventListener('resize', () => calendarView.setWidth(getCalendarContainerWidth()));

window.setInterval(switchCalendar, 5000);


function switchCalendar() {
    currentCalendarIndex = (currentCalendarIndex + 1) % calendars.length;
    lastCalendarChange = new Date();
    updateTitles();
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
    calendarView.setWidth(getCalendarContainerWidth());

    let sketch = (p) => {
        p.setup = () => {
            p.createCanvas(calendarView.getWidth(), calendarView.getHeight());
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
            p.resizeCanvas(calendarView.getWidth(), calendarView.getHeight())
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