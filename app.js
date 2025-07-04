// Enunciados LaTeX por tipo de ejercicio
const enunciadosLatex = {
    1: `\\textbf{Ejercicio 1 – Movimiento circular} \\\\ 
  \\text{Un electrón con una velocidad de } 3.0 \\times 10^6~\\text{m/s} \\text{ penetra perpendicularmente en un campo magnético uniforme de } 0.01~\\text{T}. \\\\
  \\text{Calcula el radio de la trayectoria circular que describe, así como el período de la misma.} \\\\
  \\text{Usa } q = -1.6 \\times 10^{-19}~\\text{C},\\quad m = 9.11 \\times 10^{-31}~\\text{kg}`,

    2: `\\textbf{Ejercicio 2 – Campo eléctrico, aceleración lineal} \\\\
  \\text{Una partícula con carga } 2.0 \\times 10^{-19}~\\text{C} \\text{ se encuentra inicialmente en reposo en una región con un campo eléctrico uniforme de } 6.0 \\times 10^3~\\text{V/m}. \\\\
  \\text{Calcula la fuerza que actúa sobre la partícula, su aceleración y la velocidad que alcanza después de 2 microsegundos.} \\\\
  \\text{Supón que su masa es } 1.0 \\times 10^{-27}~\\text{kg}`,

    3: `\\textbf{Ejercicio 3 – Campo E y B perpendiculares} \\\\
  \\text{Un protón se mueve en línea recta con velocidad constante donde hay un campo eléctrico } \\vec{E} = 1.5 \\times 10^4~\\text{V/m} \\text{ y un campo magnético } \\vec{B} = 0.01~\\text{T}, \\text{ perpendiculares entre sí.} \\\\
  \\text{Determina la velocidad que debe tener el protón para que la fuerza total sea nula.}`,

    4: `\\textbf{Ejercicio 4 – Producto vectorial completo} \\\\
  \\text{Una partícula con carga } +1.6 \\times 10^{-19}~\\text{C} \\text{ y velocidad } \\vec{v} = (4.0 \\times 10^5)\\hat{i} + (2.0 \\times 10^5)\\hat{j}~\\text{m/s} \\\\
  \\text{se mueve en un campo magnético } \\vec{B} = 0.03\\hat{k}~\\text{T}. Calcula la fuerza magnética vectorial } \\vec{F}_B = q \\vec{v} \\times \\vec{B}`,

    5: `\\textbf{Ejercicio 5 – Movimiento helicoidal} \\\\
  \\text{Una partícula cargada se mueve en un campo magnético uniforme con una velocidad que tiene una componente paralela y otra perpendicular al campo.} \\\\
  \\text{Si } \\vec{v} = 2 \\times 10^6~\\hat{i} + 1 \\times 10^6~\\hat{k}~\\text{m/s} \\text{ y } \\vec{B} = 0.05~\\hat{k}~\\text{T}, \\\\
  \\text{determina el radio de la trayectoria helicoidal, la velocidad angular y el período.}`,

    6: `\\textbf{Ejercicio 6 – Componente desconocida} \\\\
  \\text{Una partícula con carga } q = 1.6 \\times 10^{-19}~\\text{C} \\text{ se mueve con una velocidad desconocida en una región con } B = 0.04~\\text{T}. \\\\
  \\text{Se sabe que la fuerza magnética que experimenta es } 6.4 \\times 10^{-15}~\\text{N} \\text{ y que } \\vec{v} \\perp \\vec{B}. \\\\
  \\text{Determina la magnitud de la velocidad.}`,

    7: `\\textbf{Ejercicio 7 – Fuerza total vectorial} \\\\
  \\text{Una partícula con carga negativa se mueve en una región donde hay un campo eléctrico } \\vec{E} = 5 \\times 10^3~\\hat{i}~\\text{V/m} \\\\
  \\text{y un campo magnético } \\vec{B} = 0.01~\\hat{j}~\\text{T}. \\text{Si su velocidad es } \\vec{v} = 3 \\times 10^5~\\hat{k}~\\text{m/s}, \\\\
  \\text{calcula la fuerza total que actúa sobre la partícula, indicando dirección y sentido.}`
};


