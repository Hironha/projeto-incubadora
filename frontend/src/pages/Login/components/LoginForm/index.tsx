import { Formik, Form, Field } from "formik";
import { getAuth } from "@utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@components/Button";
import { authStorage } from "@utils/auth";

import { validationSchema } from "./validation";

export type LoginFormValues = {
	email: string;
	password: string;
};

export const LoginForm = () => {
	const initialValues: LoginFormValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (values: LoginFormValues) => {
		try {
			const auth = getAuth();
			const credentials = await signInWithEmailAndPassword(auth, values.email, values.password);
			authStorage.setToken(await credentials.user.getIdToken(true));
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Formik
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			{() => (
				<Form>
					<label htmlFor="email">Email</label>
					<Field name="email" id="email" />

					<label htmlFor="password">Password</label>
					<Field name="password" id="password" />

					<Button htmlType="submit">Entrar</Button>
				</Form>
			)}
		</Formik>
	);
};
