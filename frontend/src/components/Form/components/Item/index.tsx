import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "@components/Form";

import type { HTMLMotionProps } from "framer-motion";

interface IItemProps extends HTMLMotionProps<"input"> {
	as?: React.FC<any>;
	name: string;
	placeholder?: string;
	label: React.ReactNode;
	id?: string;
	valueTrigger?: "onChange" | "onBlur";
}

export type FieldMeta = {
	value: any;
	error?: string;
	touched: boolean;
};

export const Item = ({
	as: Field,
	name,
	onChange,
	onBlur,
	onFocus,
	children,
	...fieldProps
}: IItemProps) => {
	const context = useContext(FormContext);
	const fieldRef = useRef<HTMLInputElement>();
	const [meta, setMeta] = useState<FieldMeta>(context.meta.getFieldMeta(name));

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const initialValue = context._getFieldInitialValue(name);
		const newMeta: FieldMeta = { touched: initialValue !== value, value: value };
		context.meta.setFieldMeta(name, newMeta);
		setMeta(newMeta);
		onChange && onChange(event);
	};

	const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		onBlur && onBlur(event);
		context.validateField(name);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		onFocus && onFocus(event);
		context.meta.setFieldMeta(name, { error: undefined });
	};

	useEffect(() => {
		if (Field) {
			fieldRef.current && context._setField(name, fieldRef.current);
			context.meta.resetFieldMeta(name);
			context.meta.subscribe(name, meta => setMeta(meta));
		}
	}, []);

	if (!Field) {
		return <>children</>;
	}

	return (
		<Field
			ref={fieldRef}
			name={name}
			meta={meta}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			{...fieldProps}
		/>
	);
};
