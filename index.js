import express from 'express'; // Cuando es una dependencia no es necesario colocar la extensión
import dotenv  from 'dotenv'; // instalamos la dependencia de dotenv para que nos permita leer esos archivo de .env y poder usar nuestras variables de entorno y mandar a llamar desde este archivo para pdoer ocultar esa información de gente externa.
import cors from 'cors'; // Es una forma de proteger una api, para evitar que cualquier persona pueda acceder a ella
import conectarDB from './config/db.js'; // Cuando es un archivo que creamos nosotros, se coloca la extensión de js.
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacientesRoutes.js';

const app = express(); // Esto va a mandar a llamar express, esta variable de app va a tener toda la funcionalidad que requerimos para crear el servidor.
app.use(express.json()); // De esta forma le decimos que estamos enviando datos de tipo json

dotenv.config(); // De esta forma va a escanear y va a buscar ese archivo de .env automáticamente

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = { // Cuando realicemos esta petición de crear cuenta con el formulario que creamos en el frontend, va a verificar que dominio es el que está realizando la petición y eso lo almacena en la variable origin y va a verificar si ese origin está registrado en la lista de dominios permitidos. Si es diferente a -1 significa que si lo encontró, es decir que si está en la lista de dominios permitidos 
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1) { // origin es la url sobre la cuál se está realizando la petición en el frontend para registrar esos usuarios, es decir, el dominio o la url de la página donde se registran los usuarios en el frontend.

            // El origen del Request está permitido
            callback(null, true) // null sería el error, osea que no va a haber error en caso tal de que si encuentre ese origin en la lista de dominios permitidos, y con el true le permite el acceso. De esta forma permitimos que el frontend se conecte con el backend para realizar la peticiónd del dominio del frontend al del backend. Y se puedan registrar los usuarios con el registro que hicimos en el frontend y se guarden en la base de datos que creamos con el backend.
        } else {
            callback(new Error('No permitido por CORS'))
        }
    }
}
// app.use(cors(corsOptions)) // Para decirle a express que queremos usar esta función y se ejecute 

// configuracion de CORS
app.use(cors({ origin: '*' })) // Para decirle a express que queremos usar esta función y se ejecute, y con este código permitimos que se haga la petición desde cualquier dominio y no tenga restricciones.

app.use("/api/veterinarios", veterinarioRoutes); // Esta es la forma en que express maneja el routing, osea las rutas. Instalamos nodemon para que siempre que hagamos cambios, no tengamos que ejecutar nuevamente la terminal con el servidor. Cuando el usuario visite la ruta de /api/veterinarios, lo manda al routing que tengamos en el archivo de veterinarioRoutes

app.use("/api/pacientes", pacienteRoutes);


const PORT = process.env.PORT || 4000; // Es decir va a tomar el puerto de nuestra variable del archivo .env, que es la ubicación que nos dió mongoDB, si no existe esa e puerto || asignale el puerto 4000

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto: ${PORT}`); // FrontEnd usualmente usa el puerto 4000
});