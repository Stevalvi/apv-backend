// Los Json Web Token
import jwt from 'jsonwebtoken'; // La dependencia jsonwebtoken nos permite generarlos pero tambipen comprobar que sean correctos

const generarJWT = (id) => { // Le decimos que va a tomar un id, y el objeto va a crear un webtoken con el id del usuario.
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d', // Expiración del token
    }); // Esto nos va a crear un nuevo jsonwebtoken, agregamos un objeto que va a tener toda la información del jsonwebtoken. No se recomienda almacenar por ejemplo passwordsdel usuario, números de tarjeta, ni por ejemplo, pagado: true. Nada de eso que tenga que ver con información sensible.
};

export default generarJWT;