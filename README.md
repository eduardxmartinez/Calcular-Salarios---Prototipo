# Documentación calculadora de salarios
Este software permite conocer el salario de un trabajador en base a sus horas o días trabajadas, genera una nomina y puede incluir distintos tipos de bonos. 

Se encuentran dos pestañas en la parte superior
Calcular por horas: calcula tu salario en base a las horas trabajadas
Calcular por día: calcula tu salario en base a los días trabajados

Se selecciona una de las dos pestañas antes de comenzar a llenar los campos. Una vez seleccionada una pestaña se encuentran los campos a llenar del lado izquierdo.  En orden el listado de campos:

**Nombre:** campo de tipo texto donde se ingresa el nombre del trabajador.

**Apellidos:** campo de tipo texto donde se ingresa el apellido del trabajador. 

**Edad:** campo de tipo numérico donde se ingresa la edad del trabajador, sólo permite números enteros del 18 en adelante.

**Puesto:** campo de tipo texto donde se ingresa el nombre del puesto del trabajador. 

**Salario por hora/día:** campo de tipo numérico donde se ingresa el pago por hora/día del trabajador, sólo permite números mayores o iguales 0.

**Horas/días laboradas:** campo de tipo numérico donde se ingresa el numero de horas/días trabajadas por el trabajador, sólo permite números mayores o iguales 0.

**Horas/días extras:** campo de tipo numérico donde se ingresa el numero de horas/días extras trabajadas por el trabajador, sólo permite números mayores o iguales 0.


Los campos se muestran con un color rojo si se ingresa un valor inválido y verde cuando se ingresa un valor válido. Al tener todos los campos en verde, se habilita el botón para enviar los datos y generar una nomina. 

Se pueden seleccionar distintos tipos de bonificaciones si así se desea, en caso de que el trabajador haya cumplido con estos. 

Al hacer click en el botón enviar se genera una lista del lado derecho con los datos enviados. Al dar click en eliminar se elimina de la lista. Al dar click en editar se muestra una ventana para editar los datos. Se muestran dos botones en la parte inferior, guardar en caso de querer guardar los cambios y cancelar en caso de no querer hacer ningún cambio.

Al dar click en cualquier dato de algún registro se muestra el desglose del salario y se encuentra un botón en la parte inferior para salir y en la esquina superior derecha se encuentra otro botón para salir.

# Funcionamiento
Nuesro propósito fue crear lo mas similar a un generador de nominas, incluyendo un listado de todos los registros generados con posibilidad de edición. Por esto decidimos incluir un formulario con distintos tipos de datos, los campos admiten números o letras según su tipo, cada uno de estos funciona correctamente. Hicimos pruebas unitarias y de integración para verificar que sólo se admitieran valores válidos para este caso. En caso de querer ingresar un valor erroneo no es posible enviar el formulario. Decidimos mostrar de manera visual esto al mostrar de color rojo los campos con valores inválidos y en verde con valores válidos. 

Nuestra referencia de funcionamiento es que se puedan ingresar valores en un formulario y al momento de enviar se genera una nomina en base a los datos, lo cual funciona. En los campos que son de tipo númerico implementamos funciones para no admitir ningún tipo de letra o caracteres que no sean números. En el de edad sólo se admiten números enteros mayores a 18 ya que ésta es la edad a la que legalmente se puede empezar a trabajar. En el de horas trabajadas sólo se admiten números mayores a 0 ya que no se pueden trabajar horas negativas y lo mismo con las horas extras. 

Se tiene la opcioón de editar un registro en caso de que haya habido un error al enviar el formulario este pueda ser corregido. Se tienen opciones de bonos en caso de que sea necesario otorgar alguno. Se tiene la opción de eliminar registro en caso de que ya no se quiera tener guardado este. 
