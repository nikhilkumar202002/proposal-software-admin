export const DocumentWatermark = ({
  enabled = false,
  text = 'DRAFT',
  type = 'text', // 'text' | 'image'
  imageSrc,
  opacity = 0.08,
  angle = -45, // degrees
  fontSize = '72px',
  color = '#000000',
  className = '',
}) => {
  if (!enabled || (!text && !imageSrc)) return null

  return (
    <div
      className={`absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <div
        style={{
          transform: `rotate(${angle}deg)`,
          opacity,
          color,
        }}
        className="flex items-center justify-center text-center font-black tracking-widest uppercase transition-opacity"
      >
        {type === 'image' && imageSrc ? (
          <img
            src={imageSrc}
            alt="Watermark"
            className="max-w-[70%] max-h-[70%] object-contain"
          />
        ) : (
          <span
            style={{ fontSize }}
            className="leading-none whitespace-nowrap font-sans font-bold"
          >
            {text}
          </span>
        )}
      </div>
    </div>
  )
}

export default DocumentWatermark
