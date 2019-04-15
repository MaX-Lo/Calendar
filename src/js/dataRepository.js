import {fetchActivities, fetchCategories, dispatchActivity} from './networkHandler';
import {getMockCategories, getMockCalendarData} from './mockData';

const MOCK = false;

export function getCalendarCategories(callback) {
    if (MOCK) {
        callback(getMockCategories());
    } else {
        fetchCategories(callback);
    }
}

export function getCalendarData(category, callback) {
    if (MOCK) {
        callback(getMockCalendarData(category));
    } else {
        fetchActivities(category, callback)
    }
}

export function addActivity(activity, callback) {
    if (MOCK) {
        console.log("not added since MOCK is on")
    } else {
        dispatchActivity(activity, callback)
    }
}