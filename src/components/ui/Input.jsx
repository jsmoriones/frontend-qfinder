import { forwardRef } from "react";

export const Input = forwardRef((props, ref) => (
  <input
    {...props}
    ref={ref}
    className="border-1 border-grisTarde rounded-lg p-2 text-md outline-0 bg-white w-1/2"
  />
));