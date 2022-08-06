import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form, Field } from "formik";

import { validationSchema } from "./validation";

import {
	LogoContainer,
	Container,
	ButtonContainer,
	CustomButton,
	InputContainer,
	DataInput,
} from "./styles";

import Logo from "@assets/images/logo.png";

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
			initialValues={initialValues}
			onSubmit={handleSubmit}
			// validationSchema={validationSchema}
		>
			{() => (
				<Form>
					<Container>
						<LogoContainer src={Logo} alt="Logo incubadora" />
						<InputContainer>
							<label>Email</label>
							<Field as={DataInput} type="email" required name="email" />
						</InputContainer>
						<InputContainer>
							<label>Senha</label>
							<Field as={DataInput} type="password" placeholder=" " required name="password" />
						</InputContainer>
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
