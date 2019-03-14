export default class Calendar {
    constructor(monthsData) {
        this.monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.monthsData = monthsData;
    }

    setMonthData(monthNum, data) {
        if (monthNum <= 0 || monthNum > 12) {
            throw `Month num has to be in range 1 to 12. Was: ${monthNum}`;
        }
        this.monthsData[monthNum] = data;
    }

    getMonthData(monthNum) {
        if (monthNum < 0 || monthNum >= 12) {
            throw `Month num has to be in range 0 to 11. Was: ${monthNum}`;
        }
        return this.monthsData[monthNum];
    }

    daysInMonth(month) {
        return this.monthLengths[month];
    }

    monthName(monthNum) {
        return this.monthNames[monthNum];
    }
}
