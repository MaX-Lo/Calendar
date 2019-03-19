import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './calendar';
import CalendarView from './calendarView';
import {getCalendarCategories, getCalendarData} from "./dataRepository";

getCalendarData("climbing", (data) => console.log(data));

document.addEventListener('DOMContentLoaded', function () {
    updateDateElement();
    initCalendarView();
});

function getCalendarContainerWidth() {
    return document.getElementById('calendarContainer').offsetWidth;
}

function initCalendarView() {
    console.log("div width" + getCalendarContainerWidth());
    let calendarView = new CalendarView(getCalendarContainerWidth());
    let calendar = new Calendar();

    let sketch = (p) => {
        p.setup = () => {
            console.log('create p5');
            p.createCanvas(calendarView.getWidth(), calendarView.getHeight());
        };
        p.draw = () => {
            p.background(255);
            p.noStroke();
            calendarView.draw(p, calendar);
        };
    };

    new p5(sketch, document.getElementById('calendarContainer'));
}

function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}