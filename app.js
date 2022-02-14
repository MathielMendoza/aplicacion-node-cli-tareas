require('colors');

const {
    inquirerMenu,
    pausa,
    leerInput, listadoTareasBorrar, confirmar, mostrarListadoCheckList
} = require("./src/helpers/inquirer");
const Tareas = require("./src/models/tareas");
const {guardarDB, leerDB} = require("./src/helpers/guardarArchivo");

const main = async () => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if (tareasDB) { //Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }

    do {
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea(desc);
                break;
            case '2':
                tareas.listadoCompleto();
                break;
            case '3':
                tareas.listarEstado(true);
                break;
            case '4':
                tareas.listarEstado(false);
                break;
            case '5':
                const ids = await mostrarListadoCheckList(tareas.listadoAr);
                tareas.toggleCompletadas(ids);
                break;
            case '6'://Borrar
                const id = await listadoTareasBorrar(tareas.listadoAr);
                if (id !== '0') {
                    const ok = await confirmar('¿Está seguro?')
                    if (ok) {
                        tareas.borrarTarea(id);
                        console.log('\nTarea borrada'.green);
                    }
                }
                break;
        }

        guardarDB(tareas.listadoAr);

        await pausa();
    } while (opt !== '0');
}

main();