// Para proteger ciertas páginas se usan los customs middleware. También se pueden crear los middleware, para ver si un usuario pagó o cuando pagó, se pueden usar para ir restrigiendo ciertas áreas de nuestra aplicación.

import jwt from 'jsonwebtoken'; // Permite tanto crearlos como autenticarlos
import Veterinario from '../models/Veterinario.js';

const checkAuth =  async (req, res, next) => { // Ese next va a abrir esta función para ejecutarla, pero por ejemplo en algunos casos si no se le pasa un json web token o ya expiró, este next va a detener la ejecución del código y va a pasarlo al siguiente middleware.
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // De esta forma comprobamos que le estén enviando un token, pero también están enviando que tenga ese Bearer
    } {
        try { // Va a intentar desifrar ese token
            token = req.headers.authorization.split(" ")[1]; // Le decimos que en la posición 1, ya que en esa posición se encuentra el token, el bearer se encuentra en la posición [0], entonces le estamos diciendo que asigne el token sin el bearer en la variable token.
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET); // Con decoded ya tenemos acceso a los datos, jwt tiene un método llamado verify y toma dos valores, el token cuando autenticamos el usuario y el segundo valor es el mismo que usamos para generarlo, se utiliza también para autenticarlo.
            
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado"); // De esta forma con ese req.veterinario va a crear una sesión con la información del veterinario, eso nos trae la información del veterinario a excepción del password, token y confirmado.

            return next(); // Se va hacia el siguiente middleware
        } catch (error) {
            const e = new Error('Token no válido');
           return res.status(403).json({msg: e.message});
        }
    }

    if(!token) {
        // Esto se ejecuta en caso de que no tenga el token o no tenga el Bearer
        const error = new Error('Token no válido o inexistente');
        res.status(403).json({msg: error.message});
    }

    next();
};

export default checkAuth;