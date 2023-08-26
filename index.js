const express = require('express');
const mysql = require('mysql');

const app = express();

// Configuración de la conexión a la base de datos
const connection = {
  connectionLimit: 100,
  host: '127.0.0.1',
  user: 'root',
  password: 'Rolex.b1',
  database: 'number', // Cambia esto al nombre de tu base de datos
};
const pool = mysql.createPool(connection);

function runStoredProcedure(callback) {
  // Conectar a la base de datos
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error:', err);
      callback({ status: 'error' });
      return;
    }

    // Ejecutar el procedimiento almacenado
    connection.query('CALL SelectAllValues()', (error, results) => {
      if (error) {
        console.error('Error:', error);
        console.log('Se ha encontrado un error');
        connection.release(); // Liberar la conexión en caso de error
        callback({ status: 'error' });
      } else {
        console.log('Ok!');
        if (results && results[0] && results[0].length > 0){
          callback({ status: 'ok', results: results[0] });
        } else {
          callback({ status: 'error' });
        }
        
      }

      connection.release(); // Liberar la conexión en caso de éxito o error
    });
  });
}

// Ejecutar el procedimiento almacenado al iniciar el servidor
runStoredProcedure((result) => {
  if (result.status === 'ok') {
    console.log('Procedimiento ejecutado correctamente');
  } else {
    console.log('Error al ejecutar el procedimiento');
  }
});

app.get('/run-stored-procedure', (req, res) => {
  runStoredProcedure((result) => {
    if (result.status === 'ok') {
      console.log('Procedimiento ejecutado correctamente en postman');
    } else {
      console.log('Error al ejecutar el procedimiento');
    }

    res.json(result);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en el puerto ${port}`);
});
