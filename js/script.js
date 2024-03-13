import { bonus } from './bonificaciones.js';
import { impuestos } from './impuestos.js';

window.openTab =  function openTab(evt, tabName) {
    // Elimina la clase "active" de todos los botones
    let tabButtons = document.getElementsByClassName("tab-buttons")[0].getElementsByTagName("button");
    for (let i = 0; i < tabButtons.length; i++) {
      tabButtons[i].classList.remove("active");
    }
    contentTab(tabName);
    showData(tabName);
    showDeatails(tabName);
    // Muestra el contenido de la pestaña seleccionada
    document.getElementById(tabName).style.display = "block";
    // Añade la clase "active" al botón seleccionado
    evt.currentTarget.classList.add("active");
};


const options = {
    "Calcular por horas": {
        'Nombre': 'text',
        'Apellidos': 'text',
        'Edad': 'number', 
        'Puesto': 'text',
        'Salario por hora': 'number',
        'Horas laboradas':'number', 
        'Horas extras':'number',
    },
    "Calcular por dias": {
        'Nombre': 'text',
        'Apellidos': 'text',
        'Edad': 'number', 
        'Puesto': 'text',
        'Salario por dia': 'number',
        'Dias laborados':'number', 
        'Dias extras':'number',
    },
};

const fecha = new Date();
const fechaActual = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
const horaActual = `${fecha.getHours()}:${fecha.getMinutes()}:${fecha.getSeconds()}`;
const tableData= {};

  
function tabOptions() {
    let principalOption = 'Calcular por horas';
    const tabOption = document.getElementById("tab-buttons");
    let i = 1; // Mover la declaración de i fuera del bucle
    for (const key in options) {
        if(i == 1){
            tabOption.innerHTML += `<button onclick="openTab(event, '${key}')" class="tab-option active">${key}</button>`;
        }else{
            tabOption.innerHTML += `<button onclick="openTab(event, '${key}')" class="tab-option">${key}</button>`;
        }
        tableData[key] = {};
        for (const field in options[key]) {
            tableData[key][field] = [];
        }
        tableData[key]['Bonificaciones'] = [];
        tableData[key]['Impuestos'] = [];
        tableData[key]['Bonos'] = [];
        tableData[key]['Impuesto'] = [];
        tableData[key]['Total'] = [];
        tableData[key]['Total con bono e impuesto'] = [];
        tableData[key]['Fecha'] = [];
        tableData[key]['Hora'] = [];
        i++;
    }
    contentTab(principalOption);
    showData(principalOption);
    showDeatails(principalOption);
};
document.addEventListener("DOMContentLoaded", tabOptions);

function contentTab(tabName) {
    let tabsContent = document.getElementById('tabs');
    tabsContent.innerHTML = ""; // Limpiar el contenido existente

    let content = options[tabName];
    let html = `<form id="form-${tabName}">`; // Agregar el formulario
    html += `<div class='tab active' id='${tabName}'>`;
    html += `<h2>${tabName}</h2>`;
    for (const key in content) {
        const fieldType = content[key];
        if (key === 'Bonos' || key === 'Impuesto' || key === 'Total' || key === 'Total con bono e impuesto' || key === 'Fecha' || key === 'Hora' || key === 'Bonificaciones' || key === 'Impuestos') {
        }else{
            html += `<label>${key}:</label>`;
            html += `<input type="${fieldType}" name="${key}" id="${key}" placeholder="${key}"`; // Agregar el atributo required
            if (fieldType === 'number' && key !== 'Edad') {
                html += `onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.key !== ','" max="99999999" min="0" step="any"`; 
            }else if(fieldType === 'number' && key === 'Edad'){
                html += `onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.key !== ','" max="100" min="18" step="1"`;
            }
            html += ` required/>`
            html += `<br/>`;
        }
        
    }
    html += `<label>Bonificaciones:</label>`;
    html += `<br/>`;
    for (const key in bonus) {
        html += `<label><input type="checkbox" name="Bonificaciones" value="${key}"/>${key}</label><br/>`;
    }
html += `</select><br/>`;
    //borrar datos de los campos
    html += `<button type="reset" id="reset-${tabName}" onclick="document.getElementById('form-${tabName}').reset()">Limpiar</button>`
    html += `<button type="submit" id="submit-${tabName}" disabled>Enviar</button>`; // Botón de enviar deshabilitado por defecto
    html += `</div>`;
    html += `</form>`;
    tabsContent.innerHTML = html;

    // Agregar evento de validación al formulario
    const form = document.getElementById(`form-${tabName}`);
    form.addEventListener('input', () => {
        const inputs = form.querySelectorAll('input');
        const isValid = Array.from(inputs).every(input => input.checkValidity());
        const submitBtn = document.getElementById(`submit-${tabName}`);
        submitBtn.disabled = !isValid;
    });

    // Agregar evento de envío al formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData) {
            data[key] = value;
        }
        // Agregar las bonificaciones seleccionadas
        const bonificacionesSeleccionadas = [];
        document.querySelectorAll(`input[name="Bonificaciones"]:checked`).forEach(item => {
            bonificacionesSeleccionadas.push(item.value);
        });
        data['Bonificaciones'] = bonificacionesSeleccionadas;
        addData(tabName, data);
    });
};


