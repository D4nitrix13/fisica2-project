function renderEtiqueta(id, latex) {
    katex.render(latex, document.getElementById(id), { throwOnError: false });
}

document.addEventListener('DOMContentLoaded', () => {
    // Renderizado KaTeX
    renderEtiqueta("q-label", "q");
    renderEtiqueta("m-label", "m");
    renderEtiqueta("vx-label", "v_x");
    renderEtiqueta("vy-label", "v_y");
    renderEtiqueta("vz-label", "v_z");
    renderEtiqueta("Ex-label", "E_x");
    renderEtiqueta("Ey-label", "E_y");
    renderEtiqueta("Ez-label", "E_z");
    renderEtiqueta("Bx-label", "B_x");
    renderEtiqueta("By-label", "B_y");
    renderEtiqueta("Bz-label", "B_z");
    renderEtiqueta("t-label", "t");
    renderEtiqueta("F-label", "F");

    // Evento al presionar el botón
    document.querySelector('.btn-calcular').addEventListener('click', async function (e) {
        e.preventDefault();
        const textarea = document.getElementById('enunciado');
        if (!textarea) {
            console.error('No se encontró el textarea con id "enunciado-textarea"');
            return;
        }

        const enunciado = textarea.value;
        await enviarPrompt(enunciado);
    });
});

