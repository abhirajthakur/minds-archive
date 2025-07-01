// import { useState } from "react";
// import {
// 	Home,
// 	FileText,
// 	BookOpen,
// 	BarChart2,
// 	Settings,
// 	User,
// 	LogOut,
// 	ChevronLeft,
// 	ChevronRight,
// 	Bell,
// 	Search,
// 	Calendar,
// 	HelpCircle,
// 	MessageSquare,
// } from "lucide-react";
// import {
// 	TooltipProvider,
// 	Tooltip,
// 	TooltipContent,
// 	TooltipTrigger,
// } from "@workspace/ui/components/tooltip";
// import { usePathname, useRouter } from "next/navigation";
//
// type MenuItem = {
// 	name: string;
// 	icon: React.ElementType;
// 	path: string;
// 	badge?: number | string;
// 	tooltip?: string;
// };
//
// const primaryMenuItems: MenuItem[] = [
// 	{
// 		name: "Dashboard",
// 		icon: Home,
// 		path: "/dashboard",
// 		tooltip: "View main dashboard",
// 	},
// 	{
// 		name: "My Documents",
// 		icon: FileText,
// 		path: "/documents",
// 		badge: 5,
// 		tooltip: "Access your documents",
// 	},
// 	{
// 		name: "Document Chat",
// 		icon: MessageSquare,
// 		path: "/document-chat",
// 		tooltip: "Chat with your documents",
// 	},
// 	{
// 		name: "Study Assistant",
// 		icon: BookOpen,
// 		path: "/assistant",
// 		tooltip: "Get study help",
// 	},
// 	{
// 		name: "Analytics",
// 		icon: BarChart2,
// 		path: "/analytics",
// 		tooltip: "View your progress analytics",
// 	},
// ];
//
// const secondaryMenuItems: MenuItem[] = [
// 	{
// 		name: "Calendar",
// 		icon: Calendar,
// 		path: "/calendar",
// 		tooltip: "Check your schedule",
// 	},
// 	{
// 		name: "Notifications",
// 		icon: Bell,
// 		path: "/notifications",
// 		badge: "3",
// 		tooltip: "View notifications",
// 	},
// 	{
// 		name: "Settings",
// 		icon: Settings,
// 		path: "/settings",
// 		tooltip: "Adjust preferences",
// 	},
// 	{ name: "Help", icon: HelpCircle, path: "/help", tooltip: "Get assistance" },
// ];
//
// const DashboardSidebar = () => {
// 	const [collapsed, setCollapsed] = useState(false);
// 	const router = useRouter();
//   const pathname = usePathname();
//
// 	const toggleSidebar = () => {
// 		setCollapsed(!collapsed);
// 	};
//
// 	const renderMenuItem = (item: MenuItem) => (
// 		<li key={item.name}>
// 			<TooltipProvider delayDuration={collapsed ? 100 : 1000}>
// 				<Tooltip>
// 					<TooltipTrigger asChild>
// 						<a
// 							href={item.path}
// 							className={`flex items-center ${
// 								collapsed ? "justify-center" : "justify-start"
// 							} px-3 py-3 text-sm rounded-md ${
// 								pathname === item.path
// 									? "bg-primary text-primary-foreground"
// 									: "text-gray hover:bg-muted"
// 							} transition-colors relative`}
// 							onClick={(e) => {
// 								e.preventDefault();
// 								router.push(item.path);
// 							}}
// 							aria-label={item.name}
// 						>
// 							<item.icon size={collapsed ? 22 : 18} />
// 							{!collapsed && <span className="ml-3">{item.name}</span>}
//
// 							{item.badge && !collapsed && (
// 								<span className="ml-auto bg-accent/10 text-accent px-2 py-0.5 rounded-full text-xs font-medium">
// 									{item.badge}
// 								</span>
// 							)}
//
// 							{item.badge && collapsed && (
// 								<span className="absolute top-1 right-1 w-4 h-4 bg-accent text-white rounded-full text-xs flex items-center justify-center">
// 									{item.badge}
// 								</span>
// 							)}
// 						</a>
// 					</TooltipTrigger>
// 					{collapsed && (
// 						<TooltipContent side="right">
// 							{item.tooltip || item.name}
// 						</TooltipContent>
// 					)}
// 				</Tooltip>
// 			</TooltipProvider>
// 		</li>
// 	);
//
// 	return (
// 		<div
// 			className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 bg-sidebar border-r border-sidebar-border ${
// 				collapsed ? "w-20" : "w-64"
// 			}`}
// 		>
// 			<div className="flex items-center justify-between p-4 border-b border-sidebar-border">
// 				{!collapsed && (
// 					<div className="flex items-center gap-2">
// 						<div className="bg-primary text-primary-foreground font-bold text-xl w-8 h-8 rounded flex items-center justify-center">
// 							S
// 						</div>
// 						<span className="text-primary font-bold text-lg">StudySync</span>
// 					</div>
// 				)}
// 				{collapsed && (
// 					<div className="mx-auto bg-primary text-primary-foreground font-bold text-xl w-10 h-10 rounded flex items-center justify-center">
// 						S
// 					</div>
// 				)}
// 				<button
// 					onClick={toggleSidebar}
// 					className="p-1 rounded-md hover:bg-muted text-gray"
// 					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
// 				>
// 					{collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
// 				</button>
// 			</div>
//
// 			{!collapsed && (
// 				<div className="px-4 py-3">
// 					<div className="relative">
// 						<Search
// 							className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray"
// 							size={16}
// 						/>
// 						<input
// 							type="text"
// 							placeholder="Search..."
// 							className="w-full pl-9 pr-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
// 						/>
// 					</div>
// 				</div>
// 			)}
//
// 			<nav className="flex-1 overflow-y-auto py-4">
// 				<div className="px-3 mb-2">
// 					{!collapsed && (
// 						<p className="text-xs font-medium px-3 mb-1 text-gray">MAIN</p>
// 					)}
// 					<ul className="space-y-1">{primaryMenuItems.map(renderMenuItem)}</ul>
// 				</div>
//
// 				<div className="px-3 mt-6">
// 					{!collapsed && (
// 						<p className="text-xs font-medium px-3 mb-1 text-gray">TOOLS</p>
// 					)}
// 					<ul className="space-y-1">
// 						{secondaryMenuItems.map(renderMenuItem)}
// 					</ul>
// 				</div>
// 			</nav>
//
// 			<div className="p-4 border-t border-sidebar-border">
// 				<TooltipProvider>
// 					<Tooltip>
// 						<TooltipTrigger asChild>
// 							<div
// 								className={`flex ${collapsed ? "justify-center" : "items-center justify-between"}`}
// 							>
// 								{!collapsed && (
// 									<>
// 										<div className="flex items-center">
// 											<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
// 												<User size={18} className="text-gray" />
// 											</div>
// 											<div className="ml-3">
// 												<p className="text-sm font-medium text-primary">
// 													John Doe
// 												</p>
// 												<p className="text-xs text-gray">john@example.com</p>
// 											</div>
// 										</div>
// 										<button className="p-1 rounded-md hover:bg-muted text-gray">
// 											<LogOut size={18} />
// 										</button>
// 									</>
// 								)}
// 								{collapsed && (
// 									<button className="p-1 rounded-md hover:bg-muted text-gray">
// 										<LogOut size={20} />
// 									</button>
// 								)}
// 							</div>
// 						</TooltipTrigger>
// 						{collapsed && <TooltipContent side="right">Log Out</TooltipContent>}
// 					</Tooltip>
// 				</TooltipProvider>
// 			</div>
// 		</div>
// 	);
// };
//
// export default DashboardSidebar;

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
	ChevronLeft,
	ChevronRight,
	FileText,
	LogOut,
	MessageSquare,
	User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type MenuItem = {
	name: string;
	icon: React.ElementType;
	path: string;
	tooltip?: string;
};

