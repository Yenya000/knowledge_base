const express = require('express');
const app = express();

// Middleware для распознавания JSON в теле запросов (пригодится позже для POST/PUT)
app.use(express.json());

// Роуты
app.use('/api/categories', require('./routes/categories'));
app.use('/api/articles', require('./routes/articles'));

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});