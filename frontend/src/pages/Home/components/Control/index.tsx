import { useEffect, useState } from "react";
import { Loading } from "@components/Loading";
import { StartIncubation, IncubationData } from "./components";
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
}

export const Control = () => {
	const [content, setContent] = useState<ControlContent | null>(null);
	const [requestData, setRequestData] = useState<RequestData<IncubationDataType>>({
		data: null,
		loading: true,
		error: false,
	});

	const handleIncubationInitialized = (data: any) => {
		setRequestData({ data, loading: false, error: false });
		setContent(ControlContent.ACTIVE_INCUBATION);
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		const getActiveIncubation = async () => {
			setRequestData(prev => ({ ...prev, loading: true }));
			try {
				const { data } = await api.get<IncubationDataType[]>("incubator/incubations", {
					params: { status: IncubationStatus.ACTIVE },
				});
				if (!isMounted) return;
				setRequestData({ data: data ? data[0] : null, loading: false, error: false });
			} catch (err) {
				if (!isMounted) return;
				setRequestData(prev => ({ ...prev, loading: true, error: true }));
			}
		};

		getActiveIncubation();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, []);

	if (requestData.loading) {
		return (
			<LoadingContainer>
				<Loading size="medium" />
			</LoadingContainer>
		);
	}

	if (content === ControlContent.START_INCUBATION || !requestData.data) {
		return <StartIncubation onIncubationInitialized={handleIncubationInitialized} />;
	}

	return (
		<Container>
			<h2>Incubação em andamento</h2>
			<IncubationData data={requestData.data} />
		</Container>
	);
};
