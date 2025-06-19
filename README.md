<!-- cloudflared tunnel --url http://192.168.1.13:8000 -->

ollama run llama3.3

Fuerza de lorentz sobre una carga puntual|

---

| Tipo              | Componentes     | Cantidad |
| ----------------- | --------------- | -------- |
| Campo eléctrico   | $E_x, E_y, E_z$ | 3        |
| Campo magnético   | $B_x, B_y, B_z$ | 3        |
| Velocidad         | $v_x, v_y, v_z$ | 3        |
| Carga             | $q$             | 1        |
| Masa              | $m$             | 1        |
| Tiempo            | $t$             | 1        |
| Fuerza (opcional) | $F$             | 1        |

---

| Categoría           | Campos incluidos |
| ------------------- | ---------------- |
| **Carga y masa**    | `q`, `m`         |
| **Velocidad**       | `vx`, `vy`, `vz` |
| **Campo eléctrico** | `Ex`, `Ey`, `Ez` |
| **Campo magnético** | `Bx`, `By`, `Bz` |
| **Tiempo**          | `t`              |
| **Fuerza conocida** | `F`              |

---

### 📘 **Símbolos y su significado**

| Símbolo                                             | Nombre                             | Unidad (SI)          | Descripción breve                                                                            |
| --------------------------------------------------- | ---------------------------------- | -------------------- | -------------------------------------------------------------------------------------------- |
| **$\vec{F}$**                                       | Fuerza de Lorentz                  | Newtons (N)          | Fuerza total ejercida sobre una carga por campos eléctrico y magnético.                      |
| **$q$**                                             | Carga eléctrica                    | Coulombs (C)         | Valor de la carga puntual que experimenta la fuerza.                                         |
| **$\vec{E}$**                                       | Campo eléctrico                    | Voltio/metro (V/m)   | Campo que ejerce fuerza sobre cargas eléctricas, independiente de su movimiento.             |
| **$\vec{B}$**                                       | Campo magnético                    | Tesla (T)            | Campo que ejerce fuerza sobre cargas en movimiento.                                          |
| **$\vec{v}$**                                       | Velocidad de la carga              | metros/segundo (m/s) | Velocidad con la que se mueve la carga en el campo magnético.                                |
| **$\times$**                                        | Producto vectorial                 | —                    | Indica una dirección perpendicular al plano de los vectores involucrados.                    |
| **$\vec{F} = q(\vec{E} + \vec{v} \times \vec{B})$** | Ley de Lorentz                     | Newtons (N)          | Ecuación que describe la fuerza total sobre una carga en presencia de $\vec{E}$ y $\vec{B}$. |
| **$\theta$**                                        | Ángulo entre $\vec{v}$ y $\vec{B}$ | radianes (rad)       | Útil cuando se aplica la forma escalar de la ley de Lorentz: $F = qvB\sin\theta$.            |

---

### 📌 Notas adicionales

* Cuando **solo hay campo magnético**, la fuerza es:

  $$
  \vec{F}_B = q(\vec{v} \times \vec{B})
  $$

* Cuando **solo hay campo eléctrico**, la fuerza es:

  $$
  \vec{F}_E = q\vec{E}
  $$

* El signo de la carga $q$ (positivo o negativo) **afecta la dirección** de la fuerza.
