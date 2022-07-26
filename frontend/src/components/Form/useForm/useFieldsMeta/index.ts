import { useMemo, useRef } from "react";

import type { FieldMeta } from "../../components/Item";

type MetaChangeHandler = (meta: FieldMeta) => void;

type AllMetasObserverCallback<T> = (allMeta: { name: keyof T; meta: FieldMeta }[]) => void;

type UseFieldsMetaProps<T extends Object> = {
	getInitialValues: () => T | null;
};

export type FieldMetaInstace<T extends Object> = {
	getFieldsMeta: () => Map<keyof T, FieldMeta>;
	getFieldMeta: <K extends keyof T>(key: K) => FieldMeta;
	setFieldMeta: <K extends keyof T>(key: K, meta: Partial<FieldMeta>) => void;
	resetFieldMeta: <K extends keyof T>(key: K) => void;
	subscribe: <K extends keyof T>(key: K, callback: MetaChangeHandler) => void;
	subscribeToAll: (callback: AllMetasObserverCallback<T>) => void;
};

export const useFieldsMeta = <T extends Object>({
	getInitialValues,
}: UseFieldsMetaProps<T>): FieldMetaInstace<T> => {
	const _fieldsMeta = useRef<Map<keyof T, FieldMeta>>();
	const _metaObservers = useRef<Map<keyof T, Set<MetaChangeHandler>>>();
	const _allMetasObservers = useRef<Set<AllMetasObserverCallback<T>>>();

	const _getInitFieldMeta = (key: keyof T): FieldMeta => {
		const initialValues = getInitialValues();
		if (initialValues && initialValues[key]) return { value: initialValues[key], touched: false };
		return { value: "", touched: false };
	};

	const getFieldsMeta = () => {
		if (_fieldsMeta.current) return _fieldsMeta.current;
		const metas = new Map();
		_getMetaObservers().forEach((_, key) => {
			metas.set(key, _getInitFieldMeta(key as keyof T));
		});
		_fieldsMeta.current = metas;
		return _fieldsMeta.current;
	};

	const getFieldMeta = (key: keyof T) => getFieldsMeta().get(key) || _getInitFieldMeta(key);

	const setFieldMeta = (key: keyof T, meta: Partial<FieldMeta>) => {
		const fieldsMeta = getFieldsMeta();
		const currFieldMeta = fieldsMeta.get(key);
		const newMeta = currFieldMeta ? { ...currFieldMeta, ...meta } : _getInitFieldMeta(key);

		fieldsMeta.set(key, newMeta);
		_updateObservers(key, newMeta);
		_updateAllMetasObsevers();
	};

	const resetFieldMeta = (key: keyof T) => {
		setFieldMeta(key, _getInitFieldMeta(key));
	};

	const _getMetaObservers = () => {
		if (_metaObservers.current) return _metaObservers.current;
		_metaObservers.current = new Map();
		return _metaObservers.current;
	};

	const _getAllMetaObservers = () => {
		if (_allMetasObservers.current) return _allMetasObservers.current;
		_allMetasObservers.current = new Set();
		return _allMetasObservers.current;
	};

	const _updateObservers = (key: keyof T, meta: FieldMeta) => {
		const observers = _getMetaObservers().get(key);
		if (observers) observers.forEach(callback => callback(meta));
	};

	const subscribe = (key: keyof T, callback: MetaChangeHandler) => {
		const observers = _getMetaObservers().get(key);
		if (observers) {
			observers.add(callback);
			return;
		}
		const newObserver = new Set<MetaChangeHandler>();
		newObserver.add(callback);
		_getMetaObservers().set(key, newObserver);
	};

	const subscribeToAll = (callback: AllMetasObserverCallback<T>) => {
		_getAllMetaObservers().add(callback);
	};

	const _updateAllMetasObsevers = () => {
		const allMetas = Array.from(getFieldsMeta().entries()).map(([key, value]) => ({
			name: key,
			meta: value,
		}));
		_getAllMetaObservers().forEach(callback => callback(allMetas));
	};

	const metaInstance = useMemo(
		() => ({
			getFieldsMeta,
			getFieldMeta,
			setFieldMeta,
			resetFieldMeta,
			subscribe,
			subscribeToAll,
		}),
		[]
	);

	return metaInstance;
};
