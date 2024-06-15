import mongoose from 'mongoose';

const pacienteSchema = mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        propietario: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        fecha: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        sintomas: {
            type: String,
            required: true,
        },
        veterinario: {
            type: mongoose.Schema.Types.ObjectId, // Nos traemos el id del veterinario
            ref: 'Veterinario', // En caso de que nos queramos traer toda la info del veterinario
        },
    }, 
    {
        timestamps: true, // Para que nos cree las columnas de editado y creado
    }
);

const Paciente = mongoose.model("Paciente", pacienteSchema);

export default Paciente;