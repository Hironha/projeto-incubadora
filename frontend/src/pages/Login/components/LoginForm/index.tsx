import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { validationSchema } from "./utils/validation";

import { LogoContainer, Container, CustomButton } from "./styles";

import Logo from "@assets/images/logo.png";
import { LayoutGroup } from "framer-motion";
import { Loading } from "@components/Loading";
import { Form } from "@components/Form";
import { Input } from "@components/Input";
import { Button } from "@components/Button";

export type FormValues = {
	email: string;
	password: string;
};

export const LoginForm = () => {
	const navigate = useNavigate();
	const form = Form.useForm<FormValues>();

	const initialValues: FormValues = {
		email: "",
		password: "",
	};

	const handleSubmit = async (values: FormValues) => {
		try {
			console.log(values);
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
					<Form.Item as={Input} label="Senha" name="password" />

					<CustomButton
						htmlType="submit"
						styleType="primary"
						// styleType={isValid ? "primary" : "secondary"}
						// disabled={!isValid}
					>
						Login
						{/* {isSubmitting ? (
							<>
								<Loading color="lightGray" size="small" /> Login
							</>
						) : (
							"Login"
						)} */}
					</CustomButton>
				</LayoutGroup>
			</Container>
		</Form.Provider>
	);
};
