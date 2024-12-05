// Напишите HTTP сервер на express и реализуйте два обработчика “/” и “/about”, где:
// — На каждой странице реализован счетчик просмотров
// — Значение счетчика необходимо сохранять в файл каждый раз, когда обновляется страница
// — Также значение счетчика должно загружаться из файла, когда запускается обработчик страницы
// — Таким образом счетчик не должен обнуляться каждый раз, когда перезапускается сервер.
//  Подсказка:
// Вы можете сохранять файл в формате JSON, где в объекте ключом будет являться URL страницы, а значением количество просмотров страницы

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

let counterMain = 0;
let counterAbout = 0;

const counter = {
    counterMain: `${counterMain}`,
    counterAbout: `${counterAbout}`
};

const pathToFile = path.join(__dirname, 'counter.json');

function writeFileCounter(data) {
    try {
        fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Ошибка при записи файла:', err);
    }
}

app.get('/', (req, res) => {
    if(fs.existsSync(pathToFile)) {
        const counterData = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
        counterMain = counterData.counterMain;
        counterData.counterMain = ++counterMain;
        writeFileCounter(counterData);
    } else {
        counter.counterMain = ++counterMain;
        writeFileCounter(counter);
    }
    res.send(`
    <h1>Корневая страница</h1>
    <p>Просмотров: ${counterMain}</p>
    <a href="/about">Ссылка на страницу /about</a>
    `)
});

app.get('/about', (req, res) => {
    if(fs.existsSync(pathToFile)) {
        const counterData = JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
        counterAbout = counterData.counterAbout;
        counterData.counterAbout = ++counterAbout;
        writeFileCounter(counterData);
    } else {
        counter.counterAbout = ++counterAbout;
        writeFileCounter(counter);
    }
    res.send(`
    <h1>Страница about</h1>
    <p>Просмотров: ${counterAbout}</p>
    <a href="/">Ссылка на страницу /</a>
    `)
});

app.listen(3000);