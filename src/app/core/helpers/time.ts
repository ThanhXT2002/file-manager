export var timeHelper = {
    //Chuyển text -> Date, Ex: 2023-05-08T15:56:42.7229294
    cshapeDateStringToDate(text?: any) {
        if (text == null) return null;
        try {
            let value = text as string;
            var date = new Date(value);
            return date;
        }
        catch (e) {
            console.log(e);
        }
        return null;
    },

    numberToDate: function (lvalue: number, utc = false) {
        if (lvalue <= 0) return new Date(0, 0, 0);
        var year = Math.floor(lvalue / 10000000000);
        var month = Math.floor((lvalue % 10000000000) / 100000000);
        var date = Math.floor((lvalue % 100000000) / 1000000);
        var hour = Math.floor((lvalue % 1000000) / 10000);
        var minute = Math.floor((lvalue % 10000) / 100);
        var second = Math.floor(lvalue % 100);
        if (utc === true) {
            return new Date(Date.UTC(year, month - 1, date, hour, minute, second));
        }
        else {
            return new Date(year, month - 1, date, hour, minute, second);
        }
    },

    dateToNumber: function (objDate: Date, utc = false) {
        if (utc) {
            var year = this.leftPad(objDate.getUTCFullYear(), 4);
            var month = this.leftPad(objDate.getUTCMonth() + 1, 2);
            var date = this.leftPad(objDate.getUTCDate(), 2);
            var hour = this.leftPad(objDate.getUTCHours(), 2);
            var minute = this.leftPad(objDate.getUTCMinutes(), 2);
            var second = this.leftPad(objDate.getUTCSeconds(), 2);
            return year + month + date + hour + minute + second;
        }
        else {
            var year = this.leftPad(objDate.getFullYear(), 4);
            var month = this.leftPad(objDate.getMonth() + 1, 2);
            var date = this.leftPad(objDate.getDate(), 2);
            var hour = this.leftPad(objDate.getHours(), 2);
            var minute = this.leftPad(objDate.getMinutes(), 2);
            var second = this.leftPad(objDate.getSeconds(), 2);
            return year + month + date + hour + minute + second;
        }
    },
 
    leftPad: function (number: number, targetLength = 2) {
        var output = number + '';
        while (output.length < targetLength) {
            output = '0' + output;
        }
        return output;
    },

    dateToStringTime: function (date: Date, format = "HH:mm:ss") {

        try {
            if (date.getFullYear() <= 1900) return '';

            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            var hours24 = date.getHours(); // use 24H
            var hours12 = hours24 % 12; // user AM/PM
            var am = hours12 == hours24 ? 'AM' : 'PM';

            if (hours24 == 12) {
                hours12 = 12;
                am = 'PM';
            }

            switch (format) {
                case 'HH:mm': { return `${this.leftPad(hours24)}:${this.leftPad(minutes)}`; }
                case 'HH:mm:ss': { return `${this.leftPad(hours24)}:${this.leftPad(minutes)}:${this.leftPad(seconds)}`; }

                case 'hh:mm': { return `${this.leftPad(hours12)}:${this.leftPad(minutes)} ${am}`; }
                case 'hh:mm:ss': { return `${this.leftPad(hours12)}:${this.leftPad(minutes)}:${this.leftPad(seconds)}  ${am}`; }
            }

            return '';

        } catch (e) {
            return '';
        }

    },

    dateToString: function (date: Date, format = "dd/mm/yyyy hh:mm:ss", _delimiter = '/') {

        try {

            if (date.getFullYear() <= 1900) return '';

            format = format.toLowerCase();

            function toTimeString(date: Date, _formatTime: string, _delimiter = ':') {

                try {
                    var formatItems = _formatTime.split(_delimiter);

                    var hourIndex = formatItems.indexOf("hh");
                    var minuteIndex = formatItems.indexOf("mm");
                    var secondIndex = formatItems.indexOf("ss");

                    let numbers = [];
                    if (hourIndex >= 0) { numbers.push(date.getHours()) }
                    if (minuteIndex >= 0) { numbers.push(date.getMinutes()) }
                    if (secondIndex >= 0) { numbers.push(date.getSeconds()) }

                    let text = '';
                    for (let i = 0; i < numbers.length; i++) { text += timeHelper.leftPad(numbers[i], 2) + ':'; }
                    if (text.length > 0) { text = text.substring(0, text.length - 1); }

                    return text;

                } catch (e) {
                    return '';
                }

            }
            function toDateString(date: Date, _formatDate: string, _delimiter = '/') {

                try {
                    var formatItems = _formatDate.split(_delimiter);

                    var yearIndex = formatItems.indexOf("yyyy");
                    var monthIndex = formatItems.indexOf("mm");
                    var dateIndex = formatItems.indexOf("dd");

                    let numbers = [
                        { index: yearIndex, name: 'yyyy' },
                        { index: monthIndex, name: 'mm' },
                        { index: dateIndex, name: 'dd' },
                    ];

                    numbers.sort((a, b) => {
                        if (a.index < b.index) {
                            return -1;
                        }
                        if (a.index > b.index) {
                            return 1;
                        }
                        return 0;
                    });

                    let text = '';
                    for (let i = 0; i < numbers.length; i++) {

                        if (numbers[i].index < 0)
                            continue;

                        switch (numbers[i].name) {
                            case 'yyyy': { text += timeHelper.leftPad(date.getFullYear(), 4) + _delimiter; break; }
                            case 'mm': { text += timeHelper.leftPad(date.getMonth() + 1, 2) + _delimiter; break; }
                            case 'dd': { text += timeHelper.leftPad(date.getDate(), 2) + _delimiter; break; }
                        }
                    }

                    if (text.length > 0) { text = text.substring(0, text.length - 1); }
                    return text;

                } catch (e) {
                    return '';
                }
            }

            var formats = format.split(' ');

            if (formats.length == 1) {
                if (format.indexOf('ss') >= 0 || format.indexOf('hh') >= 0) {
                    return toTimeString(date, formats[0]); //TIME
                }
                else {
                    return toDateString(date, formats[0], _delimiter); //DATE
                }
            }
            else {
                return toDateString(date, formats[0], _delimiter) + ' ' + toTimeString(date, formats[1]);
            }
        } catch (e) {
            return '';
        }

    },

    numberToDateString: function (number: number, utc = false) {
        if (number <= 1) return '';
        try {
            let date = this.numberToDate(number, utc);
            return this.dateToString(date);
        }
        catch (e) { console.log(e); }
        return;
    },


    formatMinutes(milliseconds: number): string {
        if (!milliseconds || milliseconds < 0) return '0 phút';
        
        // Chuyển đổi từ millisecond thành phút
        const minutes = Math.floor(milliseconds / (1000 * 60));
        
        if (minutes === 0) return '0 phút';
        
        // Định nghĩa các đơn vị thời gian (tính bằng phút)
        const MINUTES_PER_HOUR = 60;
        const HOURS_PER_DAY = 24;
        const DAYS_PER_WEEK = 7;
        const DAYS_PER_YEAR = 365;
        
        const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;
        const MINUTES_PER_WEEK = MINUTES_PER_DAY * DAYS_PER_WEEK;
        const MINUTES_PER_YEAR = MINUTES_PER_DAY * DAYS_PER_YEAR;
        
        // Tính toán các thành phần thời gian
        let remainingMinutes = minutes;
        
        // Tính số năm
        const years = Math.floor(remainingMinutes / MINUTES_PER_YEAR);
        remainingMinutes %= MINUTES_PER_YEAR;
        
        const MINUTES_PER_MONTH = MINUTES_PER_DAY * 30;
        const months = Math.floor(remainingMinutes / MINUTES_PER_MONTH);
        remainingMinutes %= MINUTES_PER_MONTH;
        
        // Tính số tuần
        const weeks = Math.floor(remainingMinutes / MINUTES_PER_WEEK);
        remainingMinutes %= MINUTES_PER_WEEK;
        
        // Tính số ngày
        const days = Math.floor(remainingMinutes / MINUTES_PER_DAY);
        remainingMinutes %= MINUTES_PER_DAY;
        
        // Tính số giờ
        const hours = Math.floor(remainingMinutes / MINUTES_PER_HOUR);
        remainingMinutes %= MINUTES_PER_HOUR;
        
        // Số phút còn lại
        const mins = remainingMinutes;
        
        // Tạo mảng các thành phần thời gian
        const parts = [];
        
        if (years > 0) {
          parts.push(`${years} năm`);
        }
        
        if (months > 0) {
          parts.push(`${months} tháng`);
        }
        
        if (weeks > 0) {
          parts.push(`${weeks} tuần`);
        }
        
        if (days > 0) {
          parts.push(`${days} ngày`);
        }
        
        if (hours > 0) {
          parts.push(`${hours} giờ`);
        }
        
        if (mins > 0) {
          parts.push(`${mins} phút`);
        }
        
        // Trả về kết quả
        if (parts.length === 0) {
          return '0 phút';
        } else {
          return parts.join(' ');
        }
      }
}
