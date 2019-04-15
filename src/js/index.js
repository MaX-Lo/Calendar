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
let width = 960 - margin.left - margin.right;
let daySize = width / 48.1;
let dayMargin = daySize / 10;
let monthMargin = daySize / 2;
let textSize = width / 60;
let monthYOffset = 5 * daySize + 4 * dayMargin + monthMargin + textSize;
let monthXOffset = 7 * daySize + 6 * dayMargin + monthMargin;
// let height = 430 - margin.top - margin.bottom;
let height = monthYOffset + 2 * textSize;
let gridSize = Math.floor(width / 24);
let legendElementWidth = gridSize*2;
let buckets = 9;
let colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"]; // alternatively colorbrewer.YlGnBu[9]
let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let mockDaysData = []
for (let i = 0; i < 12; i++) {
    let monthData = Array.from({length: monthLengths[i]}, () => Math.random() > 0.5);
    mockDaysData.push(monthData);
}
let daysData = mockDaysData;
let datasets = ["data.tsv", "data2.tsv"];

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

let monthArea = svg.selectAll(".monthRect")
    .data(daysData)
    .enter().append("g") // g elements are used in svg to group elements
    .attr("transform", function (d, i) {
        return 'translate(' + (i % 6) * monthXOffset + ','
            + (textSize/2 + Math.floor(i/6) * (monthYOffset)) + ')'; })
    .selectAll(".dayRect")
    .data(function(d, i) { return d; }) // d is daysData[i]
    .enter().append("rect")
    .attr("x", function (d, i) { return (i % 7) * (daySize + dayMargin); })
    .attr("y", function (d, i) { return Math.floor(i/7) * (daySize + dayMargin); })
    .attr("width", daySize)
    .attr("height", daySize)
    // .style("fill", "#ffffff")
    // .transition()
    // .attr("delay", 2000)
    // .attr("duration", 2000)
    .style("fill", function (d, i) { return d ? "#8dff81" : "#ff8d81"; });

var heatmapChart = function(tsvFile) {
    d3.tsv(tsvFile,
        function(d) {
            return {
                day: +d.day,
                hour: +d.hour,
                value: +d.value
            };
        },
        function(error, data) {
            var colorScale = d3.scale.quantile()
                .domain([0, buckets - 1, d3.max(data, function (d) { return d.value; })])
                .range(colors);

            var cards = svg.selectAll(".hour")
                .data(data, function(d) {return d.day+':'+d.hour;});

            cards.append("title");

            cards.enter().append("rect")
                .attr("x", function(d) { return (d.hour - 1) * gridSize; })
                .attr("y", function(d) { return (d.day - 1) * gridSize; })
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("class", "hour bordered")
                .attr("width", gridSize)
                .attr("height", gridSize)
                .style("fill", colors[0]);

            cards.transition().duration(1000)
                .style("fill", function(d) { return colorScale(d.value); });

            cards.select("title").text(function(d) { return d.value; });

            cards.exit().remove();

            var legend = svg.selectAll(".legend")
                .data([0].concat(colorScale.quantiles()), function(d) { return d; });

            legend.enter().append("g")
                .attr("class", "legend");

            legend.append("rect")
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height)
                .attr("width", legendElementWidth)
                .attr("height", gridSize / 2)
                .style("fill", function(d, i) { return colors[i]; });

            legend.append("text")
                .attr("class", "mono")
                .text(function(d) { return "≥ " + Math.round(d); })
                .attr("x", function(d, i) { return legendElementWidth * i; })
                .attr("y", height + gridSize);

            legend.exit().remove();

        });
};

heatmapChart(datasets[0]);

var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
    .data(datasets);

datasetpicker.enter()
    .append("input")
    .attr("value", function(d){ return "Dataset " + d })
    .attr("type", "button")
    .attr("class", "dataset-button")
    .on("click", function(d) {
        heatmapChart(d);
    });

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