function addData(tabName, data) {
    for (const key in data) {
        if(key === 'Bonificaciones' && data[key].length == 0){
            tableData[tabName][key].push([]);
        }else{
            tableData[tabName][key].push(data[key]);
        }

    }
    tableData[tabName]['Fecha'].push(fechaActual);
    tableData[tabName]['Hora'].push(horaActual);
    const impuestosDisponibles = []
    for(const key in impuestos){
        impuestosDisponibles.push(key);
    };
    tableData[tabName]['Impuestos'].push(impuestosDisponibles);
    let salarioMensualSemanal = 0;
    for(const key in data){
        if(key === 'Salario por hora'){
            salarioMensualSemanal = data['Salario por hora'] * data['Horas laboradas'] + (data['Horas extras'] * data['Salario por hora'] * 2);
        }else if(key === 'Salario por dia'){
            salarioMensualSemanal = (data['Salario por dia'] * data['Dias laborados']) + (data['Dias extras'] * data['Salario por dia'] * 2);
        }
    }
    let bonoMes = 0;
    for(let i = 0; i < data['Bonificaciones'].length; i++){
        const bono = bonus[data['Bonificaciones'][i]] * salarioMensualSemanal;
        bonoMes += bono;
    }
    tableData[tabName]['Bonos'].push(bonoMes.toFixed(2));
    let totalImpuesto = 0;
    let impuesto = 0;
    for(let i = 0; i < impuestosDisponibles.length; i++){
        if(impuestosDisponibles[i] === 'ISPT'){
            for(const key in impuestos[impuestosDisponibles[i]]){
                if(salarioMensualSemanal >= impuestos[impuestosDisponibles[i]][key][0] && salarioMensualSemanal <= impuestos[impuestosDisponibles[i]][key][1]){
                    impuesto = key * salarioMensualSemanal;
                    totalImpuesto += impuesto;
                }
            }
        }else{
            impuesto = impuestos[impuestosDisponibles[i]] * salarioMensualSemanal;
            totalImpuesto += impuesto;
        }
    }
    tableData[tabName]['Impuesto'].push(totalImpuesto.toFixed(2));
    
    const totalPagar = salarioMensualSemanal + bonoMes - totalImpuesto;
    tableData[tabName]['Total'].push(salarioMensualSemanal.toFixed(2));
    tableData[tabName]['Total con bono e impuesto'].push(totalPagar.toFixed(2));
    console.log(tableData[tabName])
    showData(tabName);
    showDeatails(tabName);
};

function showData(tabName) {
    if (tabName === null) {
        document.getElementById('table-content').innerHTML = 'No existe información para mostrar';
    }else{
        const data = tableData[tabName];
        const table = document.getElementById('table-content');
        table.innerHTML = ''; // Limpiar el contenido existente
        let html = `<table border='1' id='${tabName}'>`;
        html += `<tr>`;
        for (const key in data) {
            if(key == 'Bonificaciones' || key == 'Impuestos' || key == 'Hora'){
            }else{
                html += `<th title='${key}'>${key}</th>`;
            }
        }
        html += `<th title='Editar'>Editar</th>`; // Agregar una columna para editar
        html += `<th title='Eliminar'>Eliminar</th>`; // Agregar una columna para eliminar
        html += `</tr>`;
        for (let i = 0; i < data[Object.keys(data)[0]].length; i++) {
            html += `<tr id = '${i}'>`;
            for (const key in data) {
                if(key === 'Bonificaciones' || key === 'Impuestos' || key === 'Hora'){
                }else{
                    html += `<td title='${data[key][i]}'>${data[key][i]}</td>`;
               }
            }
            html += `<td title='Editar registro'><button onclick="editDataModal('${tabName}', ${i})"><img src="/assets/img/editar.png"/></button></td>`; // Botón para editar
            html += `<td title='Eliminar registro'><button onclick="deleteDataModal('${tabName}', ${i})"><img src="/assets/img/eliminar.png"/></button></td>`; // Botón para eliminar
            html += `</tr>`;
        }
        html += `</table>`;
        table.innerHTML = html;
    }
};


