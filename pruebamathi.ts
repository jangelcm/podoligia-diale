//console.log('si funciona:', calcularSumaDeDosNumeros(3000, 876));
// console.log(
//   'La resta entre el número 1221 y 666 es:',
//   calcularRestaDeDosNumeros(1221, 666)
// );

function calcularSumaDeDosNumeros(numero1: number, numero2: number): number {
  const totalSuma = numero1 + numero2;

  return totalSuma;
}

function calcularRestaDeDosNumeros(numero1: number, numero2: number): number {
  const resultado = numero1 - numero2;
  return resultado;
}

/*
Necesitamos un programa que sea una calculadora básica.
Y que pueda obtener resultados de suma, resta, división y multiplicación.
Dada la operación que se seleccione, y números digitados

Salida:

- Dado el número {variable1} y número {variable2} la operación {variableOperacion}, da como resultado {variableResultado}
- Dado el número 10 y el número 2 la operación División, da como resultado: 5

*/

// Dos tipos de variables
// string - cadenas -> palabras, palabras con numeros, vocales, letras , etc ,etc,*-*/-*''00976754534w
// number - numerico -> 123456789 1.263.6985

// boolean - true o false

// console.log(
//   calculadoraBasica({ operador: 'division', numero1: 3241, numero2: 23 }),

//   calculadoraBasica({ operador: 'multiplicación', numero1: 3, numero2: 3 })
// );

interface Personaje {
  nombre: string;
  dañoGolpe: number;
  ataqueEspecial: string;
  vida: number;
}

console.log(
  generarGanador(
    {
      nombre: 'pinocho',
      ataqueEspecial: 'narizaso',
      dañoGolpe: 20,
      vida: 60,
    } as Personaje,
    {
      nombre: 'MICKEY MOUSE',
      ataqueEspecial: 'mouseque herramienta',
      dañoGolpe: 3,
      vida: 160,
    } as Personaje
  )
);

function generarGanador(pj1: Personaje, pj2: Personaje) {
  let ganador = '';

  let vidaMickey = pj2.vida;
  let vidaPinocho = pj1.vida;

  pj1.vida = vidaPinocho;

  for (let i = 0; i <= 9; i++) {
    vidaMickey = pj2.vida - pj1.dañoGolpe;
    pj2.vida = vidaMickey;

    vidaPinocho = pj1.vida - pj2.dañoGolpe;
    pj1.vida = vidaPinocho;
    // return pj2;
  }

  if (vidaMickey <= 0 && vidaPinocho >= 1) {
    ganador = pj1.nombre;
  }

  if (vidaPinocho <= 0 && vidaMickey >= 1) {
    ganador = pj1.nombre;
  }
}

function calculadoraBasica(prop: {
  operador: string;
  numero1: number;
  numero2: number;
}): string {
  let resultado = 0;

  if (prop.operador === 'resta') {
    resultado = prop.numero1 - prop.numero2;
  }

  if (prop.operador === 'suma') {
    resultado = prop.numero1 + prop.numero2;
  }

  if (prop.operador === 'multiplicación') {
    resultado = prop.numero1 * prop.numero2;
  }

  if (prop.operador === 'division') {
    resultado = prop.numero1 / prop.numero2;
  }

  return (
    'Dado el número ' +
    prop.numero1 +
    ' y el número ' +
    prop.numero2 +
    ' , con la operación: ' +
    prop.operador +
    '. da como resultado: ' +
    resultado +
    '\n'
  );
}
