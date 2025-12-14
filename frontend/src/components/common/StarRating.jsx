export default function StarRating({ value = 0, size = 18 }) {
  const estrellas = Math.round(value * 2) / 2;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        if (estrellas >= i) {
          return (
            <span
              key={i}
              style={{ fontSize: size }}
              className="text-yellow-400"
            >
              ★
            </span>
          );
        } else if (estrellas + 0.5 === i) {
          return (
            <span
              key={i}
              style={{ fontSize: size }}
              className="text-yellow-400"
            >
              ☆
            </span>
          );
        } else {
          return (
            <span
              key={i}
              style={{ fontSize: size }}
              className="text-gray-300"
            >
              ★
            </span>
          );
        }
      })}
      <span className="text-sm text-gray-600 ml-1">
        ({value})
      </span>
    </div>
  );
}