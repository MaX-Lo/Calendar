import * as p5 from 'p5';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Calendar from './calendar';
import CalendarView from './calendarView';

let mockData = [
    false, true, true, false, true, false, true,
    true, true, true, true, false, true, true,
    true, false, true, true, true, true, true,
    true, true, false, true, true, false, false,
    true, true, true
];

console.log('test');

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
    let calendar = new Calendar([mockData]);

    let sketch = (p) => {
        p.setup = () => {
            console.log('create p5');
            p.createCanvas(calendarView.getWidth(), calendarView.getHeight());
        };
        p.draw = () => {
            p.background(255);
            p.noStroke();
            calendarView.drawEmptyCells(p, calendar);
            //calendarView.drawCaptions(p, calendar);
            calendarView.draw(p, calendar)
        };
    };

    new p5(sketch, 'calendarContainer');
}

function updateDateElement() {
    let dateElement = document.getElementById('date');
    dateElement.innerHTML = getDateString();
}

function getDateString() {
    let date = new Date();
    return `${date.getDate()}.${date.getMonth() + 1}.`;
}