import React, { useEffect, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { Form } from "@components/Form";
import { Button } from "@components/Button";
import {
	Container,
	Title,
	CategoryWrapper,
	CategoryTitle,
	CategoryInputsWrapper,
	CustomInput,
	SubmitContainer,
} from "./styles";

import { regexes } from "@utils/regexes";
import { validationSchema } from "./utils/validation";

export type FormValues = {
	rollInterval: string;
	incubationDuration: string;
	maxTemperature: string;
	minTemperature: string;
};

type ControlFormProps = {
	errorMessage?: React.ReactNode;
	isSubmitting?: boolean;
	onSubmit: (values: FormValues) => void | Promise<void>;
};

export const ControlForm = ({ errorMessage, isSubmitting, onSubmit }: ControlFormProps) => {
	const [isValid, setIsValid] = useState(false);
	const form = Form.useForm<FormValues>();

	const initialValues: FormValues = {
		rollInterval: "",
		incubationDuration: "",
		maxTemperature: "",
		minTemperature: "",
	};

	const handleSubmit = async (values: FormValues) => {
		if (!isSubmitting) {
			await onSubmit(values);
		}
	};

	const maskTemperature = (input: string) => {
		const cleanValue = input.replace(/[^\d.]/g, "");
		if (cleanValue) return cleanValue.replace(regexes.getFloatPattern(), "$1 °C");
		return "";
	};

	const handleMinTemperatureBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
		form.setFieldValue("minTemperature", maskTemperature(event.target.value));
	};

	const handleMaxTemperatureBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
		form.setFieldValue("maxTemperature", maskTemperature(event.target.value));
	};

	useEffect(() => {
		form.meta.subscribeToAll(allMeta => {
			const isAllValid = allMeta.every(({ meta }) => !meta.error && meta.touched);
			setIsValid(isAllValid);
		});
	}, []);

	return (
		<Form.Provider
			initialValues={initialValues}
			formInstance={form}
			onSubmit={handleSubmit}
			validationSchema={validationSchema}
		>
			<Container layout>
				<Title layoutId="control-form-title">Configuração da Incubadora</Title>

				<CategoryWrapper layoutId="motor-inputs-wrapper">
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

				<CategoryWrapper layoutId="sensor-inputs-wrapper">
					<CategoryTitle>Controle da temperatura</CategoryTitle>
					<CategoryInputsWrapper>
						<Form.Item
							as={CustomInput}
							name="minTemperature"
							label="Temperatura mínima em °C"
							placeholder="27"
							onBlur={handleMinTemperatureBlur}
						/>
						<Form.Item
							as={CustomInput}
							name="maxTemperature"
							label="Temperature máxima em °C"
							placeholder="38"
							onBlur={handleMaxTemperatureBlur}
						/>
					</CategoryInputsWrapper>
				</CategoryWrapper>

				<SubmitContainer>
					{errorMessage}
					<Button
						htmlType="submit"
						styleType={isValid && !isSubmitting ? "primary" : "secondary"}
						loading={isSubmitting ? { size: "small" } : undefined}
					>
						Iniciar incubação
					</Button>
				</SubmitContainer>
			</Container>
		</Form.Provider>
	);
};