// Valores por defecto por ejercicio
const valoresPorEjercicio = {
    1: { q: "-1.6e-19", m: "9.11e-31", vz: "3.0e6", Bz: "0.01" },
    2: { q: "2.0e-19", m: "1.0e-27", Ex: "6.0e3", t: "2.0e-6" },
    3: { Ex: "1.5e4", Bz: "0.01" },
    4: { q: "1.6e-19", vx: "4.0e5", vy: "2.0e5", vz: "0", Bx: "0", By: "0", Bz: "0.03" },
    5: { q: "1.6e-19", m: "9.11e-31", vx: "2.0e6", vy: "0", vz: "1.0e6", Bx: "0", By: "0", Bz: "0.05" },
    6: { q: "1.6e-19", Bx: "0", By: "0", Bz: "0.04", F: "6.4e-15" },

    7: {
        q: "-1.6e-19",
        vx: "0", vy: "0", vz: "3e5", Ex: "5e3",
        Ey: "0", Ez: "0", Bx: "0", By: "0.01", Bz: "0"
    },

    8: ['q', 'm', 'vx', 'vy', 'vz', 'Ex', 'Ey', 'Ez', 'Bx', 'By', 'Bz']

};

// Campos visibles por ejercicio
const camposPorEjercicio = {
    1: ['q', 'm', 'vz', 'Bz'],
    2: ['q', 'm', 't', 'Ex'],
    3: ['Ex', 'Bz'],
    4: ['q', 'vx', 'vy', 'vz', 'Bx', 'By', 'Bz'],
    5: ['q', 'm', 'vx', 'vy', 'vz', 'Bx', 'By', 'Bz'],
    6: ['q', 'Bx', 'By', 'Bz', 'F'],
    7: ['q', 'vx', 'vy', 'vz', 'Ex', 'Ey', 'Ez', 'Bx', 'By', 'Bz']
};

// Renderiza enunciado con KaTeX
function renderEnunciado() {
    const tipo = document.getElementById("tipo").value;
    const enunciadoDiv = document.getElementById("enunciado");
    const enunciadoLatex = enunciadosLatex[tipo];

    if (enunciadoDiv && enunciadoLatex) {
        katex.render(enunciadoLatex, enunciadoDiv, {
            throwOnError: false,
            displayMode: true
        });
    }
}

// Actualiza visibilidad de campos y valores
function actualizarVisibilidadCampos() {
    const tipo = document.getElementById("tipo").value;
    const camposVisibles = camposPorEjercicio[tipo] || [];
    const valoresPorDefecto = valoresPorEjercicio[tipo] || {};

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
            input.value = mostrar && valoresPorDefecto[id] ? valoresPorDefecto[id] : "";
        }
    });

    renderEnunciado();
}

// Ejecutar al cargar DOM y al cambiar selección
document.addEventListener("DOMContentLoaded", () => {
    actualizarVisibilidadCampos();
    document.getElementById("tipo").addEventListener("change", actualizarVisibilidadCampos);
});

// Inicializar:
renderEnunciado(1); // Mostrar ejercicio 1 al inicio


// --------------------------------------------------------------------------------------------------------------------------------------



