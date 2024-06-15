import Paciente from "../models/Paciente.js";

const agregarPaciente = async (req, res) => {
    const paciente = new Paciente(req.body); // Crear nueva instancia con la forma y datos que tenga ese modelo de paciente
    paciente.veterinario = req.veterinario._id; // Eso nos retorna el id del veterinario que se creó y se almacenó en la variable req.veterinario
    try {
        const pacienteAlmacenado = await paciente.save(); // Almacenamos paciente
        res.json(pacienteAlmacenado); // Retornamos
    } catch (error) {
        console.log(error);
    }
};
const obtenerPacientes = async (req, res) => {
    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario); // Filtramos sobre los pacientes que estén asociados al veterinario que ha iniciado sesión. Ese find() nos retorna el que le solicitemos, en este caso le estamos diciendo que solo nos traiga el veterinario que esté autenticado, osea el que se guardó en la variable de req.veterinario

    res.json(pacientes);
};

const obtenerPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

     if(!paciente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) { // Que revise si ese paciente fue agregado por ese veterinario que fue autenticado, solo él puede verlo. Siempre que vayamos a comparar los id de MongoDB hay que convertirlos a string
        return res.json({msg: 'Acción no válida'});
    }

    res.json(paciente); // De esta forma ya podemos obtener un registro en específico
};
const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }

    // Actualizar paciente

    // Le decimos que vamos a actualizar estos campos, en caso tal de que en MongoDB no actualicemos ciertos campos, por ejemplo que solo actualicemos el nombre y lo demas no lo agreguemos, para que no nos salga error ya que los demás campos son obligatorios, le decimos que asigne el mismo valor que agregamos al crear los pacientes, por eso le colocamos || paciente. seguido de la propiedad.
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;

    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error);
    }
    
};
const eliminarPaciente = async (req, res) => {
    const { id } = req.params;
    const paciente = await Paciente.findById(id);

    if(!paciente) {
        return res.status(404).json({msg: 'No encontrado'});
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()) {
        return res.json({msg: 'Acción no válida'});
    }

    // Eliminar paciente

    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'});
    } catch (error) {
        console.log(error);
    }
    
};

export { agregarPaciente, obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente };