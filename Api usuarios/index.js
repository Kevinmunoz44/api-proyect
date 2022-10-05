const express = require('express'),
      bodyParser = require('body-parser'),
      jwt = require('jsonwebtoken'),
      config = require('./configs/configs'),
      app = express();
// 1
app.set('llave', config.llave);
// 2
app.use(bodyParser.urlencoded({ extended: true }));
// 3
app.use(bodyParser.json());
// 4
app.listen(3000,()=>{
    console.log('Servidor iniciado en el puerto 3000') 
});
// 5
app.get('/', function(req, res) {
    res.send('Inicio');
});

//Metodo post para autenticar si no se esta usando la base de datos yserá simplemente texto plano que autenticará por una condicional tambien es por si el usario y la contraseña no son las autenticas, se indicara que algo anda mal, pero si son las correctas empatan.
app.post('/autenticar', (req, res) => {
    if(req.body.usuario === "asfo" && req.body.contrasena === "holamundo") {
        const payload = {
            check:  true
  };
        const token = jwt.sign(payload, app.get('llave'), {
           expiresIn: 1440
  });
         res.json({
           mensaje: 'Autenticación correcta',
           token: token
  });
    } else {
        res.json({ mensaje: "Usuario o contraseña incorrectos"})
    }
})

// Esto sirve para protegerte de peticiones indebidas 
const rutasProtegidas = express.Router(); 
rutasProtegidas.use((req, res, next) => {
    const token = req.headers['access-token'];
	
    if (token) {
      jwt.verify(token, app.get('llave'), (err, decoded) => {      
        if (err) {
          return res.json({ mensaje: 'Token inválida' });    
        } else {
          req.decoded = decoded;    
          next();
        }
      });
    } else {
      res.send({ 
          mensaje: 'Token no proveída.' 
      });
    }
 });

app.get('/datos', rutasProtegidas, (req, res) => {
	const datos = [
		{ id: 1, nombre: "Asfo" },
		{ id: 2, nombre: "Denisse" },
		{ id: 3, nombre: "Carlos" }
	];
	
	res.json(datos);
});