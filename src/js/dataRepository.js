import {fetchActivities, fetchCategories, dispatchActivity} from './networkHandler';
import {getMockCategories, getMockCalendarData} from './mockData';

const MOCK = true;

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

export function addActivity(activity) {
    if (MOCK) {
        // Todo
    } else {
        dispatchActivity(activity)
    }
}