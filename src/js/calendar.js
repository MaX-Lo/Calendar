export default class Calendar {
    constructor(name = 'unknown name', color = [0, 30, 70], activityList = []) {
        this.color = color;
        this.activityList = activityList;
        this.setActivities(activityList);
        this._name = name;
    }

    addActivities(activityList) {
        this.activityList = [];
        for (let activity of activityList) {
            this.activityList.push(activity);
        }
    }

    setActivities(activityList) {
        this.activityList = activityList;
    }

    getActivities() {
        return this.activityList;
    }

    getActivitiesInRange(startDate, endDate) {
        let activitiesInMonth = this.activityList.filter((activity) => (activity.date > startDate && activity.date < endDate));
        return activitiesInMonth.sort((activity1, activity2) => activity1.date - activity2.date);
    }

    getActivitiesForDate(date) {
        return this.activityList.filter((activity) => (activity.date === Calendar.dateToString(date)));
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    static daysInMonth(month) {
        let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthLengths[month];
    }

    static monthName(monthNum) {
        return Calendar.monthNames()[monthNum];
    }

    static monthNames() {
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    static daysOfWeek() {
        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    }

    static dateToString(date) {
        return `${date.toISOString().substring(0, 10)}`;
    }

    /**
     * converts the data to a bool array signaling whether the day corresponding to the index contains
     * an activity
     * @returns [[]] - an array of size 12 with each element being an array containing as elements a boolean value
     * for each day
     */
    toBoolArray() {
        let year = new Date().getFullYear();
        let yearsData = [];
        for (let monthNum = 0; monthNum < 12; monthNum++) {
            let monthData = [];
            for (let dayNum = 0; dayNum < Calendar.daysInMonth(monthNum); dayNum++) {
                let date = new Date(year, monthNum, dayNum + 2);
                if (this.getActivitiesForDate(date).length > 0) {
                    monthData.push(true);
                } else {
                    monthData.push(false);
                }
            }
            yearsData.push(monthData)
        }
        return yearsData;
    }

    activitiesByWeekday(dayOfWeek) {
        let activities = [];
        for (let i = 0; i < this.activityList.length; i++) {
            let date = new Date(this.activityList[i].date);
            if (date.getDay() === dayOfWeek) {
                activities.push(this.activityList[i])
            }
        }
        return activities;
    }

}
