export function Label2({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="text-base text-black mb-1 font-fontPoppins mr-3">
      {children}
    </label>
  );
}