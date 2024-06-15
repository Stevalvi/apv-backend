// De esta forma queda mas ordenado el routing y lo volvemos más ligero. De esta forma usamos los controllers.

import Veterinario from "../models/Veterinario.js";
import generarJWT from '../helpers/generarJWT.js'; 
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => { // Esto se manda a llamar una vez que el usuario visite la ruta que colocamos en el archivo index.js. req es lo que mandas, res es la respuesta del servidor
    
    // Ese req.boyd existe en express, y lo que hace es recibir lo que enviemos nosotros, por ejemplo lo hicimos con postman, enviamos un correo tipo json desde postman y con este código y el código app.use(express.json()); del archivo index.js, recibimos ese correo en la terminal.
    const { email, nombre } = req.body; // De esta forma extraemos y accedemos esos valores que recibimos desde postman. Extraemos el nombre para usarlo en la función de emailRegistro() para enviar el email.

    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}); // findOne va a permitir buscar por los diferentes atributos que tenga el registro, osea el objeto con la información del veterinario.

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message}); // Para que retorne esa respuesta y no ejecute la siguiente linea. Con ese res.status accedemos al error y le asignamos un error de tipo json y le asignamos el error de usuario ya registrado para que lo muestre en postman y no nos salga esos errores en la terminal.
    }

    try {
        // Guardar un Nuevo Veterinario
        const veterinario = new Veterinario(req.body); // Vamos a crear una instancia de veterinario, es decir, va a tener toda esa información, forma de los dtos que tiene esa variable de Veterinario del archivo Vterinario.js y le decimos que lo cree con req.body, osea con esa información que le estamos pasando.
        const veterinarioGuardado = await veterinario.save(); // Usamos el await para que bloquee la siguiente en linea, hasta que esta linea de veterinarioGuardado haya terminado de ejeuctarse correctamente y haya almacenado ese registro. save() es útil si tenemos un objeto y lo vamos a guardar en una abse de datos, o también si tenemos un objweto, lo modificamos y después lo guardamos.

        // Enviar el email
        emailRegistro({ // Esto va a tomar el email, nombre y token de ese usuario. Para poder enviar el email
            email,
            nombre,
            token: veterinarioGuardado.token
        });


        res.json(veterinarioGuardado); // Retornamos ese veteinarioGuardado para que lo agregue al postman, nos devuelva esa información en tipo json.
    } catch (error) { // En caso de que haya un error al momento de almacenar un registro, queremos leerlo
        console.log(error);    
    }
}; // usamos { url: 'Desde API/VETERINARIOS'} en objeto para convertirlo en tipo json, para poder tener respuestaS tipo json, vamos a usar Postman para ir viendo nuestras apis creadas, para ver como funcionan.

const perfil = (req, res) => { // Esto se manda a llamar una vez que el usuario visite la ruta que colocamos en el archivo index.js. req es lo que mandas, res es la respuesta del servidor

    const { veterinario } = req;

    res.json(veterinario); // Muestra ya la información en el servidor ya cuando el usuario ha sido autenticado.
};

const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({token}); // await para bloquear el código siguiente en lo que busca ese usuario con ese token

    if(!usuarioConfirmar) { // En caso de que no encuentre ese usuario
        const error = new Error('Token no válido');
        return res.status(404).json({ msg: error.message});
    }

    try { // Lo que vamos a hacer aquí es cambiar confirmado a true y eliminar el token, porque el token como va a ser una url que el usuario va a visitar, se va a quedar almacenada en el historial, entonces ese token debe expirar, eliminar. Es por ejemplo cuando un banco te da un código válido por 5 minutos para retirar, o un token, es prácticamente lo mismo.
        usuarioConfirmar.token = null; // Tenemos una isntancia y podemos modificar sus datos y lo guardamos. Osea que una vez se ha verificado que el token existe, se cambial el token a null, osea que desaparece ese valor.
        usuarioConfirmar.confirmado = true; // Cambiamos el estado de false a true cuando se ha verificado.
        await usuarioConfirmar.save(); // Guardamos los cambios

        res.json({msg: 'Usuario Confirmado Correctamente'}); // Y enviamos mensaje de confirmación.
    } catch (error) {
        console.log(error);
    }
};

