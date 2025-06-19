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
                    label.style.display = 'block'; // Mostrar solo el label correcto

                    input.value = datos[clave];
                    label.textContent = clave.toUpperCase();
                }
            }
        }


        mostrarCamposDesdeJSON(datos);
    } catch (error) {
        console.error("❌ Error al convertir a JSON:", error.message);
        console.error("Contenido que causó error:", texto);
    }

}
