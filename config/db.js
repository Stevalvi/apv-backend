import mongoose from "mongoose"; // Importamos la dependencia, se usa para conectar nuestra aplicación a la base de datos de MongoDB aplication.

const conectarDB = async () => {
    try { // La parte que conecta con el servidor de MongoDB atlas

        const db = await mongoose.connect( process.env.MONGO_URI, { // Ese process.env es código de nodejs. , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }); // Esto nos permite conectarnos a la base de datos de MongoDB que creamos., esa configuración es la que nos permite conectarnos a la base de datos, y ese código de string lo copiamos de nuestra base de datos de MongoDB, le damos en conectar Clusters y en la opción de Driver, luego copiamos el código de abajo.

        const url = `${db.connection.host}:${db.connection.port}`; // Esto nos va a dar una url y el puerto donde se está conectando.
        console.log(`MongoDB conectado en: ${url}`);
        
    } catch (error) {
        console.log(`error: ${error.message}`); // Para que nos muestre un mensaje de error más detallado en caso tal de que no se haya podido conectar la base de datos.
        process.exit(1); // Gracias a este código es que nos va a imprimir un mensaje de error.
    }
};

export default conectarDB;