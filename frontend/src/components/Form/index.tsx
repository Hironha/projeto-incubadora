import { type HTMLMotionProps, motion } from "framer-motion";
import React, { createContext, useEffect, useState } from "react";
import { Item } from "./components";

import { SchemaOf } from "yup";
import { useForm, type FormInstance } from "./useForm";

type FormProviderProps<T = any> = Omit<HTMLMotionProps<"form">, "onSubmit"> & {
	initialValues: T;
	onSubmit: (values: T) => void | Promise<void>;
	formInstance: FormInstance<any>;
	validationSchema: SchemaOf<any>;
};

type FormContext<T extends Object> = FormInstance<T> & {
	isSubmitting: boolean;
};

export const FormContext = createContext<FormContext<any>>({} as FormContext<any>);

export const FormProvider = <T,>({
	formInstance,
	children,
	initialValues,
	onSubmit,
	validationSchema,
	onBlurCapture,
	...formProps
}: FormProviderProps<T>) => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const values = formInstance.getFieldValues();
		setIsSubmitting(true);
		await onSubmit(values);
		setIsSubmitting(false);
	};

	const handleBlurCapture = async (event: React.FocusEvent<HTMLFormElement>) => {
		onBlurCapture && onBlurCapture(event);
		const validationSchema = formInstance._getValidationSchema();
		if (!validationSchema) return;
		try {
			const values = formInstance.getFieldValues();
			await validationSchema.validate(values, { abortEarly: true });
		} catch (err) {}
	};

	useEffect(() => {
		formInstance._setInitialValues(initialValues as T);
		formInstance._setValidationSchema(validationSchema);
	}, []);

	return (
		<FormContext.Provider value={{ ...formInstance, isSubmitting }}>
			<motion.form layout onSubmit={handleSubmit} onBlurCapture={handleBlurCapture} {...formProps}>
				{children}
			</motion.form>
		</FormContext.Provider>
	);
};

export const Form = {
	Item: Item,
	useForm: useForm,
	Provider: FormProvider,
};
