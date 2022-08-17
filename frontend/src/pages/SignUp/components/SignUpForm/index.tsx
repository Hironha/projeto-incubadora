import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

import { validationSchema } from "./utils/validation";

import { LogoContainer, Container, CustomButton } from "./styles";

import Logo from "@assets/images/logo.png";
import { LayoutGroup } from "framer-motion";
import { Form } from "@components/Form";
import { Input } from "@components/Input";

import { api } from "@utils/api";

export type FormValues = {
	email: string;
	password: string;
	passwordConfirm: string;
};

export const SignUpForm = () => {
	const navigate = useNavigate();
	const [submitting, setSubmitting] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const form = Form.useForm<FormValues>();

	const initialValues: FormValues = {
		email: "",
		password: "",
		passwordConfirm: "",
	};

	const handleSubmit = async (values: FormValues) => {
		try {
			setSubmitting(true);

			await api.post("/users/create", { email: values.email, password: values.password });

			setTimeout(() => {
				navigate("/login");
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
			<LayoutGroup id="signup-inputs">
				<Container layoutId="container" layout="size">
					<LogoContainer src={Logo} alt="Logo incubadora" layoutId="logo" layout />

					<Form.Item as={Input} label="Email" name="email" layoutId="email" />
					<Form.Item as={Input} label="Senha" name="password" type="password" layoutId="password" />
					<Form.Item
						as={Input}
						label="Confirmação de senha"
						name="passwordConfirm"
						type="password"
						layoutId="passwordConfirm"
					/>

					<CustomButton
						layout
						layoutId="submit"
						htmlType="submit"
						loading={submitting ? { size: "small" } : undefined}
						styleType={!isValid || submitting ? "secondary" : "primary"}
						disabled={submitting || !isValid}
					>
						Criar
					</CustomButton>
				</Container>
			</LayoutGroup>
		</Form.Provider>
	);
};
