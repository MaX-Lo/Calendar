export default class Calendar {
    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    constructor(name = 'unknown name',color = [0, 170, 200], activityList = []) {
        this.color = color;
        this.activityList = activityList;
        this.setActivities(activityList)
        this._name = name;
    }

    setActivities(activityList) {
        this.activityList = [];
        for (let activity of activityList) {
            this.activityList.push(activity);
        }
    }

    getActivities() {
        return this.activityList;
    }

    getActivitiesInRange(startDate, endDate) {
        let activitiesInMonth = this.activityList.filter((activity) => (activity.date > startDate && activity.date < endDate));
        return activitiesInMonth.sort((activity1, activity2) => activity1.date - activity2.date);
    }

    getActivitiesForDate(date) {
        //console.log(date, this.activityList);
        return this.activityList.filter((activity) => (activity.date === Calendar.dateToString(date)));
    }

    setColor(color) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    static daysInMonth(month) {
        let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthLengths[month];
    }

    static monthName(monthNum) {
        let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[monthNum];
    }

    static dateToString(date) {
        return `${date.toISOString().substring(0, 10)}`;
    }
}
