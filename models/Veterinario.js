import mongoose from "mongoose";
import bcrypt from 'bcrypt'; // Es una dependencia que nos permite hashear passwords. Hashear contraseñas es el proceso de transformar una contraseña en una cadena de texto fija y generalmente más compleja con una función de hash(), esto para volverlo dificil de leler y que los demás no sepan cuál es el password. Este proceso tiene como objetivo mejorar la seguridad de las contraseñas almacenadas en sistemas informáticos. No importa si la persona encargada de la base de datos es de suma confianza, se recomienda hashear siempre los passwords.
import generarId from '../helpers/generarId.js';

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String, // Tipo String
        required: true, // Para tener una validación en els ervidor
        trim: true // Para que elimine los espacios en blanco
    },
    password: { // El password lo vamos a generar con una librería
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // Esto debe ser único, por eso si el usuario intenta crear otra cuenta con el mismo correo le va a decir que ya existe esa cuenta
        trim: true,
    },
    telefono: {
        type: String,
        default: null, // El teléfono no va a ser obligatorio, por eso agregamos este default null
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String, 
        default: generarId() 
    },
    confirmado: {
        type: Boolean,
        default: false // Este default cambia a true una vez que el usuario ha confirmado su email
    }

}); // Schema existe dentro del paquete de moongose, y luego creamos la estructura que va a tener los datos del modelo de veterinario 

// Antes de almacenar el registro lo vamos a hashear
veterinarioSchema.pre('save', async function(next) { // Usamos function, ya que function hace referencia al objeto actual, en cambio, un arrow function () => hace referencia de forma global.

    if(!this.isModified('password')) { // Esto es para que no vuelva a hashear un password que ya está hasheado.
        next(); // Con ese next() le decimos, ya acabaste aquí, vete al siguiente middleware, por ejemplo, el termina aquí y si un password ya está hasheado lo almacena en la base de datos, si después hay un cambio en el usuario, va a llegar aquí en este if, y si el password ua está hasheado, él lo manda hacia el siguiente y prevenimos que no lo vuelva a hashear.  
    }

    // Si el password ya está hasheado, no se ejecuta esto de abajo, pero si no ha sido hasheado, si se ejecuta.
    const salt = await bcrypt.genSalt(10); // Elsalt es como una serie de rondas de hasheo, 10 rondas es el default.

    this.password = await bcrypt.hash(this.password, salt);// Eso lo que va a hacer es reescribir esa propiedad de password del objeto, le colocamos this.pasword para respetar lo que el usuario quiere que sea su password, pero luego le colocamos salt. Ya con eso ese this.password va a estar hasheado.
}); // pre() es Antes de almacenarlo en la base de datos.

// De esta forma podemos registrar funciones que solo se ejecuten en ese modelo 
veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) { // El primer valor es el password del formulario y el segundo es el password hasheado

    return await bcrypt.compare(passwordFormulario, this.password); // Ese compare va a comparar que las contraseñas del usuario sean iguales, osea cuando vas a iniciar sesión, va a comparar la contraseña que registró cuando creó la cuenta, con la contraseña que ingrese para iniciar sesión.
};

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);  // De esta forma ya queda registrado como un modelo, como algo que debe interactuar con la base de datos. El primer valor es el nombre para que quede registrado ese modelo con ese nombre, y els egundo valor es el Schemma, osea la estructura o la forma que va a tener esos datos.

export default Veterinario;