import 'bootstrap';
import 'bootstrap-datepicker'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.min.css'

import {getCalendarCategories, addActivity, addCategory} from "../dataRepository";

initResponseNotification();

document.addEventListener('DOMContentLoaded', function () {
    initDatePicker();
    populateDropdown();
});

let addActivityButton = $('#addActivityBtn').click(() => onAddActivityButtonClickHandler());
let addCategoryButton = $('#addCategoryBtn').click(() => onAddCategoryButtonClickHandler());
let openAddCategoryModal = $('#openNewCategoryModalBtn').click(() => $("#addCategoryModal").modal());

function populateDropdown() {
    getCalendarCategories((categories) => setDropdownData(categories));
}

function setDropdownData(categories) {
    clearCategorySelect();
    let selectList = document.getElementById('categoriesSelect');
    categories.forEach((category) => {
        let option = document.createElement("option");
        option.text = category.name;
        selectList.add(option);
    });
}

function clearCategorySelect() {
    categoriesSelect.find('option')
        .remove()
        .end();
}

function initResponseNotification() {
    hideNotificationMessage()
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

    $('#datePickerInput').val(
        $datePicker.datepicker('getFormattedDate')
    );
}

function onAddActivityButtonClickHandler() {
    let categoriesSelect = document.getElementById("categoriesSelect");
    let category = categoriesSelect.options[categoriesSelect.selectedIndex].value;
    let datePickerInput = document.getElementById("datePickerInput");
    let date = datePickerInput.value;

    let activity = {category: category, date: date};
    addActivity(activity, onAddActivityResponse)
}

function onAddActivityResponse(responseStatus) {
    if (responseStatus === 201) {
        showSuccessNotificationMessage("Added Activity!");
    } else {
        showErrorNotificationMessage(`Error adding activity! Response Status: ${responseStatus}`)
    }
}

function onAddCategoryButtonClickHandler() {
    let categoryNameInput = document.getElementById("categoryName");
    let categoryDescriptionInput = document.getElementById("categoryDescription");
    let category = {name: categoryNameInput.value, description: categoryDescriptionInput.value};
    addCategory(category, onAddCategoryResponse);
}

function onAddCategoryResponse(responseStatus) {
    if (responseStatus === 201) {
        populateDropdown();
        showSuccessNotificationMessage("Added Category!");
    } else {
        showErrorNotificationMessage(`Error adding Category! Response Status: ${responseStatus}`)
    }
}

function hideNotificationMessage() {
    $('#notificationMessageSuccess').hide(0);
    $('#notificationMessageError').hide(0);
}

function showErrorNotificationMessage(message) {
    showMessage($('#notificationMessageError'), message);
}

function showSuccessNotificationMessage(message) {
    showMessage($('#notificationMessageSuccess'), message);
}

function showMessage(messageElement, message) {
    messageElement.html(message);
    messageElement.show();
    setTimeout(() => messageElement.hide(), 4000);
}
