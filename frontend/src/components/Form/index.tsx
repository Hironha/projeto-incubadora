import { Item } from "./components/Item";
import { useForm } from "./useForm";
import { FormProvider } from "./components/FormProvider";

export { FormContext } from "./components/FormProvider";

export const Form = {
	Item: Item,
	useForm: useForm,
	Provider: FormProvider,
};
