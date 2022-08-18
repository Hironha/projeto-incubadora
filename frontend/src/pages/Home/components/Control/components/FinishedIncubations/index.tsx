import { useEffect, useState } from "react";

import { Loading } from "@components/Loading";
import {
	LoadingContainer,
	Table,
	TableData,
	TableHeader,
	Container,
	StartIncubationButton,
	TBody,
	TableContainer,
} from "./styles";

import { api } from "@utils/api";
import { formatters } from "@utils/incubation/formatters";

import { type IncubationData, IncubationStatus } from "@interfaces/incubation";

type RequestData<T> = { data: T | null; loading: boolean; error?: boolean };

type FinishedIncubationsProps = {
	onStartIncubation: () => void;
};

export const FinishedIncubations = ({ onStartIncubation }: FinishedIncubationsProps) => {
	const [finishedIncubations, setFinishedIncubtions] = useState<RequestData<IncubationData[]>>({
		data: null,
		loading: true,
		error: false,
	});

	const getTemperatureRange = (minTemperature: number, maxTemperature: number) => {
		return `${formatters.formatTemperature(minTemperature)} - ${formatters.formatTemperature(
			maxTemperature
		)}`;
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getActiveIncubation = async () => {
			setFinishedIncubtions(prev => ({ ...prev, loading: true }));
			try {
				const { data } = await api.get<IncubationData[]>("incubator/incubations", {
					params: { status: IncubationStatus.FINISHED },
				});
				if (!isMounted) return;
				setFinishedIncubtions({ data, loading: false, error: false });
			} catch (err) {
				if (!isMounted) return;
				setFinishedIncubtions(prev => ({ ...prev, loading: true, error: true }));
			}
		};

		getActiveIncubation();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	if (finishedIncubations.loading) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	return (
		<Container>
			<StartIncubationButton styleType="primary" onClick={onStartIncubation}>
				Inicar incubação
			</StartIncubationButton>
			<h3>Incubações finalizadas</h3>
			{finishedIncubations.data && (
				<TableContainer>
					<Table>
						<thead>
							<tr>
								<TableHeader>Data de início</TableHeader>
								<TableHeader>Intervalo de Rolagem</TableHeader>
								<TableHeader>Duração</TableHeader>
								<TableHeader>Temperatura</TableHeader>
							</tr>
						</thead>
						<TBody>
							{finishedIncubations.data.map(incubation => (
								<tr key={incubation.id}>
									<TableHeader>
										{formatters.formatDate(new Date(incubation.started_at))}
									</TableHeader>
									<TableData>{formatters.secondsToTimeAcronym(incubation.roll_interval)}</TableData>
									<TableData>
										{formatters.secondsToTimeAcronym(incubation.incubation_duration)}
									</TableData>
									<TableData>
										{getTemperatureRange(incubation.min_temperature, incubation.max_temperature)}
									</TableData>
								</tr>
							))}
						</TBody>
					</Table>
				</TableContainer>
			)}
		</Container>
	);
};
