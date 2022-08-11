import { useMemo, useRef } from "react";
import { type FieldMetaInstace, useFieldsMeta } from "./useFieldsMeta";
import type { SchemaOf, ValidationError } from "yup";

export type FormInstance<T extends Object> = {
	meta: FieldMetaInstace<T>;
	getFieldValue: <K extends keyof T>(key: K) => T[K] | null;
	setFieldValue: <K extends keyof T>(key: K, value: T[K]) => void;
	focus: <K extends keyof T>(key: K) => void;
	resetField: <K extends keyof T>(key: K) => void;
	resetFields: () => void;
	getFieldValues: () => T;
	validateField: <K extends keyof T>(key: K) => Promise<void>;
	_setField: <K extends keyof T>(name: K, field: HTMLInputElement | HTMLSelectElement) => void;
	_setInitialValues: (values: T) => void;
	_getFieldInitialValue: <K extends keyof T>(key: K) => T[K] | "";
	_setValidationSchema: (shema: SchemaOf<any>) => void;
	_getValidationSchema: () => SchemaOf<any> | null;
};

export const useForm = <T extends Object>(): FormInstance<T> => {
	const _initialValues = useRef<Object>();
	const _validationSchema = useRef<SchemaOf<any>>();
	const _fields = useRef<Map<string, HTMLInputElement | HTMLSelectElement>>();

	const getInitialValues = (): T | null =>
		_initialValues.current ? ({ ..._initialValues.current } as T) : null;

	const fieldsMetas = useFieldsMeta<T>({ getInitialValues });

	const _getFields = () => {
		if (_fields.current) return _fields.current;
		_fields.current = new Map();
		return _fields.current;
	};

	const _setField = (name: any, field: HTMLInputElement | HTMLSelectElement) => {
		_getFields().set(name, field);
	};

	const _getValidationSchema = () => _validationSchema.current || null;

	const _setValidationSchema = <T extends SchemaOf<any>>(schema: T) => {
		_validationSchema.current = schema;
	};

	const _setInitialValues = <T extends Object>(values: T) => {
		_initialValues.current = values;
		Object.entries(values).forEach(([key, value]) => {
			fieldsMetas.setFieldMeta(key as any, { value });
		});
	};

	const _getFieldInitialValue = (key: any) => {
		const initialValues = getInitialValues();
		if (initialValues) return initialValues[key];
		return "";
	};

	const getFieldValue = <K extends keyof T>(key: K): T[K] => fieldsMetas.getFieldMeta(key).value;

	const getFieldValues = (): any => {
		const metas = fieldsMetas.getFieldsMeta();
		return Object.fromEntries(
			Array.from(metas.entries()).map(([key, value]) => [key, value.value])
		);
	};

	const setFieldValue = <K extends keyof T>(key: K, value: T[K]) => {
		fieldsMetas.setFieldMeta(key, { value });
	};

	const focus = (key: any) => {
		const input = _getFields().get(key);
		if (input) input.focus();
	};

	const _setFieldError = (key: keyof T, error: string) => {
		fieldsMetas.setFieldMeta(key, { error });
	};

	const validateField = async (key: any) => {
		const validationSchema = _getValidationSchema();
		if (!validationSchema) return;
		try {
			await validationSchema.validateAt(key, getFieldValues(), { abortEarly: true });
		} catch (err) {
			const message = (err as ValidationError).message;
			_setFieldError(key, message);
		}
	};

	const resetField = (key: keyof T) => {
		fieldsMetas.resetFieldMeta(key);
	};

	const resetFields = () =>
		_getFields().forEach((_, key) => fieldsMetas.resetFieldMeta(key as any));

	const formInstace = useMemo(
		() => ({
			meta: fieldsMetas,
			getFieldValue,
			getFieldValues,
			setFieldValue,
			focus,
			resetField,
			resetFields,
			validateField,
			_setField,
			_setInitialValues,
			_getFieldInitialValue,
			_setValidationSchema,
			_getValidationSchema,
		}),
		[]
	);

	return formInstace;
};
