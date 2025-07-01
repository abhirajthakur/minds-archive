import { useState } from "react";
import {
	ArrowLeft,
	Settings,
	User,
	HelpCircle,
	Menu,
	X,
	BookOpen,
	MessageSquare,
	FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

interface ChatNavbarProps {
	documentCount?: number;
	activeDocumentCount?: number;
}

const ChatNavbar = ({
	documentCount = 0,
	activeDocumentCount = 0,
}: ChatNavbarProps) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const router = useRouter();

	return (
		<div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50">
			{/* Left Section */}
			<div className="flex items-center space-x-4">
				<Button
					variant="ghost"
					size="icon"
					onClick={() => router.push("/")}
					className="hover:bg-primary/10"
				>
					<ArrowLeft size={18} />
				</Button>

				<div className="flex items-center space-x-3">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
						<MessageSquare size={20} className="text-white" />
					</div>
					<div>
						<h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
							MindsArchive Chat
						</h1>
						<p className="text-sm text-muted-foreground">AI Study Assistant</p>
					</div>
				</div>
			</div>

			{/* Center Section - Document Status */}
			<div className="hidden md:flex items-center space-x-4">
				<div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-full">
					<FileText size={14} className="text-primary" />
					<span className="text-sm text-muted-foreground">
						{documentCount} docs • {activeDocumentCount} active
					</span>
				</div>
			</div>

			{/* Right Section */}
			<div className="flex items-center space-x-2">
				{/* Desktop Menu */}
				<div className="hidden md:flex items-center space-x-2">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => router.push("/documents")}
						className="hover:bg-primary/10"
					>
						<BookOpen size={18} />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="hover:bg-primary/10"
							>
								<User size={18} />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							<DropdownMenuItem onClick={() => router.push("/settings")}>
								<Settings size={16} className="mr-2" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem>
								<HelpCircle size={16} className="mr-2" />
								Help & Support
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem className="text-destructive">
								Sign Out
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				{/* Mobile Menu Button */}
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					{isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
				</Button>
			</div>

			{/* Mobile Menu Dropdown */}
			{isMobileMenuOpen && (
				<div className="absolute top-full left-0 right-0 bg-background border-b shadow-lg md:hidden">
					<div className="p-4 space-y-3">
						{/* Document Status for Mobile */}
						<div className="flex items-center justify-center space-x-2 bg-muted/50 px-3 py-2 rounded-full">
							<FileText size={14} className="text-primary" />
							<span className="text-sm text-muted-foreground">
								{documentCount} docs • {activeDocumentCount} active
							</span>
						</div>

						<div className="space-y-2">
							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => {
									router.push("/documents");
									setIsMobileMenuOpen(false);
								}}
							>
								<BookOpen size={16} className="mr-2" />
								My Documents
							</Button>

							<Button
								variant="ghost"
								className="w-full justify-start"
								onClick={() => {
									router.push("/settings");
									setIsMobileMenuOpen(false);
								}}
							>
								<Settings size={16} className="mr-2" />
								Settings
							</Button>

							<Button variant="ghost" className="w-full justify-start">
								<HelpCircle size={16} className="mr-2" />
								Help & Support
							</Button>

							<Button
								variant="ghost"
								className="w-full justify-start text-destructive hover:text-destructive"
							>
								Sign Out
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ChatNavbar;
