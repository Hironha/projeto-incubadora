import { forwardRef } from "react";

import { CustomButton, type ButtonStyleType } from "./styles";

import { theme } from "@utils/theme";

import type { TargetAndTransition, MotionProps, Variant } from "framer-motion";
import { Loading, LoadingProps } from "@components/Loading";

interface IButtonProps
	extends MotionProps,
		Omit<
			React.ButtonHTMLAttributes<HTMLButtonElement>,
			"onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart" | "style"
		> {
	loading?: Omit<LoadingProps, 'className'>;
	children?: React.ReactNode;
	styleType?: ButtonStyleType;
	htmlType?: "button" | "submit";
}

export const Button = forwardRef<HTMLButtonElement, IButtonProps>(
	(
		{ loading, children, className, whileHover, htmlType, styleType, disabled, ...motionProps },
		ref
	) => {
		const _whileHover: TargetAndTransition = {
			opacity: 0.75,
			transition: { duration: 0.5 },
		};

		const _variants: { [key in ButtonStyleType]: Variant } = {
			primary: {
				backgroundColor: theme.colors.main,
			},
			secondary: {
				backgroundColor: theme.colors.secondary,
			},
			danger: {
				backgroundColor: theme.colors.danger,
			},
			success: {
				backgroundColor: theme.colors.success,
			},
		};

		return (
			<CustomButton
				layout
				animate={styleType}
				variants={_variants}
				transition={{ duration: 0.3, ease: "easeInOut" }}
				ref={ref}
				className={className}
				type={htmlType || "button"}
				styleType={styleType}
				disabled={disabled}
				whileHover={!disabled ? whileHover || _whileHover : undefined}
				{...motionProps}
			>
				{loading ? (
					<>
						<Loading {...loading} />
						{children}
					</>
				) : (
					children
				)}
			</CustomButton>
		);
	}
);
