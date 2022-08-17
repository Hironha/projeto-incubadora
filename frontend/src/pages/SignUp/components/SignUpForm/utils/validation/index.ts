import * as Yup from "yup";

import type { FormValues as LoginFormValues } from "../..";

export const validationSchema: Yup.SchemaOf<LoginFormValues> = Yup.object().shape({
	email: Yup.string().email("Email inválido").required("Insira o email"),
	password: Yup.string().required("Insira a senha"),
	passwordConfirm: Yup.string()
		.required()
		.oneOf([Yup.ref("password")], "As senhas devem ser iguais"),
});