document.getElementById('tipo').addEventListener('change', actualizarVisibilidadCampos);
window.addEventListener('DOMContentLoaded', actualizarVisibilidadCampos);


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
                const v_perp = Math.sqrt(vx ** 2 + vy ** 2);
                const v_par = vz;
                const B5 = norm([Bx, By, Bz]);

                const r5 = (m * v_perp) / (Math.abs(q) * B5);
                const w5 = (Math.abs(q) * B5) / m;
                const T5 = (2 * Math.PI) / w5;

                resumenLatex = `
                    \\textbf{Resultados del movimiento helicoidal:} \\\\
                    r = ${r5.toExponential(3)}~\\text{m}, \\quad
                    \\omega = ${w5.toExponential(3)}~\\text{rad/s}, \\quad
                    T = ${T5.toExponential(3)}~\\text{s}
                `;

                steps = `
                    \\textbf{Ejercicio 5 – Movimiento helicoidal} \\\\[1em]
                    \\vec{v} = (${vx}, ${vy}, ${vz})~\\text{m/s}, \\quad
                    \\vec{B} = (${Bx}, ${By}, ${Bz})~\\text{T} \\\\[1em]

                    v_\\perp = \\sqrt{v_x^2 + v_y^2} =
                    \\sqrt{(${vx})^2 + (${vy})^2} =
                    ${v_perp.toExponential(3)}~\\text{m/s} \\\\[1em]

                    v_\\parallel = v_z = ${v_par.toExponential(3)}~\\text{m/s} \\\\[1em]

                    r = \\frac{mv_\\perp}{|q|B} =
                    \\frac{${m} \\cdot ${v_perp.toExponential(3)}}{|${q}| \\cdot ${B5}} =
                    ${r5.toExponential(3)}~\\text{m} \\\\[1em]

                    \\omega = \\frac{|q|B}{m} =
                    \\frac{|${q}| \\cdot ${B5}}{${m}} =
                    ${w5.toExponential(3)}~\\text{rad/s} \\\\[1em]

                    T = \\frac{2\\pi}{\\omega} =
                    \\frac{2\\pi}{${w5.toExponential(3)}} =
                    ${T5.toExponential(3)}~\\text{s}
                `;
                break;


            case 6: // F conocida, v perpendicular a B
                const B6 = norm([Bx, By, Bz]); // magnitud de B
                const v6 = F_input / (Math.abs(q) * B6); // v = F / (|q|·B)

                resumenLatex = `
                    \\textbf{Velocidad cuando } \\vec{v} \\perp \\vec{B}: \\\\
                    v = \\frac{F}{|q|B} =
                    \\frac{${F_input}}{|${q}| \\cdot ${B6}} =
                    ${v6.toExponential(3)}~\\text{m/s}
                `;

                steps = `
                    \\textbf{Ejercicio 6 – Componente desconocida} \\\\[1em]
                    \\text{Dado que } \\vec{v} \\perp \\vec{B}, \\text{ la fuerza magnética es:} \\\\
                    F = |q| \\cdot v \\cdot B \\\\[1em]

                    \\Rightarrow v = \\frac{F}{|q|B} =
                    \\frac{${F_input}}{(${Math.abs(q)})(${B6})} =
                    ${v6.toExponential(3)}~\\text{m/s}
                `;

                break;


            case 7: // Fuerza total vectorial
                const vxB = cross(v, B);
                const suma = E.map((e, i) => e + vxB[i]);
                const F7 = suma.map(x => q * x);

                resumenLatex = `
                    \\textbf{Fuerza total sobre la carga:} \\\\
                    \\vec{F} = q (\\vec{E} + \\vec{v} \\times \\vec{B}) =
                    [${F7.map(x => x.toExponential(3)).join(", ")}]~\\text{N}
                `;

                steps = `
                    \\textbf{Ejercicio 7 – Fuerza total vectorial} \\\\[1em]

                    \\vec{v} = (${v[0]}, ${v[1]}, ${v[2]})~\\text{m/s}, \\quad
                    \\vec{E} = (${E[0]}, ${E[1]}, ${E[2]})~\\text{V/m}, \\quad
                    \\vec{B} = (${B[0]}, ${B[1]}, ${B[2]})~\\text{T} \\\\[1em]

                    \\vec{v} \\times \\vec{B} =
                    [${vxB.map(x => x.toExponential(3)).join(", ")}] \\\\[1em]

                    \\vec{E} + \\vec{v} \\times \\vec{B} =
                    [${suma.map(x => x.toExponential(3)).join(", ")}] \\\\[1em]

                    \\vec{F} = q(\\vec{E} + \\vec{v} \\times \\vec{B}) =
                    ${q} \\cdot [${suma.map(x => x.toExponential(3)).join(", ")}] =
                    [${F7.map(x => x.toExponential(3)).join(", ")}]~\\text{N}
                `;
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

// ---------------------------------------------------------------------------------------------

