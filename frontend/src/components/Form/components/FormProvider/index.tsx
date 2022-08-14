import { type HTMLMotionProps, motion } from "framer-motion";
import React, { createContext, useEffect } from "react";
import { useState } from "react";

import type { SchemaOf } from "yup";
import { type FormInstance } from "../../useForm";

type FormProviderProps<T = any> = Omit<HTMLMotionProps<"form">, "onSubmit"> & {
	initialValues?: T;
	onSubmit: (values: T) => void | Promise<void>;
	formInstance: FormInstance<any>;
	validationSchema: SchemaOf<any>;
};

type FormContext<T extends Object> = FormInstance<T>;

export const FormContext = createContext<FormContext<any>>({} as FormContext<any>);

export const FormProvider = <T,>({
	formInstance,
	children,
	initialValues,
	onSubmit,
	validationSchema,
	onKeyDownCapture,
	...formProps
}: FormProviderProps<T>) => {
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (submitting) return;
		setSubmitting(true);
		const isValid = await validationSchema
			.validate(formInstance.getFieldValues())
			.then(() => true)
			.catch(() => false);
		if (!isValid) return;
		await onSubmit(formInstance.getFieldValues());
		setSubmitting(false);
	};

	const handleKeyDownCapture: React.KeyboardEventHandler<HTMLFormElement> = event => {
		// if (event.key === "Enter") handleSubmit(event);

		onKeyDownCapture && onKeyDownCapture(event);
	};

	useEffect(() => {
		formInstance._setInitialValues(initialValues as T);
		formInstance._setValidationSchema(validationSchema);
	}, []);

	return (
		<FormContext.Provider value={{ ...formInstance }}>
			<motion.form
				layout
				onSubmit={handleSubmit}
				onKeyDownCapture={handleKeyDownCapture}
				{...formProps}
			>
				{children}
			</motion.form>
		</FormContext.Provider>
	);
};
