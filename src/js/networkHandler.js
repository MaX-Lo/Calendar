const BASE_URL = 'http://localhost:8080';

export function fetchActivities(category, callback) {
    let endpoint = BASE_URL + `/activities/search/findByCategory?category=${category}`;
    let request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            let data = JSON.parse(this.response);
            callback(data._embedded.activities);
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
            let data = JSON.parse(this.response);
            callback(data._embedded.categories);
        } else {
            console.log('error');
        }
    };
    request.send();
}

export function dispatchActivity(activity) {
    let endpoint = BASE_URL + `/activities`;
    let request = new XMLHttpRequest();
    request.open('POST', endpoint, true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            console.log('added activity!')
        } else {
            console.log('error adding activity!');
        }
    };
    request.setRequestHeader("Content-Type", "application/json");
    console.log(activity);
    request.send(JSON.stringify(activity));
}