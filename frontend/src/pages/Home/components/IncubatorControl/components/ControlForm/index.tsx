import React, { useMemo } from "react";
import { Form, Formik } from "formik";

import { FormikInput } from "@components/FormikInput";
import {
	Container,
	Title,
	CategoryWrapper,
	CategoryTitle,
	CategoryInputsWrapper,
	SubmitButton,
} from "./styles";

export type FormValues = {
	rollInterval: string;
	incubationDuration: string;
	maxTemperature: string;
	minTemprature: string;
};

type ControlFormProps = {
	onSubmit?: (values: FormValues) => void | Promise<void>;
};

export const ControlForm = ({ onSubmit }: ControlFormProps) => {
	const initialValues: FormValues = useMemo(
		() => ({
			rollInterval: "",
			incubationDuration: "",
			maxTemperature: "",
			minTemprature: "",
		}),
		[]
	);

	const handleSubmit = async (values: FormValues) => {
		console.log(values);
		onSubmit && onSubmit(values);
	};

	const maskNumberInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.target.value = event.target.value.replace(/\D+/g, "");
	};

	const maskTemperature = (event: React.ChangeEvent<HTMLInputElement>) => {
		const cleanValue = event.target.value.replace(/\D+/g, "");
		if (cleanValue) {
			event.target.value = cleanValue.replace(/(\d*)/, "$1 °C");
		}
	};

	return (
		<Formik validateOnBlur initialValues={initialValues} onSubmit={handleSubmit}>
			{() => (
				<Form>
					<Container>
						<Title>Configuração da Incubadora</Title>

						<CategoryWrapper>
							<CategoryTitle>Controle do motor</CategoryTitle>
							<CategoryInputsWrapper>
								<FormikInput
									label="Duração da incubação"
									placeholder="2d 5h 30m"
									name="incubationDuration"
								/>
								<FormikInput
									label="Intervalo de rolagem"
									placeholder="1h 27m"
									name="rollInterval"
								/>
							</CategoryInputsWrapper>
						</CategoryWrapper>

						<CategoryWrapper>
							<CategoryTitle>Controle da temperatura</CategoryTitle>
							<CategoryInputsWrapper>
								<FormikInput
									label="Temperatura mínima em °C"
									placeholder="27"
									name="minTemperature"
									valueTrigger="onChange"
									onChange={maskNumberInput}
									onBlur={maskTemperature}
								/>
								<FormikInput
									label="Temperature máxima em °C"
									placeholder="38"
									name="maxTemperature"
									valueTrigger="onChange"
									onChange={maskNumberInput}
									onBlur={maskTemperature}
								/>
							</CategoryInputsWrapper>
						</CategoryWrapper>

						<SubmitButton htmlType="submit" styleType="primary">
							Iniciar incubação
						</SubmitButton>
					</Container>
				</Form>
			)}
		</Formik>
	);
};
