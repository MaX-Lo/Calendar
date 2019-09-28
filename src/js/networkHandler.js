// ToDo having to exchange each time before building seems dirty and wrong...
// const BASE_URL = 'http://localhost:8080';
let baseUrl = window.location.origin;
const BASE_URL = baseUrl;


export function fetchActivities(category, callback) {
    let endpoint = BASE_URL + `/activities/${category}`;
    let request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.response);
            callback(data);
        } else {
            console.log('error');
        }
    };
    request.send();

}

export function fetchCategories(callback) {
    let endpoint = BASE_URL + '/categories';

    let request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(request.response);
            callback(data);
        } else {
            console.log('error');
        }
    };
    request.send();
}

export function dispatchActivity(activity, callback) {
    let endpoint = BASE_URL + `/activities`;
    let request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            console.log('Added activity!');
        } else {
            console.log('Error adding activity!');
        }

        callback(request.status);
    };
    request.setRequestHeader("Content-Type", "application/json");
    console.log(activity);
    request.send(JSON.stringify(activity));
}

export function dispatchCategory(category, callback) {
    let endpoint = BASE_URL + "/categories";
    let request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log('Added category!');
        } else {
            console.log('Error adding category!');
        }

        callback(request.status);
    };
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(category));
}