import Calendar from "./calendar";
import CalendarView from "./calendarView";

export default class CalendarViewPortrait extends CalendarView {
    constructor(width = 0) {
        super(width);
    }

    getDaySize() {
        // _width = 3*6*day_size + 2*5*day_margin + 5 * month_margin
        // _width = 3*6*day_size + 2*5*(day_size/10) + 5 * (day_size/2)
        // _width = day_size * (18 + 1 + 2.5)
        // day_size = _width / 21.5
        return this._width / 21.5
    }

    getDayMargin() {
        return this.getDaySize() / 10;
    }

    getMonthMargin() {
        return this.getDaySize() / 2;
    }

    getMonthXOffset() {
        return 3 * this.getDaySize() + 2 * this.getDayMargin() + this.getMonthMargin();
    }

    getMonthYOffset() {
        return 11 * this.getDaySize() + 10 * this.getDayMargin() + this.getMonthMargin();
    }

    get height() {
        return 2 * this.getMonthYOffset() + 2.5 * this.getTextSize();
    }

    getTextSize() {
        return this._width / 30;
    }

    draw(p, calendar, oldCalendar = calendar, transitionProgress = 1) {
        this.drawCaptions(p);
        this.drawContent(p, calendar, oldCalendar, transitionProgress);
    }

    drawCaptions(p) {
        let x = 0;
        let y = 32;
        p.textSize(this.getTextSize());
        p.fill(75);
        for (let i = 0; i < 12; i++) {
            let caption = Calendar.monthName(i);
            p.text(caption, x, y);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += 2 * this.getMonthYOffset() + this.getTextSize();
            }
        }
    }

    drawContent(p, calendar, oldCalendar, transitionProgress) {
        let x = 0;
        let y = 50;

        for (let i = 0; i < 12; i++) {
            this.drawMonthLineWise(p, x, y, calendar, oldCalendar, transitionProgress, i);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset();
            }
        }
    }

    drawMonthLineWise(p, startX, startY, calendar, oldCalendar, transitionProgress, month) {
        let x = startX;
        let y = startY;
        let year = new Date().getFullYear();
        for (let i = 0; i < Calendar.daysInMonth(month); i++) {
            let date = new Date(year, month, i + 2);

            let oldColor = [230, 230, 230];
            let newColor = [230, 230, 230];
            if (oldCalendar.getActivitiesForDate(date).length > 0) {
                oldColor = oldCalendar.getColor();
            }
            if (calendar.getActivitiesForDate(date).length > 0) {
                newColor = calendar.getColor();
            }
            let color = [
                oldColor[0] * (1 - transitionProgress) + newColor[0] * transitionProgress,
                oldColor[1] * (1 - transitionProgress) + newColor[1] * transitionProgress,
                oldColor[2] * (1 - transitionProgress) + newColor[2] * transitionProgress,
            ];
            p.fill(color);
            p.rect(x, y, this.getDaySize(), this.getDaySize());

            x += this.getDaySize() + this.getDayMargin();
            if (i % 3 === 2) {
                x -= (this.getDaySize() + this.getDayMargin()) * 3;
                y += this.getDaySize() + this.getDayMargin();
            }
        }
    }
}
