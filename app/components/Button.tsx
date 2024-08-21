import { FC, forwardRef } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export const Button: FC<ButtonProps> = forwardRef<HTMLButtonElement, ButtonProps>(({ children, className, type = "button", ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        "bg-blue-500 text-white w-fit text-base font-medium px-12 py-4 rounded-[16px] items-center justify-center gap-1 flex transition-all",
        "hover:bg-blue-600",
        "disabled:bg-gray-400 disabled:cursor-not-allowed",
        className
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";
