import express from 'express';
const router = express.Router();
import { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';
import checkAuth from '../middleware/authMiddleware.js';

router.route("/") // Esta ruta mantiene la ruta que definimos en pacientes en el archivo index.js
    .post(checkAuth, agregarPaciente) // Cuando enviemos una solicitud tipo post nos permitirá agregar pacientes. Para poder agregar un paciente, necesitas tener una cuenta, por eso colocamos el checkAuth
    .get(checkAuth, obtenerPacientes) // Cuando sea tipo get nos va a traer esos pacientes que estén asociados con ese veterinario, agregamos el chechAuth acá tambien porque requerimos tener el usuario autenticado.

router.route("/:id") // Nos traiga ese paciente por su id en específico
    .get(checkAuth, obtenerPaciente) // para que sea un request autenticado, y vamos a obtener ese paciente
    .put(checkAuth, actualizarPaciente) // Lo mismo pero para actualizar el paciente. Patch también se usa para actualizar
    .delete(checkAuth, eliminarPaciente) // Eliminarlo


export default router;