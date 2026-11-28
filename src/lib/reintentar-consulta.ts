/**
 * Reintenta una consulta a la base de datos si falla una vez.
 *
 * Neon (y su pooler) puede cortar una conexión inactiva (`read ECONNRESET`, «Failed query»
 * sin más detalle). El pool descarta esa conexión y el segundo intento abre una nueva, así
 * que casi siempre sale bien. Se usa solo en lecturas livianas e idempotentes que corren en
 * el encabezado de todas las páginas, donde una caída puntual rompía el sitio entero.
 * No registra datos del visitante: solo avisa que reintentó.
 */
export async function reintentarConsulta<T>(
  consulta: () => Promise<T>,
  { intentos = 2, esperaMs = 300 }: { intentos?: number; esperaMs?: number } = {},
): Promise<T> {
  let ultimoError: unknown;
  for (let intento = 1; intento <= intentos; intento += 1) {
    try {
      return await consulta();
    } catch (error) {
      ultimoError = error;
      if (intento < intentos) {
        console.warn(
          `[db] Consulta fallida (intento ${intento} de ${intentos}); se reintenta con una conexión nueva.`,
        );
        await new Promise((resolver) => setTimeout(resolver, esperaMs));
      }
    }
  }
  throw ultimoError;
}