window.editData = function editData(tabName, index, data) {
    for (const key in data) {
        tableData[tabName][key][index] = data[key];
    }
    showData(tabName);
    const modal = document.getElementById("modal");
    modal.style.display = "none";
};

window.editDataModal = function editDataModal(tabName, index) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");
    const info = {};
    for (const key in tableData[tabName]) {
        info[key] = tableData[tabName][key][index]; 
    };
    let html = `
    <div class="modal-header">
        <h2>Modificar registro</h2>
        <span><button class="close">&times;</button></span>
        </div>
        <form id='form-editar'>
        <div class="modal-body">
        `;
        for(const key in info){
            if(key === 'Bonificaciones' || key === 'Impuestos' || key === 'Total' || key === 'Total con bono e impuesto' || key === 'Bonos' || key === 'Impuesto' || key === 'Fecha' || key === 'Hora'){
            }else{
                html += `<label>${key}:</label>`;
                if(key === 'Nombre' || key === 'Apellidos' || key === 'Puesto'){
                    html += `<input type="text" name="${key}" id="${key}" value="${info[key]}" required/>`;
                }else if(key === 'Edad'){
                    html += `<input type="number" name="${key}" id="${key}" value="${info[key]}" onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.key !== ','" max="99999999" min="18" step="1" required/>`;
                }else if(key === 'Salario por hora' || key === 'Salario por dia' || key === 'Horas laboradas' || key === 'Horas extras' || key === 'Dias laborados' || key === 'Dias extras'){
                    html += `<input type="number" name="${key}" id="${key}" value="${info[key]}" onkeydown="return event.keyCode !== 69 && event.keyCode !== 189 && event.key !== ','" max="99999999" min="0" step="any" required/>`;
                }
            }
        }

        html += `  <div class='modal-buttons'>
            <button type='submit' id='submit-editar' onclick="editData('${tabName}', ${index})" class='closeResponse'>Guardar</button>
            <button class='closeResponse'>Cancelar</button>
            </div>
        </div>
        </form>
        <div class="modal-footer">
            <h3 id="resultado"></h3>
        </div>
        <div class="modal-header">
        </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "block";

        // Agregar evento de validación al formulario
    const form = document.getElementById(`form-editar`);
    form.addEventListener('input', () => {
        const inputs = form.querySelectorAll('input');
        const isValid = Array.from(inputs).every(input => input.checkValidity());
        const submitBtn = document.getElementById(`submit-editar`);
        submitBtn.disabled = !isValid;
    });

    // Agregar evento de envío al formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const data = {};
        for (const [key, value] of formData) {
            data[key] = value;
        }
        data['Bonificaciones'] = info['Bonificaciones'];
        data['Impuestos'] = info['Impuestos'];
        for(const key in data){
            if(key === 'Salario por hora'){
                data['Total'] = (data['Salario por hora'] * data['Horas laboradas']) + (data['Horas extras'] * data['Salario por hora'] * 2);
            }else if(key === 'Salario por dia'){
                data['Total'] = (data['Salario por dia'] * data['Dias laborados']) + (data['Dias extras'] * data['Salario por dia'] * 2);
            }
        }
        let totalBono = 0;
        for(let i = 0; i < info['Bonificaciones'].length; i++){
            const bono = bonus[info['Bonificaciones'][i]] * data['Total'];
            totalBono += bono;
        }
        data['Bonos'] = totalBono.toFixed(2);
        let totalImpuesto = 0;
        let impuesto = 0;
        for(let i = 0; i < info['Impuestos'].length; i++){
            if(info['Impuestos'][i] === 'ISPT'){
                for(const key in impuestos[info['Impuestos'][i]]){
                    if(data['Total'] >= impuestos[info['Impuestos'][i]][key][0] && data['Total'] <= impuestos[info['Impuestos'][i]][key][1]){
                        impuesto = key * data['Total'];
                        totalImpuesto += impuesto;
                    }
                }
            }else{
                impuesto = impuestos[info['Impuestos'][i]] * data['Total'];
                totalImpuesto += impuesto;
            }
        }
        data['Impuesto'] = totalImpuesto.toFixed(2);
        const totalPagar = data['Total'] + totalBono - totalImpuesto;
        data['Total con bono e impuesto'] = totalPagar.toFixed(2);
        editData(tabName, index, data);
    });
};

window.deleteDataModal = function deleteDataModal(tabName, index) {
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");
    let html = `
    <div class="modal-header">
        <h2>¿Seguro que quieres eliminar este registro?</h2>
        <span><button class="close">&times;</button></span>
        </div>
        <div class="modal-body">
            <div class='modal-buttons'>
            <button onclick="deleteData('${tabName}', ${index})" class='closeResponse'>Sí</button>
            <button class='closeResponse'>No</button>
            </div>
        </div>
        <div class="modal-footer">
            <h3 id="resultado"></h3>
        </div>
        <div class="modal-header">
        </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "block";
};  

