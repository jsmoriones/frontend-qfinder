export function Label({ props, htmlFor, children }) {
  return (
    <label {...props} htmlFor={htmlFor} className="text-base text-grisMasTarde mb-1">
      {children}
    </label>
  );
}