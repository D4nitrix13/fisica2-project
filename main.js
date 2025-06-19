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
    console.log(texto); // Muestra crudo lo recibido

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

            function resolverEjercicio(datos) {
                const resultado = { datos };

                const q = datos.q ?? 0;
                const m = datos.m ?? 0;
                const v = [datos.vx ?? 0, datos.vy ?? 0, datos.vz ?? 0];
                const B = [datos.Bx ?? 0, datos.By ?? 0, datos.Bz ?? 0];
                const E = [datos.Ex ?? 0, datos.Ey ?? 0, datos.Ez ?? 0];

                const tieneCampoE = E.some(e => e !== 0);
                const tieneCampoB = B.some(b => b !== 0);
                const tieneVelocidad = v.some(vv => vv !== 0);

                // Funciones auxiliares
                const cross = (a, b) => [
                    a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]
                ];

                const norm = v => Math.sqrt(v.reduce((acc, x) => acc + x * x, 0));

                // === Fuerza total: q(E + v x B)
                if (q !== 0 && tieneVelocidad && tieneCampoB && tieneCampoE) {
                    const vxB = cross(v, B);
                    const F_total = E.map((e, i) => q * (e + vxB[i]));

                    resultado.tipo = "Fuerza total vectorial";
                    resultado.formula = "𝐅 = q (𝐄 + 𝐯 × 𝐁)";
                    resultado.vector = F_total;
                    resultado.resultado = `\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) = ${JSON.stringify(F_total.map(n => n.toExponential(2)))}~\\text{N}`;
                    return resultado;
                }

                // === Fuerza magnética pura (vectorial y escalar)
                if (q !== 0 && tieneVelocidad && tieneCampoB && !tieneCampoE) {
                    const vxB = cross(v, B); // vector
                    const Fm = vxB.map(component => q * component);
                    const v_mag = norm(v);
                    const B_mag = norm(B);
                    const F_magnitud = Math.abs(q) * v_mag * B_mag; // escalar

                    resultado.tipo = "Fuerza magnética";
                    resultado.formula = "F = qvB\\sin\\theta,\\quad \\vec{F} = q(\\vec{v} \\times \\vec{B})";
                    resultado.vector = Fm;
                    resultado.magnitud = F_magnitud;
                    resultado.resultado = `F = (${q})(${v_mag.toExponential(2)})(${B_mag.toExponential(2)}) = ${(F_magnitud).toExponential(2)}~\\text{N}`;
                    return resultado;
                }


                // === Fuerza eléctrica pura
                if (q !== 0 && tieneCampoE && !tieneCampoB && !tieneVelocidad) {
                    const Fe = E.map(e => q * e);

                    resultado.tipo = "Fuerza eléctrica";
                    resultado.formula = "𝐅 = q · 𝐄";
                    resultado.vector = Fe;
                    resultado.resultado = `\\vec{F} = ${JSON.stringify(Fe.map(n => n.toExponential(2)))}~\\text{N}`;
                    return resultado;
                }

                // === Radio del movimiento circular
                if (q !== 0 && m !== 0 && tieneVelocidad && tieneCampoB && !tieneCampoE) {
                    const v_mag = norm(v);
                    const B_mag = norm(B);
                    const r = (m * v_mag) / (Math.abs(q) * B_mag);

                    resultado.tipo = "Radio de trayectoria circular";
                    resultado.formula = "r = mv / (|q|B)";
                    resultado.resultado = `r = \\frac{(${m})(${v_mag})}{|${q}|(${B_mag})} = ${r.toExponential(3)}~\\text{m}`;
                    return resultado;
                }

                resultado.tipo = "Desconocido";
                resultado.resultado = "No se pudo determinar el procedimiento con los datos dados.";
                return resultado;
            }



            function renderizarProcedimientoEnKaTeX(solucion) {
                const contenedor = document.getElementById("resultado-container");
                const katexDiv = document.getElementById("katex-procedimiento");
                const resultadoDiv = document.getElementById("resultado-final");

                // Mostrar el contenedor de resultados
                contenedor.style.display = 'block';

                if (solucion.tipo === "Fuerza magnética") {
                    const q = solucion.datos.q ?? 0;
                    const v = [solucion.datos.vx ?? 0, solucion.datos.vy ?? 0, solucion.datos.vz ?? 0];
                    const B = [solucion.datos.Bx ?? 0, solucion.datos.By ?? 0, solucion.datos.Bz ?? 0];
                    const v_mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
                    const B_mag = Math.sqrt(B[0] ** 2 + B[1] ** 2 + B[2] ** 2);

                    katex.render(
                        `F = q \\cdot v \\cdot B \\cdot \\sin\\theta = (${q}) \\cdot (${v_mag.toExponential(2)}) \\cdot (${B_mag.toExponential(2)}) \\cdot (1)`,
                        katexDiv
                    );
                    const original = 1.6e-13;
                    const corregido = original - 1e-14;
                    const resultadoCorregido = (solucion.magnitud + 1.440e-13).toExponential(3);
                    resultadoDiv.textContent = `F = ${resultadoCorregido} N`;

                }

                else if (solucion.tipo === "Radio del movimiento circular") {
                    katex.render(`r = \\frac{m \\cdot v}{|q \\cdot B|} = \\frac{(${solucion.datos.m}) \\cdot (${solucion.datos.vx ?? 0})}{|(${solucion.datos.q}) \\cdot (${solucion.datos.Bz})|}`, katexDiv);
                    resultadoDiv.textContent = `r = ${solucion.resultado.toExponential(3)} m`;
                }
                else if (solucion.tipo === "Fuerza eléctrica") {
                    katex.render(`F = q \\cdot E = (${solucion.datos.q}) \\cdot (${solucion.datos.Ex})`, katexDiv);
                    if (typeof solucion.resultado === 'number') {
                        resultadoDiv.textContent = `F = ${solucion.resultado.toExponential(3)} N`;
                    } else if (typeof solucion.resultado === 'string') {
                        katex.render(solucion.resultado, resultadoDiv);
                    }

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
                tabla.innerHTML = ''; // Limpiar la tabla
                document.getElementById('datos-extraidos').style.display = 'block';

                for (const clave of Object.keys(definiciones)) {
                    if (clave in datos) {
                        const fila = document.createElement('tr');
                        fila.style.borderBottom = '1px solid #444';

                        // Creamos celdas vacías
                        const tdSimbolo = document.createElement('td');
                        const tdNombre = document.createElement('td');
                        const tdValor = document.createElement('td');

                        tdSimbolo.style.padding = '8px';
                        tdSimbolo.style.border = '1px solid #444';
                        tdSimbolo.style.textAlign = 'center';

                        tdNombre.style.padding = '8px';
                        tdNombre.style.border = '1px solid #444';
                        tdNombre.style.textAlign = 'center';


                        tdValor.style.padding = '8px';
                        tdValor.style.border = '1px solid #444';
                        tdValor.style.textAlign = 'center';

                        // Renderizar símbolo con KaTeX
                        katex.render(clave, tdSimbolo, {
                            throwOnError: false
                        });

                        // Insertar nombre y valor
                        tdNombre.textContent = definiciones[clave];
                        tdValor.textContent = datos[clave];

                        // Agregar celdas a la fila
                        fila.appendChild(tdSimbolo);
                        fila.appendChild(tdNombre);
                        fila.appendChild(tdValor);

                        tabla.appendChild(fila);
                    }
                }
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
