const generarId = () => {

    return Date.now().toString(32) + Math.random().toString(32).substring(2); // Esto genera un id muy complejo y único.
};

export default generarId;