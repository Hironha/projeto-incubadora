import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
	const initialMeta: FieldMeta = useMemo(
		() => ({ value: context._getFieldInitialValue(name), touched: false }),
		[]
	);
	const [meta, setMeta] = useState<FieldMeta>(initialMeta);

	const updateMeta = (partialMeta: Partial<FieldMeta>) => {
		const meta = context._getFieldsMeta().get(name);
		if (meta) context.setFieldMeta(name, { ...meta, ...partialMeta });
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = event.target;
		const initialValue = context._getFieldInitialValue(name);
		const newMeta: FieldMeta = { touched: initialValue !== value, value: value };
		updateMeta(newMeta);
		setMeta(newMeta);
		onChange && onChange(event);
	};

	const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
		context.validateField(name);
		onBlur && onBlur(event);
	};

	const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
		updateMeta({ error: undefined });

		onFocus && onFocus(event);
	};

	useEffect(() => {
		if (Field) {
			fieldRef.current && context._setField(name, fieldRef.current);
			context.setFieldMeta(name, initialMeta);
			context._addMetaObserver(name, meta => setMeta(meta));
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
