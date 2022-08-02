import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Underline, TabItem, TabList } from "./styles";

import type { Variants } from "framer-motion";

enum TabOptions {
	OVERVIEW = "overview",
	CONTROL = "control",
}

export const Tabs = () => {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(TabOptions.OVERVIEW);

	const tabs = [
		{ path: "/", value: TabOptions.OVERVIEW },
		{ path: "/monitor", value: TabOptions.CONTROL },
	];

	const getHandleItemClick = (tab: typeof tabs[0]) => () => {
		setSelectedTab(tab.value);
		navigate(tab.path);
	};

	const tabVariants: Variants = {
		selected: { background: "#E8E8E8" },
		default: { background: "rgba(255, 255, 255, 1)" },
	};

	return (
		<div>
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
							{tab.value}
							{tab.value === selectedTab ? <Underline layoutId="underline" /> : null}
						</TabItem>
					))}
				</TabList>
			</nav>
		</div>
	);
};
