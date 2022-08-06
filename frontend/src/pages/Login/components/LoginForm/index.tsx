import { Formik, Form } from "formik";

import { Button } from "@components/Button";
import { authStorage } from "@utils/auth";

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
			console.log(values);
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
					<Container>
						<LogoContainer src={Logo} alt="Logo incubadora" />
						<div className="InputContainer">
							<input type="email" placeholder=" " />
							<label>Email</label>
						</div>
						<div className="InputContainer">
							<input type="password" placeholder=" " />
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
