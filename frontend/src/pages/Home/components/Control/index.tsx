import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";
import { StartIncubation, CurrentIncubation, FinishedIncubations } from "./components";
import { LoadingContainer, Container } from "./styles";

import { api } from "@utils/api";
import {
	IncubationStatus,
	type IncubationData as IncubationDataType,
} from "@interfaces/incubation";

type RequestData<T> = { data: T | null; loading: boolean; error?: boolean };

enum ControlContent {
	ACTIVE_INCUBATION = "activeIncubation",
	START_INCUBATION = "startIncubation",
	FINISHED_INCUBATIONS = "finishedIncubations",
}

export const Control = () => {
	const [content, setContent] = useState<ControlContent | null>(null);
	const [activeIncubation, setActiveIncubation] = useState<RequestData<IncubationDataType>>({
		data: null,
		loading: true,
		error: false,
	});

	const handleIncubationInitialized = (data: any) => {
		setActiveIncubation({ data, loading: false, error: false });
		setContent(ControlContent.ACTIVE_INCUBATION);
	};

	const handleIncubationFinished = () => {
		setContent(ControlContent.FINISHED_INCUBATIONS)
	}

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getActiveIncubation = async () => {
			setActiveIncubation(prev => ({ ...prev, loading: true }));
			try {
				const { data } = await api.get<IncubationDataType[]>("incubator/incubations", {
					params: { status: IncubationStatus.ACTIVE },
				});
				if (!isMounted) return;
				setActiveIncubation({ data: data ? data[0] : null, loading: false, error: false });
				setContent(data ? ControlContent.ACTIVE_INCUBATION : ControlContent.FINISHED_INCUBATIONS);
			} catch (err) {
				if (!isMounted) return;
				setActiveIncubation(prev => ({ ...prev, loading: true, error: true }));
			}
		};

		getActiveIncubation();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	if (activeIncubation.loading) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	if (content === ControlContent.START_INCUBATION) {
		return <StartIncubation onIncubationInitialized={handleIncubationInitialized} />;
	}

	if (content === ControlContent.FINISHED_INCUBATIONS) {
		return (
			<FinishedIncubations onStartIncubation={() => setContent(ControlContent.START_INCUBATION)} />
		);
	}

	return (
		<Container>
			<h2>Incubação em andamento</h2>
			{activeIncubation.data && (
				<CurrentIncubation
					data={activeIncubation.data}
					onIncubationFinished={handleIncubationFinished}
				/>
			)}
		</Container>
	);
};
