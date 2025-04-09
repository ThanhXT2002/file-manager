import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

export var randomHelper = {
    name(size = 1) {
        let string = lorem.generateWords(size);
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    serialNumber(serialLength: number = 10) {
        var chars = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
            serialLength = 10,
            randomSerial = "",
            i,
            randomNumber;
        for (i = 0; i < serialLength; i = i + 1) {
            randomNumber = Math.floor(Math.random() * chars.length);
            randomSerial += chars.substring(randomNumber, randomNumber + 1);
        }
        return randomSerial.toLocaleUpperCase();
    },

    number(min: number = 1, max: number = 100000) {
        return Math.round(Math.random() * (max - min) + min);
    },

    price(min: number = 1, max: number = 10000) {
        return Math.round(Math.random() * (max - min) + min) * 1000;
    },

    description(size = 3) {
        return lorem.generateParagraphs(size);
    },
    address(){
        return lorem.generateWords(7);
    }
}