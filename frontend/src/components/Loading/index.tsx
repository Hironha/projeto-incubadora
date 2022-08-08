import { theme } from "@utils/theme";

import { Loader } from "./styles";

import type { DefaultTheme } from "styled-components";

enum LoadingSize {
	SMALL = "small",
	MEDIUM = "medium",
	LARGE = "large",
}

type LoadingProps = {
	className?: string;
	color?: keyof DefaultTheme["colors"] | (keyof DefaultTheme["colors"])[];
	size?: `${LoadingSize}`;
};

export const Loading = ({ className, color = ["main", "blue"], size = "medium" }: LoadingProps) => {
	const sizes: { [key in LoadingSize]: number | string } = {
		[LoadingSize.SMALL]: "1.6rem",
		[LoadingSize.MEDIUM]: "3.2rem",
		[LoadingSize.LARGE]: "4.8rem",
	};

	const timesLength = Array.isArray(color) ? color.length : 1;

	const times = [0].concat(
		new Array(timesLength)
			.fill(0)
			.map((_, index) => 1 / (index + 1))
			.reverse()
	);

	const rotate = [30].concat(
		new Array(timesLength)
			.fill(0)
			.map((_, index) => 30 + 360 / (index + 1))
			.reverse()
	);

	const borderTopColor = (() => {
		if (Array.isArray(color)) return color.map(c => theme.colors[c]).concat(theme.colors[color[0]]);
		return new Array(timesLength + 1).fill(0).map(() => theme.colors[color]);
	})();

	return (
		<Loader
			className={className}
			initial={{
				width: sizes[size],
				height: sizes[size],
				borderTopWidth: sizes[size] === sizes[LoadingSize.SMALL] ? 2 : undefined,
			}}
			animate={{
				rotate,
				borderTopColor,
			}}
			transition={{
				duration: 1,
				times,
				repeat: Infinity,
				repeatDelay: 0,
				ease: "linear",
			}}
		/>
	);
};
