import {fetchActivities, fetchCategories, dispatchActivity, dispatchCategory} from './networkHandler';
import {getMockCategories, getMockCalendarData} from './mockData';

const MOCK = false;

export function getCalendarCategories(callback) {
    if (MOCK) {
        callback(getMockCategories());
    } else {
        fetchCategories(callback);
    }
}

export function addCategory(category, callback) {
    if (MOCK) {
        console.log("not added since MOCK is enabled");
    } else {
        dispatchCategory(category, callback);
    }
}

export function getCalendarData(category, callback) {
    if (MOCK) {
        callback(getMockCalendarData(category));
    } else {
        fetchActivities(category, callback);
    }
}

export function addActivity(activity, callback) {
    if (MOCK) {
        console.log("not added since MOCK is enabled");
    } else {
        dispatchActivity(activity, callback);
    }
}