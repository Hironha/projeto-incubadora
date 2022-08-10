import { useMemo, useRef } from "react";
import type { SchemaOf, ValidationError } from "yup";
import type { FieldMeta } from "../components/Item";

type MetaChangeHandler = (meta: FieldMeta) => void;

export type FormInstance<T extends Object> = {
	getFieldValue: <K extends keyof T>(key: K) => T[K] | null;
	setFieldValue: <K extends keyof T>(key: K, value: T[K]) => void;
	focus: <K extends keyof T>(key: K) => void;
	resetField: <K extends keyof T>(key: K) => void;
	resetFields: () => void;
	setFieldMeta: <K extends keyof T>(key: K, meta: FieldMeta) => void;
	getFieldValues: () => T;
	validateField: <K extends keyof T>(key: K) => Promise<void>;
	_setField: <K extends keyof T>(name: K, field: HTMLInputElement | HTMLSelectElement) => void;
	_setInitialValues: (values: T) => void;
	_getFieldInitialValue: <K extends keyof T>(key: K) => T[K] | "";
	_addMetaObserver: <K extends keyof T>(key: K, callback: MetaChangeHandler) => void;
	_getFieldsMeta: () => Map<string, FieldMeta>;
	_setValidationSchema: (shema: SchemaOf<any>) => void;
	_getValidationSchema: () => SchemaOf<any> | null;
};

export const useForm = <T extends Object>(): FormInstance<T> => {
	const _initialValues = useRef<Object>();
	const _validationSchema = useRef<SchemaOf<any>>();
	const _fields = useRef<Map<string, HTMLInputElement | HTMLSelectElement>>();
	const _fieldsMeta = useRef<Map<string, FieldMeta>>();
	const _metaObservers = useRef<Map<string, MetaChangeHandler>>();

	const _getFields = () => {
		if (_fields.current) return _fields.current;
		_fields.current = new Map();
		return _fields.current;
	};

	const _setField = (name: any, field: HTMLInputElement | HTMLSelectElement) => {
		_getFields().set(name, field);
	};

	const _getMetaObservers = () => {
		if (_metaObservers.current) return _metaObservers.current;
		_metaObservers.current = new Map();
		return _metaObservers.current;
	};

	const _getFieldsMeta = () => {
		if (_fieldsMeta.current) return _fieldsMeta.current;
		const metas = new Map();
		_getMetaObservers().forEach((_, key) => {
			metas.set(key, _getInitFieldMeta(key));
		});
		_fieldsMeta.current = metas;
		return _fieldsMeta.current;
	};

	const _getInitFieldMeta = (key: string): FieldMeta => {
		const initialValues = _getInitialValues();
		if (initialValues && initialValues[key]) return { value: initialValues[key], touched: false };
		return { value: "", touched: false };
	};

	const setFieldMeta = (key: any, meta: FieldMeta) => {
		const fieldsMeta = _getFieldsMeta();
		fieldsMeta.set(key, meta);
		const callback = _getMetaObservers().get(key);
		if (callback) callback(meta);
	};

	const _addMetaObserver = (key: any, callback: MetaChangeHandler) => {
		const metaObservers = _getMetaObservers();
		metaObservers.set(key, callback);
	};

	const _getInitialValues = () => _initialValues.current || null;

	const _getValidationSchema = () => _validationSchema.current || null;

	const _setValidationSchema = <T extends SchemaOf<any>>(schema: T) => {
		_validationSchema.current = schema;
	};

	const _setInitialValues = <T extends Object>(values: T) => {
		_initialValues.current = values;
	};

	const _getFieldInitialValue = (key: any) => {
		const initialValues = _getInitialValues();
		if (initialValues) return initialValues[key];
		return "";
	};

	const getFieldValue = (key: any): any => {
		const meta = _getFieldsMeta().get(key);
		if (!meta) return null;
		return meta.value;
	};

	const getFieldValues = (): any => {
		const meta = _getFieldsMeta();
		if (!meta) return null;
		return Object.fromEntries(Array.from(meta.entries()).map(([key, value]) => [key, value.value]));
	};

	const setFieldValue = (key: any, value: any) => {
		const meta = _getFieldsMeta().get(key);
		if (!meta) return;
		setFieldMeta(key, { ...meta, value });
	};

	const focus = (key: any) => {
		const input = _getFields().get(key);
		if (input) input.focus();
	};

	const _setFieldError = (key: any, error: string) => {
		const meta = _getFieldsMeta().get(key);
		if (meta) setFieldMeta(key, { ...meta, error });
		else setFieldMeta(key, _getInitFieldMeta(key));
	};

	const validateField = async (key: any) => {
		const validationSchema = _getValidationSchema();
		if (!validationSchema) return;
		const value = getFieldValue(key);
		try {
			await validationSchema.validateAt(key, value, { abortEarly: true });
		} catch (err) {
			const message = (err as ValidationError).message;
			_setFieldError(key, message);
		}
	};

	const resetField = (key: any) => {
		const initialValues = _getInitialValues();
		if (!initialValues) {
			setFieldValue(key, "");
		} else {
			if (initialValues[key]) setFieldValue(key, initialValues[key]);
		}
	};

	const resetFields = () => _getFields().forEach((_, key) => resetField(key));

	const formInstace = useMemo(
		() => ({
			getFieldValue,
			getFieldValues,
			setFieldValue,
			focus,
			resetField,
			resetFields,
			setFieldMeta,
			validateField,
			_setField,
			_setInitialValues,
			_getFieldInitialValue,
			_addMetaObserver,
			_getFieldsMeta,
			_setValidationSchema,
			_getValidationSchema,
		}),
		[]
	);

	return formInstace;
};
