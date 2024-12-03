// Напишите HTTP сервер и реализуйте два обработчика, где:
// - По URL “/” будет возвращаться страница, на которой есть гиперссылка на вторую страницу по ссылке “/about”
// - А по URL “/about” будет возвращаться страница, на которой есть гиперссылка на первую страницу “/”
// - Также реализуйте обработку несуществующих роутов (404).
// -* На каждой странице реализуйте счетчик просмотров. Значение счетчика должно увеличиваться на единицу каждый раз, когда загружается страница

const http = require('http');
let counterMain = 0;
let counterAbout = 0;
let counterError = 0;

const server = http.createServer((req, res) => {
  if(req.url === "/") {
    res.writeHead(200, {
      'Content-Type' : 'text/html; charset=utf-8'
    });
    ++counterMain;
    res.end(`
      <h1>Корневая страница</h1>
      <p>Просмотров: ${counterMain}</p>
      <a href="/about">Ссылка на страницу /about</a>
      `);
  } else if (req.url === "/about") {
    res.writeHead(200, {
      'Content-Type' : 'text/html; charset=utf-8'
    });
    ++counterAbout;
    res.end(`
      <h1>Страница about</h1>
      <p>Просмотров: ${counterAbout}</p>
      <a href="/">Ссылка на страницу /</a>`);
  } else {
    res.writeHead(404, {
      'Content-Type' : 'text/html; charset=utf-8'
    });
    ++counterError;
    res.end(`
      <h1>Ошибка 404</h1>
      <p>Просмотров: ${counterError}</p>`);
  }
})

const port = 3000;

server.listen(port);