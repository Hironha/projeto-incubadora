import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { FormikInput } from "@components/FormikInput";

import { validationSchema } from "./validation";

import { LogoContainer, Container, CustomButton } from "./styles";

import Logo from "@assets/images/logo.png";
import { LayoutGroup } from "framer-motion";
import { Loading } from "@components/Loading";

export type LoginFormValues = {
	email: string;
	password: string;
};

export const LoginForm = () => {
	const navigate = useNavigate();

	const initialValues: LoginFormValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (values: LoginFormValues) => {
		try {
			const auth = getAuth();
			await signInWithEmailAndPassword(auth, values.email, values.password);

			setTimeout(() => {
				navigate("/");
			}, 500);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Formik
			validateOnBlur
			validateOnMount
			initialValues={initialValues}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			{({ isSubmitting, isValid }) => (
				<Form>
					<Container>
						<LogoContainer src={Logo} alt="Logo incubadora" />

						<LayoutGroup>
							<FormikInput label="Email" name="email" />
							<FormikInput label="Senha" name="password" />

							<CustomButton
								htmlType="submit"
								styleType={isValid ? "primary" : "secondary"}
								disabled={!isValid}
							>
								{isSubmitting ? (
									<>
										<Loading color="lightGray" size="small" /> Login
									</>
								) : (
									"Login"
								)}
							</CustomButton>
						</LayoutGroup>
					</Container>
				</Form>
			)}
		</Formik>
	);
};
