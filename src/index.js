const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const data = {
    message: '¡Hola desde la API!',
    timestamp: new Date()
  };
  res.json(data);
  console.log(`Get : ${data.timestamp}`);
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
