export default class CalendarView {
    constructor(width) {
        this.width = width;
        this.textSize = 32;
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
        return 2 * this.getMonthYOffset() + 2.5 * this.textSize;
    }

    getWidth() {
        return this.width;
    }

    drawEmptyCells(p, calendar) {
        let x = 0;
        let y = 50;
        for (let i = 0; i < 12; i++) {
            let data = Array(calendar.daysInMonth(i)).fill(false);
            this.drawMonthLineWise(p, x, y, data);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset();
            }
        }
    }

    drawCaptions(p, calendar) {
        let x = 0;
        let y = 32;
        p.textSize(32);
        p.fill(75);
        for (let i = 0; i < 12; i++) {
            let caption = calendar.monthName(i);
            p.text(caption, x, y);
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += 2 * this.getMonthYOffset() + this.textSize;
            }
        }
    }

    draw(p, calendar) {
        let x = 0;
        let y = 50;

        for (let i = 0; i < calendar.monthsData.length; i++) {
            this.drawMonthLineWise(p, x, y, calendar.getMonthData(i));
            x += this.getMonthXOffset();
            if (i % 6 === 5) {
                x -= 6 * this.getMonthXOffset();
                y += this.getMonthYOffset();
            }
        }
    }

    drawMonthLineWise(p, startX, startY, dayData) {
        let x = startX;
        let y = startY;
        for (let i = 0; i < dayData.length; i++) {
            if (dayData[i]) {
                p.fill(200, 0, 0);
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
