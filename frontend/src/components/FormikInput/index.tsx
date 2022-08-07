import React, { useState } from "react";
import { useField, ErrorMessage } from "formik";
import { AnimatePresence, LayoutGroup, type Variants } from "framer-motion";

import { DataInput, Container, CustomErrorMessage, Label, InputContainer } from "./styles";

import { theme } from "@utils/theme";

enum InputVariants {
	FOCUS = "focus",
	VALID = "valid",
	INVALID = "invalid",
	DEFAULT = "default",
}

type FormikInputProps = {
	name: string;
	id?: string;
	valueTrigger?: "onChange" | "onBlur";
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void | Promise<void>;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void | Promise<void>;
	onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void | Promise<void>;
	label: React.ReactNode;
};

export const FormikInput = ({
	id,
	label,
	name,
	onChange,
	onBlur,
	onFocus,
	valueTrigger = "onBlur",
}: FormikInputProps) => {
	const [input, meta, helpers] = useField(name);
	const [focused, setFocused] = useState(false);

	const inputID = id || name;

	const inputVariants: Variants = {
		[InputVariants.FOCUS]: { border: `2px ${theme.colors.main} solid` },
		[InputVariants.VALID]: { border: `2px ${theme.colors.success}  solid` },
		[InputVariants.INVALID]: { border: `2px ${theme.colors.danger}  solid` },
		[InputVariants.DEFAULT]: { border: `2px ${theme.colors.gray} solid` },
	};

	const getOnChangeInputVariant = () => {
		if (meta.error && meta.touched) return InputVariants.INVALID;
		if (focused) return InputVariants.FOCUS;
		if (input.value) return InputVariants.VALID;
		return InputVariants.DEFAULT;
	};

	const getOnBlurInputVariant = () => {
		if (focused) return InputVariants.FOCUS;
		if (meta.error && meta.touched) return InputVariants.INVALID;
		if (input.value) return InputVariants.VALID;
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		valueTrigger === "onChange" && input.onChange(event);
		onChange && onChange(event);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		setFocused(true);
		onFocus && onFocus(event);
	};

	const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
		setFocused(false);
		input.onBlur(event);
		if (valueTrigger === "onBlur") {
			input.onChange(event);
		}

		onBlur && onBlur(event);
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
						id={inputID}
						onChange={handleChange}
						onBlur={handleBlur}
						onFocus={handleFocus}
					/>
				</InputContainer>

				<AnimatePresence presenceAffectsLayout>
					<ErrorMessage
						children={error => (
							<CustomErrorMessage
								layout="position"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
							>
								{error}
							</CustomErrorMessage>
						)}
						name={name}
					/>
				</AnimatePresence>
			</LayoutGroup>
		</Container>
	);
};
