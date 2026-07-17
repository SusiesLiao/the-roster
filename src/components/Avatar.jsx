export default function Avatar({ initial = 'A', size = 56, variant = '' }) {
  return (
    <div
      className={`avatar ${variant}`}
      style={{ width: size, height: size, fontSize: size * 0.46 }}
      aria-hidden="true"
    >
      {initial}
    </div>
  )
}