async function enviarPrompt(enunciadoUsuario) {
    const prompt = `
        Dado el siguiente enunciado de Física 2 sobre "Fuerza de Lorentz sobre una carga puntual", devuelve un JSON con únicamente los valores numéricos explícitos que aparecen en el enunciado. Asocia cada valor al campo correspondiente si está presente. Si un campo no aparece, simplemente omítelo.

        Los posibles campos son:  

        - Ex, Ey, Ez  
        - Bx, By, Bz  
        - vx, vy, vz  
        - q (carga)  
        - m (masa)  
        - t (tiempo)  
        - F (fuerza)

        No expliques, no desarrolles y no hagas cálculos no pongas comentarios de ningun tipo y si el valor de un campo es null omitelo. Devuelve solamente el JSON con los valores encontrados.

        **Ejemplo de respuesta esperada:**
        
        {
        "q": -1.6e-19,
        "vx": 3e5,
        "Bz": 0.02
        }

        Enunciado: ${enunciadoUsuario}
    `;

    const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'mistral',
            prompt,
            stream: true
        })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let texto = "";
    let done = false;
    let full = "";
    const output = document.getElementById('output'); // Asegúrate de tener un elemento con id="output"

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), { stream: true });

        chunk.split('\n').forEach(line => {
            if (line.trim()) {
                try {
                    const obj = JSON.parse(line);
                    if (obj.response) {
                        // Quita cualquier fragmento pensado
                        const clean = obj.response.replace(/<think>.*?<\/think>/gs, '');
                        full += clean;
                        texto = full;
                        if (output) output.textContent = full;
                    }
                } catch (e) {
                    // Ignorar líneas JSON parciales
                }
            }
        });

    }
    texto = full.trim();
    // console.log(texto); // Muestra crudo lo recibido

    // Intentar convertir a objeto JSON seguro
    try {
        const jsonLimpio = texto
            .replace(/\/\/.*$/gm, '')
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/,\s*}/g, '}')
            .replace(/,\s*]/g, ']');

        let datos = JSON.parse(jsonLimpio);
        datos = Object.fromEntries(Object.entries(datos).filter(([_, v]) => v !== null));

        console.log("✅ Objeto JSON válido:", datos);

        function mostrarCamposDesdeJSON(datos) {
            // Mostrar el contenedor principal
            document.getElementById('campos-ocultos').style.display = 'block';

            // 🔁 Primero ocultamos todos los inputs y labels
            const inputs = document.querySelectorAll('#campos-ocultos input');
            const labels = document.querySelectorAll('#campos-ocultos label');

            inputs.forEach(input => input.style.display = 'none');
            labels.forEach(label => label.style.display = 'none');

            // 🔁 Luego mostramos solo los que aparecen en el JSON
            for (const clave in datos) {
                const input = document.getElementById(clave);
                const label = document.getElementById(`${clave}-label`);

                if (input && label) {
                    input.style.display = 'block';
                    label.style.display = 'block';

                    input.value = datos[clave];
                    label.textContent = clave.toUpperCase();
                }
            }

            // ✅ Extraer datos visibles
            function obtenerValoresVisibles() {
                const inputsVisibles = document.querySelectorAll('#campos-ocultos input');
                const datosExtraidos = {};

                inputsVisibles.forEach(input => {
                    if (input.offsetParent !== null) {
                        const clave = input.id;
                        const valor = parseFloat(input.value);
                        if (!isNaN(valor)) {
                            datosExtraidos[clave] = valor;
                        }
                    }
                });

                return datosExtraidos;
            }

            // ✅ Resolver con los datos visibles
            function resolverEjercicio(datos) {
                const resultado = { datos }; // 👈 Guardamos también los datos

                if ('q' in datos && 'vx' in datos && 'Bz' in datos) {
                    resultado.tipo = "Fuerza magnética";
                    resultado.formula = "F = q * v * B";
                    resultado.resultado = datos.q * datos.vx * datos.Bz;
                }
                else if ('m' in datos && 'vx' in datos && 'q' in datos && 'Bz' in datos) {
                    resultado.tipo = "Radio del movimiento circular";
                    resultado.formula = "r = m * v / (q * B)";
                    resultado.resultado = (datos.m * datos.vx) / (Math.abs(datos.q * datos.Bz));
                }
                else if ('q' in datos && 'Ex' in datos) {
                    resultado.tipo = "Fuerza eléctrica";
                    resultado.formula = "F = q * E";
                    resultado.resultado = datos.q * datos.Ex;
                }
                else {
                    resultado.tipo = "Desconocido";
                    resultado.resultado = null;
                    resultado.error = "No se encontró fórmula aplicable.";
                }

                return resultado;
            }



            function renderizarProcedimientoEnKaTeX(solucion) {
                const contenedor = document.getElementById("resultado-container");
                const katexDiv = document.getElementById("katex-procedimiento");
                const resultadoDiv = document.getElementById("resultado-final");

                // Mostrar el contenedor de resultados
                contenedor.style.display = 'block';

                if (solucion.tipo === "Fuerza magnética") {
                    katex.render(`F = q \\cdot v \\cdot B = (${solucion.datos.q}) \\cdot (${solucion.datos.vx}) \\cdot (${solucion.datos.Bz})`, katexDiv);
                    resultadoDiv.textContent = `F = ${solucion.resultado.toExponential(3)} N`;
                }
                else if (solucion.tipo === "Radio del movimiento circular") {
                    katex.render(`r = \\frac{m \\cdot v}{|q \\cdot B|} = \\frac{(${solucion.datos.m}) \\cdot (${solucion.datos.vx})}{|(${solucion.datos.q}) \\cdot (${solucion.datos.Bz})|}`, katexDiv);
                    resultadoDiv.textContent = `r = ${solucion.resultado.toExponential(3)} m`;
                }
                else if (solucion.tipo === "Fuerza eléctrica") {
                    katex.render(`F = q \\cdot E = (${solucion.datos.q}) \\cdot (${solucion.datos.Ex})`, katexDiv);
                    resultadoDiv.textContent = `F = ${solucion.resultado.toExponential(3)} N`;
                }
                else {
                    katexDiv.textContent = '';
                    resultadoDiv.textContent = "No se pudo determinar el procedimiento con los datos dados.";
                }
            }

            function mostrarDatosExtraidos(datos) {
                const definiciones = {
                    q: 'Carga eléctrica (C)',
                    m: 'Masa (kg)',
                    vx: 'Velocidad en X (m/s)',
                    vy: 'Velocidad en Y (m/s)',
                    vz: 'Velocidad en Z (m/s)',
                    Ex: 'Campo eléctrico X (V/m)',
                    Ey: 'Campo eléctrico Y (V/m)',
                    Ez: 'Campo eléctrico Z (V/m)',
                    Bx: 'Campo magnético X (T)',
                    By: 'Campo magnético Y (T)',
                    Bz: 'Campo magnético Z (T)',
                    t: 'Tiempo (s)',
                    F: 'Fuerza (N)'
                };

                const tabla = document.getElementById('tabla-datos');
                tabla.innerHTML = ''; // Limpiar por si acaso

                for (const clave in datos) {
                    const valor = datos[clave];
                    const descripcion = definiciones[clave] || 'Desconocido';

                    const fila = document.createElement('tr');

                    fila.innerHTML = `
            <td style="padding: 0.5rem;">${clave}</td>
            <td style="padding: 0.5rem;">${descripcion}</td>
            <td style="padding: 0.5rem;">${valor}</td>
        `;

                    tabla.appendChild(fila);
                }

                // Mostrar el contenedor
                document.getElementById('datos-extraidos').style.display = 'block';
            }


            // ✅ Ejecutar
            const datosVisibles = obtenerValoresVisibles();
            const solucion = resolverEjercicio(datosVisibles);
            console.log("🧮 Solución del ejercicio:", solucion);
            renderizarProcedimientoEnKaTeX(solucion);
            mostrarDatosExtraidos(datos);


        }



        mostrarCamposDesdeJSON(datos);
    } catch (error) {
        console.error("❌ Error al convertir a JSON:", error.message);
        console.error("Contenido que causó error:", texto);
    }

}
