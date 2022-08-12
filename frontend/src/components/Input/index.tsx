import React, { forwardRef, useState } from "react";
import { AnimatePresence, LayoutGroup, type Variants, HTMLMotionProps } from "framer-motion";

import { DataInput, Container, CustomErrorMessage, Label, InputContainer } from "./styles";

import { theme } from "@utils/theme";
import type { FieldMeta } from "@components/Form/components/Item";

enum InputVariants {
	FOCUS = "focus",
	VALID = "valid",
	INVALID = "invalid",
	DEFAULT = "default",
}

interface IInputProps extends Omit<HTMLMotionProps<"input">, "type"> {
	name: string;
	placeholder?: string;
	label: React.ReactNode;
	meta: FieldMeta;
	id?: string;
	type: "text" | "password";
	valueTrigger?: "onChange" | "onBlur";
}

export const Input = forwardRef<HTMLInputElement, IInputProps>(
	(
		{
			id,
			label,
			meta,
			name,
			placeholder,
			onBlur,
			onFocus,
			valueTrigger = "onBlur",
			type = "text",
			...inputProps
		},
		inputRef
	) => {
		const [focused, setFocused] = useState(false);

		const inputID = id || name;

		const showError = !!meta.error && meta.touched;

		const inputVariants: Variants = {
			[InputVariants.FOCUS]: { border: `2px ${theme.colors.main} solid` },
			[InputVariants.VALID]: { border: `2px ${theme.colors.success}  solid` },
			[InputVariants.INVALID]: { border: `2px ${theme.colors.danger}  solid` },
			[InputVariants.DEFAULT]: { border: `2px ${theme.colors.gray} solid` },
		};

		const getOnChangeInputVariant = () => {
			if (meta.error && meta.touched) return InputVariants.INVALID;
			if (focused) return InputVariants.FOCUS;
			if (meta.value) return InputVariants.VALID;
			return InputVariants.DEFAULT;
		};

		const getOnBlurInputVariant = () => {
			if (focused) return InputVariants.FOCUS;
			if (meta.error && meta.touched) return InputVariants.INVALID;
			if (meta.value) return InputVariants.VALID;
			return InputVariants.DEFAULT;
		};

		const inputVariant = (() => {
			const variantGetters: { [key in typeof valueTrigger]: () => InputVariants } = {
				onBlur: getOnBlurInputVariant,
				onChange: getOnChangeInputVariant,
			};
			const getVariant = variantGetters[valueTrigger];

			return getVariant();
		})();

		const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			setFocused(false);
			onBlur && onBlur(event);
		};

		const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			setFocused(true);
			onFocus && onFocus(event);
		};

		return (
			<Container layout>
				<LayoutGroup id={`layout-${name}`}>
					<Label layout="position" htmlFor={inputID}>
						{label}
					</Label>
					<InputContainer
						layout="position"
						initial="default"
						animate={inputVariant}
						transition={{ duration: 0.3 }}
						variants={inputVariants}
					>
						<DataInput
							{...inputProps}
							ref={inputRef}
							id={inputID}
							value={meta.value}
							placeholder={placeholder}
							onBlur={handleBlur}
							onFocus={handleFocus}
							type={type}
						/>
					</InputContainer>

					<AnimatePresence presenceAffectsLayout>
						{showError && (
							<CustomErrorMessage
								layout="position"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{meta.error}
							</CustomErrorMessage>
						)}
					</AnimatePresence>
				</LayoutGroup>
			</Container>
		);
	}
);
