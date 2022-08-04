import { forwardRef } from "react";

import { CustomButton, type ButtonStyleType } from "./styles";

import type { TargetAndTransition, MotionProps } from "framer-motion";

interface IButtonProps
	extends MotionProps,
		Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			"onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "style"
		> {
	children?: React.ReactNode;
	styleType?: ButtonStyleType;
	htmlType?: "button" | "submit";
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
	({ children, className, whileHover, layout, htmlType, ...motionProps }, ref) => {
		const _whileHover: TargetAndTransition = {
			opacity: 0.75,
			transition: { duration: 0.5 },
		};

		return (
			<CustomButton
				layout
				ref={ref}
				className={className}
				type={htmlType || "button"}
				whileHover={whileHover || _whileHover}
				{...motionProps}
			>
				{children}
			</CustomButton>
		);
	}
);
