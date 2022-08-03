import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Underline, TabItem, TabList } from "./styles";

import { theme } from "@utils/theme";

import type { Variants } from "framer-motion";

export enum TabOptions {
	OVERVIEW = "overview",
	CONTROL = "control",
}

export const Tabs = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(TabOptions.OVERVIEW);

	const tabs = [
		{ path: "/", value: TabOptions.OVERVIEW, text: "Monitoramento" },
		{ path: `/${TabOptions.CONTROL}`, value: TabOptions.CONTROL, text: "Controle" },
	];

	const getHandleItemClick = (tab: typeof tabs[0]) => () => {
		setSelectedTab(tab.value);
		navigate(tab.path);
	};

	const tabVariants: Variants = {
		selected: { background: theme.colors.lightGray },
		default: { background: "rgba(255, 255, 255, 1)" },
	};

	return (
		<nav>
			<TabList>
				{tabs.map(tab => (
					<TabItem
						key={tab.value}
						onClick={getHandleItemClick(tab)}
						animate={tab.value === selectedTab ? "selected" : "default"}
						transition={{ ease: "easeOut", duration: 0.5 }}
						variants={tabVariants}
					>
						{tab.text}
						{tab.value === selectedTab ? <Underline layoutId="underline" /> : null}
					</TabItem>
				))}
			</TabList>
		</nav>
	);
};
