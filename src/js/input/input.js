import 'bootstrap';
import 'bootstrap-datepicker'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-datepicker/dist/css/bootstrap-datepicker.standalone.min.css'

import {getCalendarCategories, addActivity} from "../dataRepository";

initResponseNotification();

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
    addActivity(activity, onAddActivityResponse)
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

function initResponseNotification() {
    hideNotificationMessage()
}

function onAddActivityResponse(responseStatus) {
    if (responseStatus === 201) {
        showSuccessNotificationMessage("Added Activity!");
    } else {
        showErrorNotificationMessage(`Error adding activity! Response Status: ${responseStatus}`)
    }
}

function hideNotificationMessage() {
    $('#notificationMessageSuccess').hide(0);
    $('#notificationMessageError').hide(0);

}
 eSuccess'), message);
}

function showErrorNotificationMessage(message) {
    showMessage($('#notificationMessageError'), message);
}

function showMessage(messageElement, message) {
    messageElement.html(message);
    messageElement.show();
    setTimeout(() => messageElement.hide(), 5000);
}

