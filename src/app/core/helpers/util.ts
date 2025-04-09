import { timeHelper } from "./time";

export var utilHelper = {
    //Chuyển text -> Date, Ex: 2023-05-08T15:56:42.7229294
    map(current: any, props: any) {
        var objFields = Object.getOwnPropertyNames(props);
        var curFields = Object.getOwnPropertyNames(current);
        //console.log(objFields, curFields);

        for (const attr of curFields) {
            var exist = objFields.indexOf(attr);
            if (exist < 0) continue;
            (current)[attr] = props[attr];
        }

        //Fix cho các trường datetime
        // var dates = ['dateOfBirth', 'dateCreated', 'dateUpdated'];
        // for (const attr of dates) {
        //     var exist = objFields.indexOf(attr);
        //     if (exist < 0) continue;
        //     if (typeof (props[attr]) == 'string') {
        //         current[attr] = timeHelper.cshapeDateStringToDate(props[attr]);
        //     }
        // }

    },

    hostname(): string {
        const parsedUrl = new URL(window.location.href);
        return parsedUrl.origin;
    },

    localStorage: {
        token: 'token',
        myAccount: 'my-profile'
    },

    stringIsNullOrEmpty(value?: string): boolean {
        if (value == null) return true;
        if (value.trim().length == 0) return true;
        return false;
    }
}

export var base64Helper = {

    toBase64(strValue: string) {
        try {
            return btoa(encodeURIComponent(strValue).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                return String.fromCharCode(("0x" + p1) as any);
            }));
        }
        catch (e) {
            console.log("tobase64 invalid: " + strValue);
        }
        return "";
    },
    toString(strBase64: string) {
        try {
            return decodeURIComponent(Array.prototype.map.call(atob(strBase64), function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
        }
        catch (e) { console.log("toString invalid: " + strBase64); }
        return "";
    },

    objectToBase64(obj: any) {
        try {
            if (obj == null) return '';
            var json = JSON.stringify(obj);
            return this.toBase64(json);
        }
        catch (e) { console.error(e); }
        return '';
    },

    base64ToObject<T>(base64: string) {
        try {
            if (base64 == null || base64 == '')
                return null;
            var json = this.toString(base64);
            return JSON.parse(json) as T;
        }
        catch (e) { console.error(e); }
        return null;
    },
}