window.deleteData = function deleteData(tabName, index) {
    const data = tableData[tabName];
    for (const key in data) {
        data[key].splice(index, 1);
    }
    showData(tabName);
};

window.closeModal = function closeModal(event) {
    let _a;
    if ((event === null || event === void 0 ? void 0 : event.key) === "Escape" ||
        (event instanceof MouseEvent && ((_a = event.target) === null || _a === void 0 ? void 0 : (_a.classList.contains("close") || _a.classList.contains("closeResponse"))))) {
        const modal = document.getElementById("modal");
        modal.style.display = "none";
    }
}

window.showDeatails = function showDeatails(tabName) {
    const table = document.getElementById('table-content');
    const idTable = tabName;
  
    table.addEventListener("click", (e) => {
      if (!e.target.closest) {
        return;
      } else if (!e.target.closest("tr")) {
        return;
      } else if (e.target.closest("tr").id === "") {
        return;
      } else {
        const fila = e.target.closest("tr");
        const td = e.target.closest("td");
  
        // Check if the clicked td is NOT the last or second-to-last
        if (td.cellIndex !== fila.cells.length - 1 && td.cellIndex !== fila.cells.length - 2) {
          const index = fila.id;
          showDetailsModal(idTable, index);
        }
      }
    });
  };
  
