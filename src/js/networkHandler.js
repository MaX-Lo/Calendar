const BASE_URL = 'http://localhost:8080';

export function fetchActivities(category, callback) {
    const endpoint = BASE_URL + `/activities/?category="${category}"`;
    fetchData(endpoint, callback);
}

export function fetchCategories(callback) {
    const endpoint = BASE_URL + `/categories"`;
    fetchData(endpoint, callback);
}

function fetchData(endpoint, callback) {

    let request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.onload = function() {
        let data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            callback(data._embedded.activities);
        } else {
            console.log('error');
        }
    };
    request.send();
}