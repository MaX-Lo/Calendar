import Calendar from "./calendar";

export default class CalendarViewPortrait {
    constructor(width = 0) {
        this.width = width;
    }

    getDaySize() {
        // width = 3*6*day_size + 2*5*day_margin + 5 * month_margin
        // width = 3*6*day_size + 2*5*(day_size/10) + 5 * (day_size/2)
        // width = day_size * (18 + 1 + 2.5)
        // day_size = width / 21.5
        return this.width / 21.5
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

    getHeight() {
        return 2 * this.getMonthYOffset() + 2.5 * this.getTextSize();
    }

    setWidth(width) {
        this.width = width;
    }

    getWidth() {
        return this.width;
    }

    getTextSize() {
        return this.width / 30;
    }

    draw(p, calendar) {
        this.drawEmptyCells(p);
        this.drawCaptions(p);
        this.drawContent(p, calendar);
    }

    drawEmptyCells(p) {
        let x = 0;
        let y = 50;
        for (let i = 0; i < 12; i++) {
            let data = Array(Calendar.daysInMonth(i)).fill(false);
            this.drawMonthLineWise(p, x, y, data);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset();
            }
        }
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

    drawContent(p, calendar) {
        let x = 0;
        let y = 50;

        for (let i = 0; i < 12; i++) {
            this.drawMonthLineWise(p, x, y, calendar, i);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset();
            }
        }
    }

    drawMonthLineWise(p, startX, startY, calendar, month) {
        let x = startX;
        let y = startY;
        let year = new Date().getFullYear();
        for (let i = 0; i < Calendar.daysInMonth(month); i++) {
            let date = new Date(year, month, i + 2);
            if (calendar.getActivitiesForDate(date).length > 0) {
                p.fill(calendar.getColor()[0], calendar.getColor()[1], calendar.getColor()[2]);
            } else {
                p.fill(230);
            }
            p.rect(x, y, this.getDaySize(), this.getDaySize());

            x += this.getDaySize() + this.getDayMargin();
            if (i % 3 === 2) {
                x -= (this.getDaySize() + this.getDayMargin()) * 3;
                y += this.getDaySize() + this.getDayMargin();
            }
        }
    }
}
