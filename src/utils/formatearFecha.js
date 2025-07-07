export const formatearFecha = (fecha) => {
  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];
  const dia = parseInt(fecha.slice(0, 2));
  const mesNum = parseInt(fecha.slice(2, 4)) - 1;
  return `${dia} de ${meses[mesNum]}`;
};
