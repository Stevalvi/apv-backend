// En este archivo van a ir todas las rutas que estén relacionadas a veterinario.

import express from 'express'; // Una vez que importemos exopress tenemos acceso al reouting
const router = express.Router();
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';
 
// Área pública
router.post('/', registrar); // post porque enviamos datos hacia el servidor.
router.get('/confirmar/:token', confirmar); // Agregamos un parámetro dinámico :token
router.post('/login', autenticar); // Post porque vamos a enviar los datos por medio de un formulario
router.post('/olvide-password', olvidePassword); // Para validar el email del usuario
router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword); // En el get Le enviamos un token al usuario para validar y lo vamos a leer y en el post almacenamos el password. En express se puede simplificarf el código si es la misma ruta como en este caso.

// Área privada
router.get('/perfil', checkAuth, perfil); // get es cuando obtenemos datos del servidor. Una vez que yo visite perfil, va a ir a la función de checkAuth, osea al middleware y abre esa función, después se ejecuta el next y lo manda al otro middleware que sería perfil.
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;