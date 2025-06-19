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
Dado un enunciado de Física 2 sobre el tema "Fuerza de Lorentz sobre una carga puntual", quiero que analices el texto y extraigas los valores físicos mencionados, asignándolos a los siguientes campos:

* Campo eléctrico: Ex, Ey, Ez
* Campo magnético: Bx, By, Bz
* Velocidad: vx, vy, vz
* Carga: q
* Masa: m
* Tiempo: t
* Fuerza: F (si se menciona)

Si algún valor no está presente en el enunciado, coloca un cero o un valor simbólico (por ejemplo, "no se menciona" o "0.0").

Ejemplo de salida esperada (solo esto) no quiero que pongas markdown:

Ex: 0
Ey: 0
Ez: 0
Bx: 0
By: 0
Bz: 0.02
vx: 3e5
vy: 0
vz: 0
q: -1.6e-19
m: no se menciona
t: no se menciona
F: no se menciona

Solo quiero los datos extraídos, organizados por campo. No hagas cálculos, solo la extracción de datos del enunciado.

---

Enunciado: ${enunciadoUsuario}
`;

    const res = await fetch('http://127.0.0.1:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'deepseek-r1',
            prompt: prompt,
            stream: true
        })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let textoCompleto = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textoCompleto += decoder.decode(value);
    }

    console.log('Respuesta del modelo:\n' + textoCompleto);
}
