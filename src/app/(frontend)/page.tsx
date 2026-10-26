import styles from "./portada.module.css";

export default function Home() {
  return (
    <main className="min-h-screen bg-fondo p-8 font-texto text-texto">
      <div className={`mx-auto max-w-prose ${styles.contenedor}`}>
        <span className={styles.acento} aria-hidden="true" />
        <h1 className="font-titular text-2xl">Grovelab</h1>
        <p className="mt-4">Estamos preparando el nuevo sitio. Vuelve pronto.</p>
      </div>
    </main>
  );
}
