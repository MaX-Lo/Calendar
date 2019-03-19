let mockData = [
    [
        false, true, true, false, true, false, true,
        true, true, true, true, false, true, true,
        true, false, true, true, true, true, true,
        true, true, false, true, true, false, false,
        true, true, false
    ]
];

export default class Calendar {

    constructor(monthsData = mockData) {
        this.monthsData = monthsData;
    }

    setData(data) {
        this.monthsData = data;
    }

    getData() {
        return this.monthsData;
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

    static daysInMonth(month) {
        let monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return monthLengths[month];
    }

    static monthName(monthNum) {
        let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthNames[monthNum];
    }
}