const menuItems: MenuItem[] = [
	{
		name: "Documents",
		icon: FileText,
		path: "/documents",
		tooltip: "Access your documents",
	},
	{
		name: "Document Chat",
		icon: MessageSquare,
		path: "/document-chat",
		tooltip: "Chat with your documents",
	},
];

type DashboardSidebarProps = {
	onCollapsedChange?: (collapsed: boolean) => void;
};

const DashboardSidebar = ({ onCollapsedChange }: DashboardSidebarProps) => {
	const [collapsed, setCollapsed] = useState(true);
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		onCollapsedChange?.(collapsed);
	}, [collapsed, onCollapsedChange]);

	const toggleSidebar = () => {
		setCollapsed(!collapsed);
	};

	const renderMenuItem = (item: MenuItem) => (
		<li key={item.name}>
			<TooltipProvider delayDuration={collapsed ? 100 : 1000}>
				<Tooltip>
					<TooltipTrigger asChild>
						<a
							href={item.path}
							className={`flex items-center ${
								collapsed ? "justify-center" : "justify-start"
							} px-3 py-3 text-sm rounded-md ${
								pathname === item.path
									? "bg-primary text-primary-foreground"
									: "text-gray hover:bg-muted"
							} transition-colors relative`}
							onClick={(e) => {
								e.preventDefault();
								router.push(item.path);
							}}
							aria-label={item.name}
						>
							<item.icon size={collapsed ? 22 : 18} />
							{!collapsed && <span className="ml-3">{item.name}</span>}
						</a>
					</TooltipTrigger>
					{collapsed && (
						<TooltipContent side="right">
							{item.tooltip || item.name}
						</TooltipContent>
					)}
				</Tooltip>
			</TooltipProvider>
		</li>
	);

	return (
		<div
			className={`fixed inset-y-0 left-0 z-30 flex flex-col transition-all duration-300 bg-sidebar border-r border-sidebar-border ${
				collapsed ? "w-20" : "w-64"
			}`}
		>
			<div className="flex items-center justify-between p-4 border-b border-sidebar-border">
				{!collapsed && (
					<div className="flex items-center gap-2">
						<div className="bg-primary text-primary-foreground font-bold text-xl w-8 h-8 rounded flex items-center justify-center">
							S
						</div>
						<span className="text-primary font-bold text-lg">StudySync</span>
					</div>
				)}
				{collapsed && (
					<div className="mx-auto bg-primary text-primary-foreground font-bold text-xl w-10 h-10 rounded flex items-center justify-center">
						S
					</div>
				)}
				<button
					onClick={toggleSidebar}
					className="p-1 rounded-md hover:bg-muted text-gray"
					aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					{collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
				</button>
			</div>

			<nav className="flex-1 overflow-y-auto py-4">
				<div className="px-3 mb-2">
					<ul className="space-y-1">{menuItems.map(renderMenuItem)}</ul>
				</div>
			</nav>

			<div className="p-4 border-t border-sidebar-border">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<div
								className={`flex ${collapsed ? "justify-center" : "items-center justify-between"}`}
							>
								{!collapsed && (
									<>
										<div className="flex items-center">
											<div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
												<User size={18} className="text-gray" />
											</div>
											<div className="ml-3">
												<p className="text-sm font-medium text-primary">
													John Doe
												</p>
												<p className="text-xs text-gray">john@example.com</p>
											</div>
										</div>
										<button className="p-1 rounded-md hover:bg-muted text-gray">
											<LogOut size={18} />
										</button>
									</>
								)}
								{collapsed && (
									<button className="p-1 rounded-md hover:bg-muted text-gray">
										<LogOut size={20} />
									</button>
								)}
							</div>
						</TooltipTrigger>
						{collapsed && <TooltipContent side="right">Log Out</TooltipContent>}
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
};

export default DashboardSidebar;
