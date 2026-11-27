/**
 * Deja solo dígitos, con código de país. Un celular peruano de 9 dígitos que
 * empieza en 9 recibe el prefijo 51. Devuelve `null` si no parece un número válido
 * (menos de 9 o más de 15 dígitos, según E.164).
 */
export function normalizarWhatsapp(
  valor: string | null | undefined,
): string | null {
  if (!valor) {
    return null;
  }
  let digitos = valor.replace(/\D/g, "");
  if (digitos.startsWith("00")) {
    digitos = digitos.slice(2);
  }
  if (digitos.length === 9 && digitos.startsWith("9")) {
    digitos = `51${digitos}`;
  }
  if (digitos.length < 9 || digitos.length > 15) {
    return null;
  }
  return digitos;
}
