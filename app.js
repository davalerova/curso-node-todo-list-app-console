require('colors');

const { guardarDB, leerDB } = require('./helpers/databaseFunctions');
const {
  inquirerMenu,
  pausa,
  leerInput,
  listadoTareasBorrar,
  confirmar,
  mostrarListadoChecklist,
} = require('./helpers/inquirer');
const Tarea = require('./models/tarea');
const Tareas = require('./models/tareas');

console.clear();
const main = async () => {
  let opt = '';
  const tareas = new Tareas();

  const tareasDB = leerDB();

  if (tareasDB) {
    // Establecer tareas
    tareas.cargarTareasFromArray(tareasDB);
  }

  //await pausa();

  do {
    // Imprimir el menú
    opt = await inquirerMenu();

    switch (opt) {
      case '1':
        // Crear tarea
        const desc = await leerInput('Descripción: ');
        tareas.crearTarea(desc);
        // console.log(desc);
        break;
      case '2':
        // Listar tareas
        tareas.listarTareas();
        break;
      case '3':
        // Listar tareas
        tareas.listarPendientesCompletadas(true);
        break;
      case '4':
        // Listar tareas
        tareas.listarPendientesCompletadas(false);
        break;
      case '5':
        // Completar tareas
        const ids = await mostrarListadoChecklist(tareas.listadoArr);
        tareas.toggleCompletadas(ids);
        break;
      case '6':
        // Borrar tareas
        const id = await listadoTareasBorrar(tareas.listadoArr);
        if (id !== '0') {
          const ok = await confirmar('¿Está seguro?');
          if (ok) {
            tareas.borrarTarea(id);
            console.log('Tarea borrada correctamente');
          }
        }
        break;
      default:
        break;
    }
    // console.log({ opt });
    guardarDB(tareas.listadoArr);
    await pausa();
  } while (opt !== '0');
};

main();
