import Lottie, { type LottieRef } from "lottie-react";

import LoadingLottie from "@assets/lotties/loading-lottie.json";
import { forwardRef } from "react";

enum LoadingSize {
	SMALL = "small",
	MEDIUM = "medium",
	LARGE = "large",
}

type LoadingProps = {
	className?: string;
	lottieSize?: `${LoadingSize}`;
};

export const Loading = forwardRef<LottieRef, LoadingProps>(
	({ className, lottieSize = LoadingSize.MEDIUM }, lottieRef) => {
		const sizes: { [key in LoadingSize]: number } = {
			[LoadingSize.SMALL]: 25,
			[LoadingSize.MEDIUM]: 50,
			[LoadingSize.LARGE]: 75,
		};

		return (
			<Lottie
				loop
				lottieRef={lottieRef as LottieRef}
				className={className}
				animationData={LoadingLottie}
				size={sizes[lottieSize]}
			/>
		);
	}
);
