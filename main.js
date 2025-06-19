function renderEtiqueta(id, latex) {
    katex.render(latex, document.getElementById(id), { throwOnError: false });
}

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