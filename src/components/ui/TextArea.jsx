import { forwardRef } from "react";

export const TextArea = forwardRef((props, ref) => (
  <textarea
    {...props}
    ref={ref}
    className="border-1 border-grisTarde rounded-lg p-2 text-md outline-0 bg-white w-full h-24 resize-none"
  ></textarea>
));