import Calendar from "./calendar"
import CalendarView from  "./calendarView"

export default class CalendarViewLandscape extends CalendarView {

    constructor(width = 0) {
        super(width);
        this.daysInALine = 21;

    }

    getDaySize() {
        // eg. for 16 day in a line
        // _width = 6*7 * day_size + 6*6 * day_margin + 5 * month_margin
        // _width = 42 * day_size + 36 * day_size / 10 + 5 * day_size / 2
        // _width = day_size * (42 + 36/10 + 5/2)
        // _width = day_size * 48.1
        return this.width / 48.1
    }

    getDayMargin() {
        return this.getDaySize() / 10;
    }

    get height() {
        return (this.getMonthYOffset() + this.getTextSize()) * 2;
    }

    getMonthMargin() {
        return this.getDaySize() / 2;
    }

    getMonthYOffset() {
        return 5*this.getDaySize() + 4*this.getDayMargin() + this.getMonthMargin() + this.getTextSize();
    }

    getMonthXOffset() {
        return 7*this.getDaySize() + 6*this.getDayMargin() + this.getMonthMargin();
    }

    draw(p, calendar, oldCalendar = calendar, transitionProgress = 1) {
        this.drawCaptions(p);
        this.drawContent(p, calendar, oldCalendar, transitionProgress);
    }

    getTextSize() {
        return this._width / 60;
    }

    drawCaptions(p) {
        let x = 0;
        let y = this.getTextSize();
        p.textSize(this.getTextSize());
        p.fill(75);
        for (let i = 0; i < 12; i++) {
            let caption = Calendar.monthName(i);
            p.text(caption, x, y);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset() + this.getTextSize();
            }
        }
    }

    drawContent(p, calendar, oldCalendar, transitionProgress) {
        let x = 0;
        let y = this.getTextSize() * 2;

        for (let i = 0; i < 12; i++) {
            this.drawMonth(p, x, y, calendar, oldCalendar, transitionProgress, i);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset() + this.getTextSize();
            }
        }
    }

    drawMonth(p, startX, startY, calendar, oldCalendar, transitionProgress, month) {
        let x = startX;
        let y = startY;
        let year = new Date().getFullYear();
        for (let i = 0; i < Calendar.daysInMonth(month); i++) {
            let date = new Date(year, month, i + 2);

            let oldColor = [240, 240, 240];
            let newColor = [240, 240, 240];
            if (oldCalendar.getActivitiesForDate(date).length > 0) {
                oldColor = oldCalendar.getColor();
            }
            if (calendar.getActivitiesForDate(date).length > 0) {
                newColor = calendar.getColor();
            }
            let color = this.getColor(oldColor, newColor, transitionProgress)

            p.fill(color);
            p.rect(x, y, this.getDaySize(), this.getDaySize());

            x += this.getDaySize() + this.getDayMargin();
            if (i % 7 === 6) {
                x -= (this.getDaySize() + this.getDayMargin()) * 7;
                y += this.getDaySize() + this.getDayMargin();
            }
        }
    }

    getColor(oldColor, newColor, transitionProgress) {
        return [
            oldColor[0] * (1 - transitionProgress) + newColor[0] * transitionProgress,
            oldColor[1] * (1 - transitionProgress) + newColor[1] * transitionProgress,
            oldColor[2] * (1 - transitionProgress) + newColor[2] * transitionProgress,
        ];
    }
}
