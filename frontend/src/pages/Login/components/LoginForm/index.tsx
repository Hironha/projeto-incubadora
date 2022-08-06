import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Formik, Form, Field } from "formik";

import { Button } from "@components/Button";

import { validationSchema } from "./validation";

import { LogoContainer, Container, ButtonContainer } from "./styles";

import Logo from "@assets/images/logo.png";

import "./styles.css";

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
						<div className="InputContainer">
							<Field type="email" name="email" placeholder=" " />
							<label>Email</label>
						</div>
						<div className="InputContainer">
							<Field type="password" name="password" placeholder=" " />
							<label>Senha</label>
						</div>

						<ButtonContainer>
							<Button htmlType="submit" styleType="primary">
								Login
							</Button>
						</ButtonContainer>
					</Container>
				</Form>
			)}
		</Formik>
	);
};
