import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { validationSchema } from "./utils/validation";

import { LogoContainer, Container, CustomButton } from "./styles";

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

			setSubmitting(false);
			setTimeout(() => {
				navigate("/");
			}, 500);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Form.Provider
			initialValues={initialValues}
			formInstance={form}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			<Container>
				<LogoContainer src={Logo} alt="Logo incubadora" />

				<LayoutGroup>
					<Form.Item as={Input} label="Email" name="email" />
					<Form.Item as={Input} label="Senha" name="password" type="password" />

					<CustomButton
						layout
						htmlType="submit"
						loading={submitting ? { size: "small" } : undefined}
						styleType={submitting ? "secondary" : "primary"}
						disabled={submitting}
					>
						Login
					</CustomButton>
				</LayoutGroup>
			</Container>
		</Form.Provider>
	);
};
