import { type LottieRef } from "lottie-react";
import { LoadingWrapper, type LoadingSize } from "./styles";

import LoadingLottie from "@assets/lotties/loading-lottie.json";
import { forwardRef } from "react";

type LoadingProps = {
	className?: string;
	size?: LoadingSize;
};

export const Loading = forwardRef<LottieRef, LoadingProps>(
	({ className, size = "medium" }, lottieRef) => {
		return (
			<LoadingWrapper
				loop
				lottieRef={lottieRef as LottieRef}
				className={className}
				animationData={LoadingLottie}
				loadingSize={size}
			/>
		);
	}
);
