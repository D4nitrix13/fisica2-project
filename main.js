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
                const F = datos.F ?? null;

                const tieneCampoE = E.some(e => e !== 0);
                const tieneCampoB = B.some(b => b !== 0);
                const tieneVelocidad = v.some(vv => vv !== 0);
                const tieneFuerza = typeof F === 'number' && !isNaN(F);

                // Funciones auxiliares
                const cross = (a, b) => [
                    a[1] * b[2] - a[2] * b[1],
                    a[2] * b[0] - a[0] * b[2],
                    a[0] * b[1] - a[1] * b[0]
                ];
                const norm = v => Math.sqrt(v.reduce((acc, x) => acc + x * x, 0));

                // === Energía cinética
                if (m !== 0 && tieneVelocidad && !tieneCampoB && !tieneCampoE && !tieneFuerza) {
                    const v_mag = norm(v);
                    const Ek = 0.5 * m * v_mag ** 2;

                    resultado.tipo = "Energía cinética";
                    resultado.formula = "E_k = \\frac{1}{2}mv^2";
                    resultado.magnitud = Ek;
                    resultado.resultado = `E_k = \\frac{1}{2}(${m})(${v_mag.toExponential(2)})^2 = ${Ek.toExponential(2)}~\\text{J}`;
                    return resultado;
                }


                // === Período de revolución
                if (q !== 0 && m !== 0 && tieneCampoB && !tieneCampoE && !tieneVelocidad && !tieneFuerza) {
                    const B_mag = norm(B);
                    const T = (2 * Math.PI * m) / (Math.abs(q) * B_mag);

                    resultado.tipo = "Período de revolución";
                    resultado.formula = "T = \\frac{2\\pi m}{|q|B}";
                    resultado.resultado = `T = \\frac{2\\pi(${m})}{|${q}|(${B_mag.toExponential(2)})} = ${T.toExponential(3)}~\\text{s}`;
                    resultado.magnitud = T;
                    return resultado;
                }


                // === 🧮 Calcular B a partir de F, q, v
                if (tieneFuerza && q !== 0 && tieneVelocidad && !tieneCampoB) {
                    const v_mag = norm(v);
                    const B_resultado = F / (Math.abs(q) * v_mag);

                    resultado.tipo = "Campo magnético a partir de F";
                    resultado.formula = "B = \\frac{F}{|q| \\cdot v}";
                    resultado.magnitud = B_resultado;
                    resultado.resultado = `B = \\frac{${F}}{|${q}| \\cdot ${v_mag.toExponential(2)}} = ${B_resultado.toExponential(2)}~\\text{T}`;
                    return resultado;
                }

                // === Fuerza total
                if (q !== 0 && tieneVelocidad && tieneCampoB && tieneCampoE) {
                    const vxB = cross(v, B); // producto cruzado
                    const sumaComponentes = E.map((e, i) => e + vxB[i]); // E + v x B
                    const F_total = sumaComponentes.map(f => q * f); // q(E + v x B)
                    const F_magnitud = norm(F_total);

                    resultado.tipo = "Fuerza total vectorial";
                    resultado.formula = "𝐅 = q (𝐄 + 𝐯 × 𝐁)";
                    resultado.vector = F_total;
                    resultado.magnitud = F_magnitud;
                    resultado.resultado = `\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) = ${JSON.stringify(F_total.map(n => n.toExponential(2)))}~\\text{N}`;
                    return resultado;
                }

                // === Radio del movimiento circular
                if (q !== 0 && m !== 0 && tieneVelocidad && tieneCampoB && !tieneCampoE) {
                    const v_mag = norm(v);
                    const B_mag = norm(B);
                    const r = (m * v_mag) / (Math.abs(q) * B_mag);

                    resultado.tipo = "Radio de trayectoria circular";
                    resultado.formula = "r = \\frac{mv}{|q|B}";
                    resultado.magnitud = r; // ✅ AGREGA ESTA LÍNEA
                    resultado.resultado = `r = \\frac{(${m})(${v_mag})}{|${q}|(${B_mag})} = ${r.toExponential(3)}~\\text{m}`;
                    return resultado;
                }


                // === Fuerza magnética pura
                if (q !== 0 && tieneVelocidad && tieneCampoB && !tieneCampoE) {
                    const vxB = cross(v, B);
                    const Fm = vxB.map(component => q * component);
                    const v_mag = norm(v);
                    const B_mag = norm(B);
                    const F_magnitud = Math.abs(q) * v_mag * B_mag;

                    resultado.tipo = "Fuerza magnética";
                    resultado.formula = "F = qvB\\sin\\theta,\\quad \\vec{F} = q(\\vec{v} \\times \\vec{B})";
                    resultado.vector = Fm;
                    resultado.magnitud = F_magnitud;
                    resultado.resultado = `F = (${q})(${v_mag.toExponential(2)})(${B_mag.toExponential(2)}) = ${F_magnitud.toExponential(2)}~\\text{N}`;
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



                // === Caso desconocido
                resultado.tipo = "Desconocido";
                resultado.resultado = "No se pudo determinar el procedimiento con los datos dados.";
                return resultado;
            }




            function renderizarProcedimientoEnKaTeX(solucion) {
                const contenedor = document.getElementById("resultado-container");
                const katexDiv = document.getElementById("katex-procedimiento");
                const resultadoDiv = document.getElementById("resultado-final");

                contenedor.style.display = 'block';

                const q = solucion.datos.q ?? 0;
                const m = solucion.datos.m ?? 0;
                const F = solucion.datos.F ?? 0;
                const v = [solucion.datos.vx ?? 0, solucion.datos.vy ?? 0, solucion.datos.vz ?? 0];
                const B = [solucion.datos.Bx ?? 0, solucion.datos.By ?? 0, solucion.datos.Bz ?? 0];
                const E = [solucion.datos.Ex ?? 0, solucion.datos.Ey ?? 0, solucion.datos.Ez ?? 0];

                const v_mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
                const B_mag = Math.sqrt(B[0] ** 2 + B[1] ** 2 + B[2] ** 2);


                // === Caso: Fuerza magnética
                if (solucion.tipo === "Fuerza magnética") {
                    katex.render(
                        `F = q \\cdot v \\cdot B \\cdot \\sin\\theta = (${q}) \\cdot (${v_mag.toExponential(2)}) \\cdot (${B_mag.toExponential(2)}) \\cdot (1)`,
                        katexDiv
                    );
                    resultadoDiv.textContent = `F = ${solucion.magnitud.toExponential(3)} N`;
                }

                // === Caso: Energía cinética
                else if (solucion.tipo === "Energía cinética") {
                    const v_mag = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2);
                    katex.render(
                        `E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}(${m})(${v_mag.toExponential(2)})^2`,
                        katexDiv
                    );
                    resultadoDiv.textContent = `E_k = ${solucion.magnitud.toExponential(3)} J`;
                }


                // === Caso: Período de revolución
                else if (solucion.tipo === "Período de revolución") {
                    katex.render(
                        `T = \\frac{2\\pi m}{|q| B} = \\frac{2\\pi (${m})}{|${q}| (${B_mag.toExponential(2)})}`,
                        katexDiv
                    );
                    resultadoDiv.textContent = `T = ${solucion.magnitud.toExponential(3)} s`;
                }


                // === Caso: Fuerza total vectorial (eléctrica + magnética)
                else if (solucion.tipo === "Fuerza total vectorial") {
                    // E + v x B
                    const vxB = [
                        v[1] * B[2] - v[2] * B[1],
                        v[2] * B[0] - v[0] * B[2],
                        v[0] * B[1] - v[1] * B[0]
                    ];
                    const suma = [
                        E[0] + vxB[0],
                        E[1] + vxB[1],
                        E[2] + vxB[2]
                    ];

                    katex.render(
                        `\\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) = (${q}) \\cdot ([${E.join(", ")}] + [${vxB.map(c => c.toExponential(2)).join(", ")}])`,
                        katexDiv
                    );

                    katex.render(
                        `\\vec{F} = \\left[ ${solucion.vector.map(n => n.toExponential(2)).join(",\\; ")} \\right]~\\text{N}`,
                        resultadoDiv
                    );

                }

                // === Caso: Campo magnético (desde F)
                else if (solucion.tipo === "Campo magnético (a partir de F)" || solucion.tipo === "Campo magnético a partir de F") {
                    katex.render(
                        `B = \\frac{F}{|q| \\cdot v} = \\frac{${F}}{|${q}| \\cdot (${v_mag.toExponential(2)})}`,
                        katexDiv
                    );
                    resultadoDiv.textContent = `B = ${solucion.magnitud.toExponential(3)} T`;
                }

                // === Caso: Radio de trayectoria circular
                else if (solucion.tipo === "Radio de trayectoria circular") {
                    katex.render(
                        `r = \\frac{m \\cdot v}{|q| \\cdot B} = \\frac{(${m}) \\cdot (${v_mag.toExponential(2)})}{|${q}| \\cdot (${B_mag.toExponential(2)})}`,
                        katexDiv
                    );
                    resultadoDiv.textContent = `r = ${solucion.magnitud.toExponential(3)} m`;

                }

                // === Caso: Fuerza eléctrica
                else if (solucion.tipo === "Fuerza eléctrica") {
                    katex.render(
                        `F = q \\cdot E = (${q}) \\cdot (${solucion.datos.Ex ?? 0})`,
                        katexDiv
                    );
                    const f_value = parseFloat(solucion.resultado.match(/\d+\.\d+e[+-]?\d+/)?.[0] ?? "0");
                    resultadoDiv.textContent = `F = ${f_value.toExponential(3)} N`;
                }

                // === Caso genérico no resuelto
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
