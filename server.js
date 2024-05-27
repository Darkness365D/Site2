const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');

const app = express();

const pool = mysql.createPool({
  host: 'kolei.ru',
  user: 'nzaskupin',
  password: '230104',
  database: 'nzaskupin',
});

app.use(cors());
app.use(bodyParser.json());

const secretKey = 'ваш_секретный_ключ'; // Замените на ваш секретный ключ

// API для регистрации
app.post('/register', (req, res) => {
  const { name, phoneNumber, password, birthday, genderId, surname, patronymic } = req.body;

  if (genderId !== 1 && genderId !== 2) {
    return res.status(400).send({ error: 'Неправильное значение для пола' });
  }

  pool.query('INSERT INTO KpUser (name, phoneNumber, password, birthday, genderId, surname, patronymic) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, phoneNumber, password, birthday, genderId, surname, patronymic], (error, results) => {
    if (error) {
      console.error('Ошибка при регистрации:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при регистрации' });
    }
    res.status(201).send({ id: results.insertId, name, phoneNumber, birthday, genderId, surname, patronymic });
  });
});

// API для входа
app.post('/login', (req, res) => {
  const { phoneNumber, password } = req.body;

  pool.query('SELECT * FROM KpUser WHERE phoneNumber = ?', [phoneNumber], (error, results) => {
    if (error) {
      console.error('Ошибка при входе:', error);
      return res.status(500).send({ error: 'Что-то пошло не так при входе' });
    }

    if (results.length === 0) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const user = results[0];

    if (password !== user.password) {
      return res.status(401).send({ error: 'Неверный номер телефона или пароль' });
    }

    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
    res.send({ token });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
