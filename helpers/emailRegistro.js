import nodemailer from 'nodemailer'; // Es una dependencia que sirve para el envío de emails


const emailRegistro = async (datos) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos;

    // Enviar el email

    const info = await transporter.sendMail({ // Usamos transporter porque ese va a crear una instancia de los datos con esa información y uno de sus métodos es sendMail, le pasamos una configuración: from es Quien envia el email, to es a quien se le envia el email, el subject es el asunto, text es básicamente la versión sin html, y el html es lo que se va a mostrar en el email que enviemos.
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: 'Comprueba tu cuenta en APV',
        text: 'Comprueba tu cuenta en APV',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya está lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>
        
            <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
    }); // Ese process.env.FRONTEND_URL contiene la ruta a la cuál será redirigido el usuario para comprobar su email, esa ruta es la del frontend que creamos con rect de la ruta/confirmar

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegistro;

