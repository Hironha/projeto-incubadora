import { Formik, Form } from "formik";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { FormikInput } from "@components/FormikInput";

import { validationSchema } from "./validation";

import { LogoContainer, Container, ButtonContainer, CustomButton } from "./styles";

import Logo from "@assets/images/logo.png";
import { LayoutGroup } from "framer-motion";

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
			await signInWithEmailAndPassword(auth, values.email, values.password);
			console.log(values);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Formik
			validateOnBlur
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			{() => (
				<Form>
					<Container>
						<LogoContainer src={Logo} alt="Logo incubadora" />

						<LayoutGroup>
							<FormikInput label="Email" name="email" />
							<FormikInput label="Senha" name="password" />
						</LayoutGroup>

						<ButtonContainer>
							<CustomButton htmlType="submit" styleType="primary">
								Login
							</CustomButton>
						</ButtonContainer>
					</Container>
				</Form>
			)}
		</Formik>
	);
};
