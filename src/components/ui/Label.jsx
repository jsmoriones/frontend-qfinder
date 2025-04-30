export function Label({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-base text-grisMasTarde mb-1">
      {children}
    </label>
  );
}