import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Underline, TabItem, TabList } from "./styles";

import { theme } from "@utils/theme";

import type { Variants } from "framer-motion";

export enum TabOptions {
	OVERVIEW = "overview",
	CONTROL = "control",
}

type Tab = {
	path: string;
	value: TabOptions;
	text: string;
};

type TabsProps = {
	tabs: Tab[];
};

export const Tabs = ({ tabs }: TabsProps) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [selectedTab, setSelectedTab] = useState<TabOptions>(() => {
		const tab = tabs.find(tab => tab.path === location.pathname);
		return tab ? tab.value : TabOptions.CONTROL;
	});

	const getHandleItemClick = (tab: Tab) => () => {
		setSelectedTab(tab.value);
		navigate(tab.path);
	};

	const tabVariants: Variants = {
		selected: { background: theme.colors.lightGray },
		default: { background: "rgba(255, 255, 255, 1)" },
	};

	useEffect(() => {
		const tab = tabs.find(tab => tab.path === location.pathname);
		if (tab) setSelectedTab(tab.value);
	}, [location.pathname]);

	return (
		<nav>
			<TabList>
				{tabs.map(tab => (
					<TabItem
						key={tab.value}
						onClick={getHandleItemClick(tab)}
						initial="default"
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
