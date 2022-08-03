import { forwardRef } from "react";
import type { MotionProps } from "framer-motion";

import { CustomButton } from "./styles";

import type { TargetAndTransition } from "framer-motion";
import type { ButtonStyleType } from "./styles";

interface IButtonProps
	extends MotionProps,
		Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			"onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "style"
		> {
	children?: React.ReactNode;
	styleType?: ButtonStyleType;
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
	({ children, className, whileHover, layout, ...motionProps }, ref) => {
		const _whileHover: TargetAndTransition = {
			opacity: 0.75,
			transition: { duration: 0.5 },
		};

		return (
			<CustomButton
				layout
				ref={ref}
				className={className}
				whileHover={whileHover || _whileHover}
				{...motionProps}
			>
				{children}
			</CustomButton>
		);
	}
);
