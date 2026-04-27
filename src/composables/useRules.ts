export function useRules() {
  const required = (v: string) => !!v || 'Este campo es obligatorio'
  // Puedes agregar más reglas aquí si lo deseas
  return { required }
}
