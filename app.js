// Mapeo de qué campos se usan en cada tipo de ejercicio
const camposPorEjercicio = {
    1: ['q', 'm', 'vz', 'Bz'],                               // Movimiento circular
    2: ['q', 'm', 't', 'Ex'],                   // Campo E y aceleración lineal
    3: ['Ex', 'Bz'],  // Campo eléctrico en X y campo magnético en Z
    4: ['q', 'vx', 'vy', 'vz', 'Bx', 'By', 'Bz'],           // Producto vectorial v x B
    5: ['q', 'm', 'vx', 'vy', 'vz', 'Bx', 'By', 'Bz'],      // Movimiento helicoidal
    6: ['q', 'Bx', 'By', 'Bz', 'F'],                        // Calcular velocidad con F conocida
    7: ['q', 'vx', 'vy', 'vz', 'Ex', 'Ey', 'Ez', 'Bx', 'By', 'Bz']  // Fuerza total vectorial
};

function actualizarVisibilidadCampos() {
    const tipo = document.getElementById('tipo').value;
    const camposVisibles = camposPorEjercicio[tipo] || [];

    const todosLosCampos = [
        'q', 'm', 'vx', 'vy', 'vz',
        'Ex', 'Ey', 'Ez',
        'Bx', 'By', 'Bz',
        't', 'F'
    ];

    todosLosCampos.forEach(id => {
        const input = document.getElementById(id);
        const label = input?.previousElementSibling;
        const mostrar = camposVisibles.includes(id);

        if (input && label) {
            input.style.display = mostrar ? 'block' : 'none';
            label.style.display = mostrar ? 'block' : 'none';
            input.disabled = !mostrar;
            if (!mostrar) input.value = ''; // limpia campos que no se usan
        }
    });
}

// Activar al cambiar el tipo de ejercicio
document.getElementById('tipo').addEventListener('change', actualizarVisibilidadCampos);

// Activar al cargar
actualizarVisibilidadCampos();


// --------------------------------------------------------------------------------------------------------------------------------------

function renderEtiqueta(id, latex) {
    katex.render(latex, document.getElementById(id), { throwOnError: false });
}

// Render simbología
renderEtiqueta("q-label", "q\\ (\\text{Carga})");
renderEtiqueta("m-label", "m\\ (\\text{Masa})");
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

// --------------------------------------------------------------------------------------------------------------------------------------