window.showDetailsModal = function showDetailsModal(tabName, index) {
    const data = tableData[tabName];
    let infoSalary = {};
    for (const key in data) {
        infoSalary[key] = data[key][index];
    }
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modal-content");
    let html = `
    <div class="modal-header">
        <h2>Detalles/Desglose del registro</h2>
        <span><button class="close">&times;</button></span>
        </div>
        <div class="modal-body">
        `;
        html += `<div class="desglose-content">`
        html += `<div class="izquierda">`;
        for(const key in infoSalary){
            if(key === 'Nombre' || key === 'Apellidos' || key === 'Puesto' ){
                html += `<p>${key}: ${infoSalary[key]}</p>`;
            }else if(key === 'Salario por hora'){
                html += `<p>${key}: $${infoSalary[key]}</p>`;
                html += `<p>Horas laboradas: ${infoSalary['Horas laboradas']} horas</p>`;
                html += `<p>Horas extras: ${infoSalary['Horas extras']} horas</p>`;
                html += `<p>Total horas extras: $${infoSalary['Horas extras'] * 2 * infoSalary[key]}</p>`;
                html += `<p>Total por horas de trabajo: $${infoSalary['Horas laboradas'] * infoSalary[key]}</p>`;
                html += `<p>Total: $${(infoSalary['Total']*1).toFixed(2)}</p>`;
                html += `</div>`;
                html += `<div class="derecha">`;
                html += `<label>Bonos:</label>`;
                for(let i = 0; i < infoSalary['Bonificaciones'].length; i++){
                    html += `<p>${infoSalary['Bonificaciones'][i]}: ${(bonus[infoSalary['Bonificaciones'][i]]*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${((bonus[infoSalary['Bonificaciones'][i]]) * (infoSalary['Total'])).toFixed(2)}</p>`;
                }
                html += `<p>Total bonos: $${(infoSalary['Bonos']*1).toFixed(2)}</p>`;
                html += `</div>`;
                html += `<div class="izquierda">`;
                html += `<label>Impuestos:</label>`;
                for(let i = 0; i < infoSalary['Impuestos'].length; i++){
                    if(infoSalary['Impuestos'][i] === 'ISPT'){
                        for(const key in impuestos[infoSalary['Impuestos'][i]]){
                            if(infoSalary['Total'] >= impuestos[infoSalary['Impuestos'][i]][key][0] && infoSalary['Total'] <= impuestos[infoSalary['Impuestos'][i]][key][1]){
                                html += `<p>${infoSalary['Impuestos'][i]}: ${((key*1)*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${(key * infoSalary['Total']).toFixed(2)}</p>`;
                            }
                        }
                    }else{
                    html += `<p>${infoSalary['Impuestos'][i]}: ${(impuestos[infoSalary['Impuestos'][i]]*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${(impuestos[infoSalary['Impuestos'][i]] * infoSalary['Total']).toFixed(2)}</p>`;
                    }
                }
                html += `<p>Total impuestos: $${(infoSalary['Impuesto']*1).toFixed(2)}</p>`;
                html += `</div>`;
                html += '<div class="izquierda">';
                html += `<p>Total a pagar con impuestos y bonos: $${(infoSalary['Total con bono e impuesto']*1).toFixed(2)}</p>`;
                html += `<p>Fecha insersión: ${infoSalary['Fecha']}</p>`;
                html += `<p>Hora inserción: ${infoSalary['Hora']}</p>`;
                html += `</div>`;
            }else if(key === 'Salario por dia'){
                html += `<p>${key}: $${infoSalary[key]}</p>`;
                html += `<p>Dias laborados: ${infoSalary['Dias laborados']} dias</p>`;
                html += `<p>Dias extras: ${infoSalary['Dias extras']} dias</p>`;
                html += `<p>Total dias extras:</label> $${infoSalary['Dias extras'] * 2 * infoSalary[key]}</p>`;
                html += `<p>Total por dias de trabajo: $${infoSalary['Dias laborados'] * infoSalary[key]}</p>`;
                html += `<p>Total: $${(infoSalary['Total']*1).toFixed(2)}</p>`;
                html += `</div>`;
                html += `<div class="derecha">`;
                html += `<label>Bonos:</label>`;
                for(let i = 0; i < infoSalary['Bonificaciones'].length; i++){
                    html += `<p>${infoSalary['Bonificaciones'][i]}: ${(bonus[infoSalary['Bonificaciones'][i]]*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${((bonus[infoSalary['Bonificaciones'][i]]) * (infoSalary['Total'])).toFixed(2)}</p>`;
                }
                html += `<p>Total bonos: $${(infoSalary['Bonos']*1).toFixed(2)}</p>`;
                html += `</div>`
                html += `<div class="izquierda">`;
                html += `<label>Impuestos:</label>`;
                for(let i = 0; i < infoSalary['Impuestos'].length; i++){
                    if(infoSalary['Impuestos'][i] === 'ISPT'){
                        for(const key in impuestos[infoSalary['Impuestos'][i]]){
                            if(infoSalary['Total'] >= impuestos[infoSalary['Impuestos'][i]][key][0] && infoSalary['Total'] <= impuestos[infoSalary['Impuestos'][i]][key][1]){
                                html += `<p>${infoSalary['Impuestos'][i]}: ${((key*1)*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${(key * infoSalary['Total']).toFixed(2)}</p>`;
                            }
                        }
                    }else{
                    html += `<p>${infoSalary['Impuestos'][i]}: ${(impuestos[infoSalary['Impuestos'][i]]*100).toFixed(2)}% * $${(infoSalary['Total']*1).toFixed(2)} = $${(impuestos[infoSalary['Impuestos'][i]] * infoSalary['Total']).toFixed(2)}</p>`;
                    }
                }
                html += `<p>Total impuestos: $${(infoSalary['Impuesto']*1).toFixed(2)}</p>`;
                html += `</div>`;
                html += `<div class="izquierda">`;
                html += `<p>Total a pagar con impuestos y bonos: $${(infoSalary['Total con bono e impuesto']*1).toFixed(2)}</p>`;
                html += `<p>Fecha inserción: ${infoSalary['Fecha']}</p>`;
                html += `<p>Hora inserción: ${infoSalary['Hora']}</p>`;
                html += `</div>`;
        }
    }
        html += `</div>`;
        html += `<br/>`;
        html += `<button class='closeResponse'>OK</button>`;
        html += `</div>
        <div class="modal-footer">
        </div>
        `;
        modalContent.innerHTML = html;
        modal.style.display = "block";
};

document.addEventListener('DOMContentLoaded', showDeatails);
document.addEventListener("keydown", closeModal);
document.addEventListener("click", closeModal);