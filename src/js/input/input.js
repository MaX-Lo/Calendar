import 'bootstrap';
import 'bootstrap-datepicker'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.min.css'

import {getCalendarCategories, addActivity} from "../dataRepository";

document.addEventListener('DOMContentLoaded', function () {
    initDatePicker();
    populateDropdown();
});

let addActivityButton = document.getElementById('addButton');
addActivityButton.addEventListener('click', () => handleAddActivityButtonClick());

function populateDropdown() {
    getCalendarCategories((categories) => setDropdownData(categories));
}

function setDropdownData(categories) {
    let selectList = document.getElementById('categoriesSelect');
    categories.forEach((category) => {
        let option = document.createElement("option");
        option.text = category.name;
        selectList.add(option);
    });
}

function handleAddActivityButtonClick() {
    let categoriesSelect = document.getElementById("categoriesSelect");
    let category = categoriesSelect.options[categoriesSelect.selectedIndex].value;
    let datePickerInput = document.getElementById("datePickerInput");
    let date = datePickerInput.value;

    let activity = {category: category, date: date};
    addActivity(activity)
}

function initDatePicker() {
    let $datePicker = $('#datePicker');
    $datePicker.datepicker({
        format: 'yyyy-mm-dd'
    }).datepicker("setDate",'now');
    $datePicker.on('changeDate', function() {
        $('#datePickerInput').val(
            $datePicker.datepicker('getFormattedDate')
        );
    });
}
