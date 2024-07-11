# TpClinicaLaboiv

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.2.

Clinica Fernández es un proyecto academico donde usuarios pueden tener distintos roles, dependiendo de sus roles pueden realizar diferentes acciones que vamos a ver a continuacion

## Bienvenida

Esta es la parte que ve el usuario al entrar a la web una pagina de bienvendida donde podra elegir entrar como paciente o especialista, y asi mismo registrarse si asi lo desea.
![image](https://github.com/user-attachments/assets/20885e4c-6e55-4ff7-8c29-0c1c828b3bd0)


## Login

Esta seccion es para todos igual, donde tendremos botones de accesos rapidos, pero a la vez podremos ingresar nuestros datos en caso de querramos entrar a la clinica

![image](https://github.com/user-attachments/assets/300e1d7b-6084-4e97-a15a-61cd9bf9bb33)


## Registro paciente

En esta seccion un paciente podra ingresar sus datos los cuales van a ser validados, para posteriormente registrarse

![image](https://github.com/user-attachments/assets/e54ae0b2-1ae2-4330-b572-66c5dd62a92b)


## Registro especialista

Esta parte es muy parecida a la anterior, su diferencia es que en este registro unicamente los especialistas podran hacerlo, donde posteriormente van a tener que ser validados por un admin

![image](https://github.com/user-attachments/assets/f4025d2a-dbd6-4345-a645-7d1cfaffae19)


## Home

En el home no vamos a poder ver mas que un menu, para dirigirte hacias las demas rutas
Cada usuario tiene un navbar con rutas distintas

En caso del administrador:

![image](https://github.com/user-attachments/assets/8eda916b-1c07-4f8d-9333-3100a521296e)

En caso del especialista:

![image](https://github.com/user-attachments/assets/2e366fdc-fc59-4fb8-a9f5-bd22a04332e2)

En caso del paciente: 

![image](https://github.com/user-attachments/assets/cd6895ef-8778-46d4-ab9f-583b027bffb1)

## Perfil

En esta seccion tanto el paciente como el especialista van a poder ver sus datos, la unica diferencia entre ellos es que el especialista puede asignar sus horarios y el paciente puede ver su historial clinico

En caso del paciente:

![image](https://github.com/user-attachments/assets/de22e245-4966-4bd8-9000-4417a380e3aa)

Si presiona el boton de ver historial:

![image](https://github.com/user-attachments/assets/e307ccce-4432-434a-b968-a619beab0a55)


En caso del especialista:

![image](https://github.com/user-attachments/assets/e22e8bc5-a48c-4ca8-926f-674f695c239f)

Cuando el especialista quiere seleccionar sus horarios veria lo siguiente:

![image](https://github.com/user-attachments/assets/a8c9c615-d83f-441a-bc62-bbbfb468ba7f)

## Mis turnos

En esta seccion los usuarios podran ver sus turnos, en que estado estan, se podran visualizar botones para realizar distintas acciones

En caso de los especialistas:

![image](https://github.com/user-attachments/assets/6825588d-d5aa-4443-9f84-8c300bb52fb7)

En caso de los pacientes:

![image](https://github.com/user-attachments/assets/5360e76d-5895-4221-b130-c77b50a4d6a8)

## Solicitar turnos

En esta seccion el paciente y el administrador van a poder solicitar un turno.
Esta seccion consta en etapas de eleccion sea del especialista, la especialidad y el dia con el horario.

En caso del paciente:

Primer paso, eleccion del especialista:

![image](https://github.com/user-attachments/assets/5e15e18f-1c1e-4b0b-8244-f981eaca5a5c)

Segundo paso, eleccion de la especialidad:

![image](https://github.com/user-attachments/assets/d5a9b5c7-2a90-4c5c-baa4-c141229af5cf)

Como se puede ver en el segundo paso hay distintas especialidades con sus imagenes representativas, en caso que no tenga como lo es humomologia, aparece esa por defecto.

Tercer paso, eleccion de dia:

![image](https://github.com/user-attachments/assets/ab97a37c-6e2a-4f4c-ab2b-89fa87a720f4)

En esta imagen podemos ver como en este caso en particular, el/la especialista no tiene horarios cargados previamente, ya que nunca asigno sus horarios.

![image](https://github.com/user-attachments/assets/73440e5c-5fb3-4398-8152-edaddde4cca8)

En este caso, se pueden ver los dias disponibles del especialista

![image](https://github.com/user-attachments/assets/18e8f173-ca35-4440-a2ee-b50dace7d812)

Una vez seleccionado el dia, podremos elegir la hora que querramos para nuestra atencion, pero si este especialista ya tiene un turno en ese horario, independientemente de su estado, ese turno no va a estar disponible

En caso del administrador:

![image](https://github.com/user-attachments/assets/95b3f21d-8157-4c06-9f2b-09241820c877)

En este caso lo unico que cambia comparado al del paciente es que primero se va a tener que elegir al paciente al cual queremos solicitarle un turno.


## Usuarios

Esta seccion es unicamente para el administrador donde va a poder realizar diferentes acciones con los usuarios en base la necesidad 

![image](https://github.com/user-attachments/assets/7fba2f30-b867-4189-beeb-17ddf776fd19)

En este apartado va a tener la visibilidad de todos los especialistas registrado, con sus datos y con un boton para poder habilitar o deshabilitar su ingreso.

![image](https://github.com/user-attachments/assets/0d0b17e5-f720-4d37-93b7-4bfc7664f799)

En esta imagen se hacen visible los pacientes, donde tambien tendremos una tabla con sus datos, pero en diferencia a la imagen anterior, se podran ver sus historias clinicas.

![image](https://github.com/user-attachments/assets/605e366a-2dd4-4693-9268-70a94348162f)

En esta imagen el admin podra ver sus colegas, con sus respectivos datos.

![image](https://github.com/user-attachments/assets/6fb20de9-9f91-44fe-8095-edc2a5b96c7a)


En esta imagen podemos ver como seria el registro de un administrador.

![image](https://github.com/user-attachments/assets/8e5cfd3c-d9a0-4a79-9d65-fb868ecb5875)

En esta imagen se podra visualizar a todos los usuarios, donde al clickear la imagen, se descargara un excel con la informacion sobre que turnos tomo y con quien.

## Estadisticas

En esta seccion podremos ver todas las estadisticas e informes de la clinica, ya sean:
. Log de usuarios
. Cantidad de turnos por dia
. Cantidad de turnos solicitados por medico en un lapso de tiempo
. Cantidad de turnos finalizados por medico en un lapso de tiempo
. Cantidad de turnos por especialidad

Log de usuarios:

![image](https://github.com/user-attachments/assets/c8a3686f-05d9-43d9-bba2-731e35c547aa)

Cantidad de turnos solicitados por medico en un lapso de tiempo:

![image](https://github.com/user-attachments/assets/0054b363-1a7f-4d7d-bfa0-aa9705e4d7e8)

![image](https://github.com/user-attachments/assets/84ecb7d4-1f04-4fd9-9704-2e3427720872)

Cantidad de turnos finalizados por medico en un lapso de tiempo:

![image](https://github.com/user-attachments/assets/9a60404e-b20a-4a25-9c28-c988c14695f0)

![image](https://github.com/user-attachments/assets/7ecd5898-ae41-41a2-a898-fd29be2e7923)

Cantidad de turnos por especialidad:

![image](https://github.com/user-attachments/assets/dc4ec94c-f54d-4b27-a606-9a41bb365bdc)


## Turnos

Esta seccion tambien la podra ver unicamente el administrador, viendo todos los turnos de la clinica o filtrandolos por lo que desee.

![image](https://github.com/user-attachments/assets/a6faf67e-fd99-418a-9dd4-0d3b60bc9392)


## Pacientes

En esta seccion el especialista podra ver sus pacientes y sus historias clinicas

![image](https://github.com/user-attachments/assets/d0c41eee-6b8e-4e47-9547-2d1e07e4d7ca)


![image](https://github.com/user-attachments/assets/a31ea777-f855-46d5-ad84-89d3ef85ca69)


