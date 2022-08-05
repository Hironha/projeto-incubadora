import { Formik, Form, Field } from "formik";
import { getAuth } from "@utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import { Button } from "@components/Button";
import { authStorage } from "@utils/auth";

import { validationSchema } from "./validation";

// import { Container } from "./styles";

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
				// <Form>
				// 	<Container>
				// 		<LogoContainer src={Logo} alt="Logo incubadora" />
				// 		<label htmlFor="email">Email</label>
				// 		<Field name="email" id="email" />

				// 		<label htmlFor="password">Senha</label>
				// 		<Field name="password" id="password" />

				// 		<Button htmlType="submit">Entrar</Button>
				// 	</Container>
				// </Form>

				// <Form>
				// 	<Container>
				// 		<ButtonContainer>
				// 			<ButtonInput type="email" placeholder=""/>
				// 			<ButtonLabel>Email</ButtonLabel>
				// 		</ButtonContainer>
				// 	</Container>
				// </Form>
				<Form>
					<Container>
						<LogoContainer src={Logo} alt="Logo incubadora" />
						<div className="InputContainer">
							<input type="email" placeholder=" "/>
							<label>Email</label>
						</div>
						<div className="InputContainer">
							<input type="password" placeholder=" "/>
							<label>Senha</label>
						</div>

						<ButtonContainer>
							<Button htmlType="submit" styleType="primary">Login</Button>
						</ButtonContainer>
					</Container>
				</Form>
			)}
		</Formik>
	);
};
