import React, { useEffect, useMemo } from "react";

import { Form } from "@components/Form";
import {
	Container,
	Title,
	CategoryWrapper,
	CategoryTitle,
	CategoryInputsWrapper,
	CustomInput,
	SubmitButton,
} from "./styles";

import { validationSchema, getTemperaturePattern } from "./utils/validation";

export type FormValues = {
	rollInterval: string;
	incubationDuration: string;
	maxTemperature: string;
	minTemperature: string;
};

type ControlFormProps = {
	onSubmit?: (values: FormValues) => void | Promise<void>;
};

export const ControlForm = ({ onSubmit }: ControlFormProps) => {
	const form = Form.useForm<FormValues>();

	const initialValues: FormValues = useMemo(
		() => ({
			rollInterval: "",
			incubationDuration: "",
			maxTemperature: "",
			minTemperature: "",
		}),
		[]
	);

	const handleSubmit = async (values: FormValues) => {
		console.log(values);
		onSubmit && onSubmit(values);
	};

	const maskMinTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/[^\d.]/g, "");
		if (cleanValue) {
			form.setFieldValue("minTemperature", cleanValue.replace(getTemperaturePattern(), "$1 °C"));
		}
	};

	const maskMaxTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/[^\d.]/g, "");
		if (cleanValue) {
			form.setFieldValue("maxTemperature", cleanValue.replace(getTemperaturePattern(), "$1 °C"));
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
				<Title>Configuração da Incubadora</Title>

				<CategoryWrapper>
					<CategoryTitle>Controle do motor</CategoryTitle>
					<CategoryInputsWrapper>
						<Form.Item
							as={CustomInput}
							name="incubationDuration"
							label="Duração da incubação"
							placeholder="2d 5h 30m"
						/>
						<Form.Item
							as={CustomInput}
							name="rollInterval"
							label="Intervalo de rolagem"
							placeholder="1h 27m"
						/>
					</CategoryInputsWrapper>
				</CategoryWrapper>

				<CategoryWrapper>
					<CategoryTitle>Controle da temperatura</CategoryTitle>
					<CategoryInputsWrapper>
						<Form.Item
							as={CustomInput}
							name="minTemperature"
							label="Temperatura mínima em °C"
							placeholder="27"
							onBlur={maskMinTemperature}
						/>
						<Form.Item
							as={CustomInput}
							name="maxTemperature"
							label="Temperature máxima em °C"
							placeholder="38"
							onBlur={maskMaxTemperature}
						/>
					</CategoryInputsWrapper>
				</CategoryWrapper>

				<SubmitButton htmlType="submit" styleType="primary">
					Iniciar incubação
				</SubmitButton>
			</Container>
		</Form.Provider>
	);
};
