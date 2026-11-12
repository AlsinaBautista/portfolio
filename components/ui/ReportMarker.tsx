/** Marcador de "reportado": el cuadrado rojo de las cajas víctima. El rojo se usa solo para esto. */
export default function ReportMarker({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-block h-2.5 w-2.5 bg-victima ${className}`} />;
}
