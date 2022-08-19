import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { validationSchema } from "./utils/validation";

import { LogoContainer, Container, CustomButton, SignUpLinkContainer, SignUpLink } from "./styles";

import Logo from "@assets/images/logo.png";
import { LayoutGroup } from "framer-motion";
import { Form } from "@components/Form";
import { Input } from "@components/Input";

export type FormValues = {
	email: string;
	password: string;
};

export const LoginForm = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const form = Form.useForm<FormValues>();

	const initialValues: FormValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (values: FormValues) => {
		try {
			const auth = getAuth();
			setSubmitting(true);

			await signInWithEmailAndPassword(auth, values.email, values.password);

			setTimeout(() => {
				navigate("/");
			}, 500);
		} catch (err) {
			console.log(err);
		}
		setSubmitting(false);
	};

	useEffect(() => {
		form.meta.subscribeToAll(metas => {
			const isValid = metas.every(({ meta }) => !meta.error && meta.touched);
			setIsValid(isValid);
		});
	}, [form]);

	return (
		<Form.Provider
			initialValues={initialValues}
			formInstance={form}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			<LayoutGroup id="login-inputs">
				<Container layoutId="container" layout="size">
					<LogoContainer src={Logo} alt="Logo incubadora" layoutId="logo" layout />

					<Form.Item as={Input} label="Email" name="email" layoutId="email" />
					<Form.Item as={Input} label="Senha" name="password" type="password" layoutId="password" />

					<CustomButton
						layout
						layoutId="submit"
						htmlType="submit"
						loading={submitting ? { size: "small" } : undefined}
						styleType={!isValid || submitting ? "secondary" : "primary"}
						disabled={submitting || !isValid}
					>
						Login
					</CustomButton>
					<SignUpLinkContainer>Não possui conta? <SignUpLink to="/sign-up">Cadastre-se!</SignUpLink></SignUpLinkContainer>
				</Container>
			</LayoutGroup>
		</Form.Provider>
	);
};
