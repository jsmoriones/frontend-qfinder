import { forwardRef } from "react";

export const ButtonLarge = forwardRef((props, ref) => (
  <button
    {...props}
    ref={ref}
    className='cursor-pointer bg-[#505ABB] text-white text-lg px-2 w-2/5 py-3 rounded-4xl'>
        {props.text}
    </button>
));