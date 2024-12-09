/*
Инициализируйте проект NPM
-Установите express
-Создайте файл сервера index.js
-В файле создайте обработчик получения всех пользователей

Необходимо реализовать роут создания пользователя. Поля объекта пользователя - это firstName, secondName, age, city

Необходимо реализовать роут обновления пользователя.

Необходимо реализовать два роута:
-Роут получения отдельного пользователя
-Роут удаления пользователя

Установить Joi с помощью NPM
Определить схему валидации запроса на создание пользователя(пока не применять в обработчиках)
-firstName и secondName - это строки, которые  должны иметь не менее одного символа. Также эти поля обязательны для создания.
-age - это обязательное число, которое не может быть меньше 0 и более 150
-city - это необязательная строка с минимальным количеством символов 1

Примените схему валидации для проверки правильности данных во время обновления и создания пользователя

Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, необходимо реализовать хранение массива в файле.
**/


const express = require('express');
const joi = require('joi');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

const newFileUsers = [];

/**
 * Проверка правильности данных при валидация запросов
 */
const userSchema = joi.object({
  firstName: joi.string().min(1).required(),
  secondName: joi.string().min(1).required(),
  age: joi.number().min(0).max(150).required(),
  city: joi.string().min(1)
});

/**
 * Создание файла в текущей директории
 */
const pathToFile = path.join(__dirname, 'users.json');

/**
 * Функция чтения из файла
 */
function readUserFile() {
    try {
      return JSON.parse(fs.readFileSync(pathToFile, 'utf-8'));
    } catch (error) {
        console.error('Ошибка при чтении файла:', err);
        return [];
    }
}

/**
 * Функция записи в файл
 */
function writeUserFile(data) {
  try {
      fs.writeFileSync(pathToFile, JSON.stringify(data, null, 2));
  } catch (error) {
      console.error('Ошибка при записи файла:', err);
  }
}

/**
 * Получение всех пользователей из файла
 */
app.get('/users', (req, res) => {
  if(fs.existsSync(pathToFile)) {
    const users = readUserFile();

    res.send(users);
  } else {
    writeUserFile(newFileUsers); // Если нет доступа к файлу, то создается новый файл в текущей директории

    res.send(newFileUsers);
  }
});

/**
 * Получение конкретного пользователя из файла
 */
app.get('/users/:id', (req, res) => {
  if(fs.existsSync(pathToFile)) {
    const users = readUserFile();

    const userId = Number(req.params.id);
    const user = users.find(user => user.id === userId);

    (user) ? res.send({ user }) : res.status(404).send({ user: null });

  } else {
    res.status(400).send('there is no access to the file');
  }
});

/**
 * Добавление пользователя в файл
 */
app.post('/users', (req,res) => {
  const result = userSchema.validate(req.body);
  if(result.error) {
    return res.status(404).send({ error: result.error.details });
  }

  if(fs.existsSync(pathToFile)) {
    const users = readUserFile();

    let uniqueID = 1;

    // проверка на пустоту файла
    if (users.length > 0) {
      uniqueID = users.length + 1;
    }

    users.push({
      id: uniqueID,
      ...req.body
    })

    writeUserFile(users);

    res.send({id: uniqueID});
  } else {
    res.status(400).send('there is no access to the file');
  }
});

/**
 * Обновление данных о пользователе и записи его в файл
 */
app.put('/users/:id', (req, res) => {
  const result = userSchema.validate(req.body);
  if(result.error) {
    return res.status(404).send({ error: result.error.details });
  }

  if(fs.existsSync(pathToFile)) {
    const users = readUserFile();

    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);

    if(user) {
      const { firstName, secondName, age, city } = req.body;
      user.firstName = firstName;
      user.secondName = secondName;
      user.age = age;
      user.city = city;

      writeUserFile(users);

      res.send({ user });
    } else {
      res.status(404).send({ user: null });
    }
  } else {
    res.status(400).send('there is no access to the file');
  }
});

/**
 * Удаление пользователя из файла
 */
app.delete('/users/:id', (req, res) => {
  if(fs.existsSync(pathToFile)) {
    const users = readUserFile();

    const userId = +req.params.id;
    const user = users.find(user => user.id === userId);

    if(user) {
      res.send({ user });

      const lastUser = users.find(user => user.id === users.length); // Находим последнего юзера
      lastUser.id = userId; // У последнего юзера меняем его id на id найденного юзера
      user.id = users.length; // У найденого юзера меняем его id на тот id, который был у последнего юзера

      const userIndex = users.indexOf(user);

      users.splice(userIndex, 1);

      writeUserFile(users);
    } else {
      res.status(404).send({ user: null });
    }
  } else {
    res.status(400).send('there is no access to the file');
  }
});

/**
 * Обработка несуществующих роутов
 */
app.use ((req, res) => {
  res.status(400).send({
    message: "URL not found!"
  })
});

app.listen(3000);