// Autenticar usuarios
// Para autenticar el usuario, debemos comprobar que ese usuario exista, después que su cuenta esté confirmada, después que su password esté bien escrito y finalmente luego vamos a autenticar.
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});// Para buscar por el email

    if(!usuario) { // Si no existe el usuario
      const error = new Error('El Usuario no existe');
      return res.status(404).json({ msg: error.message});  
    } 

    // Comprobar si el usuario está confirmado
    if(!usuario.confirmado) {
        const error = new Error('Tu Cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message});
    }

    // Revisar el Password, si es correcto o no
    if( await usuario.comprobarPassword(password)) { //Gracias a que tenemos una instancia de veterinario, podemos acceder a esa función que creamos: comprobarPassword() 
    
        // Autenticar
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id),
        }); // Retornamos el usuario
    } else {
        const error = new Error('El PassWord es incorrecto');
        return res.status(403).json({ msg: error.message});
    }

};

const olvidePassword = async (req, res) => {
    const { email } = req.body;
    
    const existeVeterinario = await Veterinario.findOne({email}); // Buscamos por el email

    if(!existeVeterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({msg: error.message});
    }

    try {
        existeVeterinario.token = generarId(); // Va a generar un id único, y lo va a agregar aquí al Token. Tenemos que guardarlo en la base de datos.
        await existeVeterinario.save();

        // Enviar Email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        res.json({msg: 'Hemos enviado un email con las instrucciones'});
    } catch (error) {
        console.log(error);
    }
};
const comprobarToken = async (req, res) => {
    const { token } = req.params; // req.body es la info del formulario y req.params es la info de la url
    const tokenValido = await Veterinario.findOne({ token }); // Verificamos que sea un token válido, osea que exista en la base de datos.

    if(tokenValido) {
        // El Token es válido, el usuario existe
        res.json({msg: 'Token válido y el usuario existe'});
    } else {
        const error = new Error('Token no válido');
        return res.status(400).json({msg: error.message});
    }
};
const nuevoPassword = async (req, res) => {

    const { token } = req.params; // Es la URL
    const { password } = req.body; // Body es lo que el usuario escriba

    const veterinario = await Veterinario.findOne({ token });
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message});
    }

    // Caso de que si exista ese token y sea válido
    try {
        veterinario.token = null; // Eliminamos ese token
        veterinario.password = password; // Reasignamos el password que el usuario cambió
        await veterinario.save();
        res.json({msg: 'Password modificado correctamente'});
    } catch (error) {
        console.log(error);
    }
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id) // Esto va a encontrar el veterinario que estemos editando
    if(!veterinario) { // Si no se encuentra ese veterinario
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    const { email } = req.body;
    if(veterinario.email !== req.body.email) { // Eso significa que el usuario está editando el email que ya tenía por uno nuevo
        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail) {
            const error = new Error('Ese email ya está en uso');
            return res.status(400).json({msg: error.message})
        }
    }

    // Si todo está bien mostramos el try catch
    try {
        veterinario.nombre = req.body.nombre
        veterinario.email = req.body.email

        veterinario.web = req.body.web

        veterinario.telefono = req.body.telefono

        const veterinarioActualizado = await veterinario.save() // Lo guardamos en la base de datos y esa va a ser la respuesta en la api
        res.json(veterinarioActualizado); // Lo retornamos porque una vez que editamos el eprfil y obtenemos una respuesta lo vamos a sincronizar con el state del frontend para reflejar esos cambios en la página
        
    } catch (error) {
        console.log(error)
    }
};

const actualizarPassword = async (req, res) => {

    // Leer los datos
    const { id } = req.veterinario;
    const { pwd_actual, pwd_nuevo } = req.body;

    // Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id); // Necesitamos la instancia de ese veterinario
    if(!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({msg: error.message})
    }

    // Comprobar su password
    if (await veterinario.comprobarPassword(pwd_actual)) {

        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo; 
        await veterinario.save(); // Para almacenarlo en la base de datos
        res.json({ msg: 'Password Almacenado Correctamente'})
    } else {
        const error = new Error('El Password actual es Incorrecto');
        return res.status(400).json({msg: error.message})
    }
};

export {
    registrar, 
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword, 
    actualizarPerfil,
    actualizarPassword
}