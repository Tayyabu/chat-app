import { ComponentProps } from "react";
import { cn } from "../lib/utils";

type ButtonProps = ComponentProps<"button">;
function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "bg-green-500 px-3 py-2 cursor-pointer disabled:bg-green-400 hover:bg-green-400 rounded-xl transition-all hover:rounded-md disabled:hover:rounded-xl disabled:cursor-default font-bold text-white ",
        props.className
      )}
    />
  );
}
export default Button;
