import {fetchActivities, fetchCategories} from './networkHandler';
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