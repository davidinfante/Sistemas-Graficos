# Sistemas-Graficos

## Prácticas de la asignatura Sistemas Gráficos de la rama de Ingeniería del Software en la UGR
## Las prácticas están realizadas en javascript usando la librería three.js y html para que el programa se pueda ejecutar en un navegador


## Método de uso desde Windows

- Abrir la consola de comandos y acceder al directorio en el que se encuentra la práctica.
- Tener instalada la versión de python 3.5 o superior.
- Ejecutar el comando `python -m http.server 8000` en la cmd.
- Abrir un navegador y acceder a [localhost:8000/](http://localhost:8000/). (Se recomienda usar Firefox aunque funciona también en Chrome y Edge).
- Dentro de [localhost:8000/](http://localhost:8000/) navegar hasta la carpeta "grua".


Si se realizan cambios en la práctica, se puede acceder a la nueva versión de la misma recargando la página del navegador.  
Para usar la práctica desde otro sistema operativo, buscar la manera de crear un servidor web en el propio ordenador al que poder conectarse.


## Explicación de los cambios realizados

Los cambios realizados sobre la práctica base son:  
(Los comentarios de código en esta lista son palabras clave para buscar en el código de la práctica y acceder rápidamente a esa sección)

- Añadir otra luz. `New Light`
- Que la luz anterior se pueda encender y apagar con un checkbox. `New Light`
- Cambiarle los colores a la grúa. `Color Crane`
- Añadir un botón que al pulsarlo sitúe la grúa (rotación, distancia y altura) en una posición fija. `Crane Init Position`
- Añadirle texturas a la grúa. `Texture`
- Hacer posible que al añadir cajas, además de desplazarlas por el suelo se puedan rotar al girar la rueda del ratón. `Rotate Box`
- Hacer que si la grúa tiene enganchada una caja y el gancho supera una altura de 20 unidades, la caja se desenganche sola. `Disengage box`
- Hacer que la base de la grúa sea cuadrada en vez de circular. `Box base`
- Hacer que la cuerda de la grúa sea más estrecha. `Thinner string`
- Añadir un botón que permita eliminar cajas de la escena al hacer clic sobre ellas. Se sale de ese modo haciendo clic con el botón derecho. `Deleting Boxes`
