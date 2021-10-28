import { franc, francAll } from 'franc';
import langs from 'langs';
import process from 'process';
import colors from 'colors';

// console.log(franc);
// console.log(langs.names());

// test case 1: Japanese
const msg1 = '日本語が大好きですよ！';
const lang_code1 = franc(msg1);
const predicted_lang = langs.where('3', lang_code1).name; // using ISO 3-letter language code
console.log('- Test case 1:', msg1);
console.log('>> Predicted language:', predicted_lang.green);

// test case 2: Vietnamese
const msg2 = 'Trời ơi cái quần què gí dậyyyyy bàaaaa';
const lang_code2 = franc(msg2);
const lang2 = langs.where('3', lang_code2);
console.log('- Language 2:', msg2);
console.log('>> Predicted language 2:', lang2.name.cyan);

// console.log(langs.where('name', 'Chinese'));
// console.log(langs.all());

// from user input
const input = process.argv[2];
if (!input) {
    console.log('Please enter a sentence');
} else {
    let lang_code3 = franc(input);
    if (lang_code3 === 'und') {
        console.log('Language undefined'.red);
    } else {
        // eventhough they all use ISO 639-3 language code
        // but franc returns individual code
        // and langs takes in macro code
        // convert Chinese code 'cmn' -> 'zho'
        if (lang_code3 === 'cmn') {
            lang_code3 = 'zho';
        }
        const lang3 = langs.where('3', lang_code3);
        // console.log('CODE333333333:', lang_code3);
        // console.log('LANG3333333333333:', lang3);
        console.log('- From user input:', input);
        console.log('>> Predicted user input language:', lang3.name.yellow);
    }
}

// some strings to copy
// Korean: 제드, 그림자의 주인
// Chinese: 劫变得无法被选取，突进向一位敌方英雄，并标记目标。3秒后，印记会触发，造成物理伤害