function resolver() {
    const tipo = parseInt(document.getElementById('tipo').value);

    // Función segura para obtener valor numérico o 0
    const getVal = id => {
        const el = document.getElementById(id);
        return el && el.value ? parseFloat(el.value) : 0;
    };

    const q = getVal('q');
    const m = getVal('m');
    const vx = getVal('vx'), vy = getVal('vy'), vz = getVal('vz');
    const Ex = getVal('Ex'), Ey = getVal('Ey'), Ez = getVal('Ez');
    const Bx = getVal('Bx'), By = getVal('By'), Bz = getVal('Bz');
    const t = getVal('t');
    const F_input = getVal('F');

    const v = [vx, vy, vz];
    const E = [Ex, Ey, Ez];
    const B = [Bx, By, Bz];

    const dot = (a, b) => a.map((v, i) => v * b[i]);
    const cross = (a, b) => [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
    const norm = v => Math.sqrt(v.reduce((s, x) => s + x * x, 0));

    let result = '';

    try {
        switch (tipo) {
            case 1: // Movimiento circular
                const v1 = norm(v);
                const B1 = norm(B);
                const F = Math.abs(q) * v1 * B1;
                const r = m * v1 / (Math.abs(q) * B1);
                const T = (2 * Math.PI * m) / (Math.abs(q) * B1);

                resumenLatex = `
                \\textbf{Resultados del movimiento circular:} \\\\[1em]
                F = ${F.toExponential(3)}\\ \\text{N} \\quad
                r = ${r.toExponential(3)}\\ \\text{m} \\quad
                T = ${T.toExponential(3)}\\ \\text{s}
                `;

                // F -> Fuerza magnética
                // r -> Radio de la trayectoria circular
                // T -> Período del movimiento


                steps = `
                    \\textbf{Ejercicio 1 – Movimiento circular} \\\\[1em]
                    \\vec{F} = |q| \\cdot v \\cdot B = (${Math.abs(q)})(${v1})(${B1}) = ${F.toExponential(4)}\\ \\text{N} \\\\[1em]
                    r = \\frac{mv}{|q|B} = \\frac{(${m})(${v1})}{(${Math.abs(q)})(${B1})} = ${r.toExponential(4)}\\ \\text{m} \\\\[1em]
                    T = \\frac{2\\pi m}{|q|B} = \\frac{2\\pi(${m})}{(${Math.abs(q)})(${B1})} = ${T.toExponential(4)}\\ \\text{s}
                `;
                break;


            case 2: // Campo E, aceleración lineal
                const E2 = [Ex, Ey, Ez];
                const E_mag = norm(E2);
                const Fe = q * E_mag;
                const a2 = Fe / m;
                const v2 = a2 * t;

                resumenLatex = `
                    \\textbf{Resultados del movimiento lineal:} \\\\[1em]
                    F = ${Fe.toExponential(3)}\\ \\text{N} \\quad
                    a = ${a2.toExponential(3)}\\ \\text{m/s}^2 \\quad
                    v = ${v2.toExponential(3)}\\ \\text{m/s}
                `;

                // F -> Fuerza Magnetica
                // a -> Aceleración
                // v -> Velocidad

                steps = `
                    \\textbf{Ejercicio 2 – Campo eléctrico, aceleración lineal} \\\\[1em]
                    \\vec{F} = q \\cdot \\vec{E} = (${q})(${E_mag}) = ${Fe.toExponential(3)}\\ \\text{N} \\\\[1em]
                    a = \\frac{F}{m} = \\frac{${Fe.toExponential(3)}}{${m}} = ${a2.toExponential(3)}\\ \\text{m/s}^2 \\\\[1em]
                    v = a \\cdot t = (${a2.toExponential(3)})(${t}) = ${v2.toExponential(3)}\\ \\text{m/s}
                `;
                break;


            case 3: // Campo E y B perpendiculares, F total = 0
                const E3 = norm([Ex, Ey, Ez]); // magnitud del campo eléctrico
                const B3 = norm([Bx, By, Bz]); // magnitud del campo magnético

                const v_eq = E3 / B3;

                resumenLatex = `
                    \\textbf{Velocidad para que la fuerza total sea nula:} \\\\[1em]
                    v = \\frac{E}{B} = \\frac{${E3}}{${B3}} = ${v_eq.toExponential(3)}\\ \\text{m/s}
                `;

                steps = `
                    \\textbf{Ejercicio 3 – Campo eléctrico y magnético perpendiculares} \\\\[1em]
                    \\text{Para que } \\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) = 0, \\text{ se debe cumplir:} \\\\
                    \\vec{v} \\times \\vec{B} = -\\vec{E} \\\\[1em]
                    \\text{Como } \\vec{E} \\perp \\vec{B}, \\text{ la velocidad es:} \\\\
                    v = \\frac{E}{B} = \\frac{${E3}}{${B3}} = ${v_eq.toExponential(3)}\\ \\text{m/s}
                `;
                break;


            case 4: // Producto vectorial completo: F = q (v × B)
                // Si omites vz, no puedes construir el vector completo.
                // Si omites Bx o By, el producto vectorial se rompe.
                // Aunque sean cero, deben estar explícitamente en la fórmula para que el código sea general.
                const v4 = [vx, vy, vz];
                const B4 = [Bx, By, Bz];
                const vxB4 = cross(v4, B4); // producto vectorial
                const F4 = vxB4.map(x => q * x); // aplicar la carga

                resumenLatex = `
                    \\textbf{Fuerza magnética vectorial:} \\\\[1em]
                    \\vec{F} = q(\\vec{v} \\times \\vec{B}) = [
                    ${F4.map(x => x.toExponential(3)).join(', ')}]~\\text{N}
                `;

                steps = `
                    \\textbf{Ejercicio 4 – Producto vectorial completo} \\\\[1em]
                    \\vec{v} = (${vx}, ${vy}, ${vz}), \\quad
                    \\vec{B} = (${Bx}, ${By}, ${Bz}) \\\\[1em]
                    \\vec{v} \\times \\vec{B} =
                    \\begin{vmatrix}
                    \\hat{i} & \\hat{j} & \\hat{k} \\\\
                    ${vx} & ${vy} & ${vz} \\\\
                    ${Bx} & ${By} & ${Bz}
                    \\end{vmatrix}
                    = [
                    ${vxB4.map(x => x.toExponential(3)).join(', ')}] \\\\[1em]
                    \\vec{F} = q(\\vec{v} \\times \\vec{B}) = (${q}) \\cdot [
                    ${vxB4.map(x => x.toExponential(3)).join(', ')}] = [
                    ${F4.map(x => x.toExponential(3)).join(', ')}]~\\text{N}
                `;
                break;


            case 5: // Movimiento helicoidal
                const v_par = vz;
                const v_perp = Math.sqrt(vx ** 2 + vy ** 2);
                const r5 = m * v_perp / (Math.abs(q) * norm(B));
                const w = Math.abs(q) * norm(B) / m;
                const T5 = 2 * Math.PI / w;
                result = `r = ${r5.toExponential(3)} m, ω = ${w.toExponential(3)} rad/s, T = ${T5.toExponential(3)} s`;
                break;

            case 6: // F conocida, v perpendicular a B
                const v6 = F_input / (Math.abs(q) * norm(B));
                result = `v = ${v6.toExponential(3)} m/s`;
                break;

            case 7: // F = q(E + v x B)
                const vxB7 = cross(v, B);
                const sum = E.map((e, i) => e + vxB7[i]);
                const F7 = sum.map(x => q * x);
                result = `F = [${F7.map(x => x.toExponential(3)).join(', ')}] N`;
                break;

            default:
                result = 'Tipo de ejercicio no válido.';
        }

        document.getElementById('resultado').textContent = result;
        // Mostrar resolución detallada con KaTeX
        document.getElementById('resolucion').innerHTML = '';
        katex.render(steps, document.getElementById('resolucion'), {
            throwOnError: false,
            displayMode: true
        });
        katex.render(resumenLatex, document.getElementById('resultado'), {
            throwOnError: false,
            displayMode: true
        });


    } catch (e) {
        document.getElementById('resultado').textContent = 'Error en los datos ingresados.';
        document.getElementById('resolucion').textContent = '';
        console.error(e);
    }
}
