"use client";

import { AuthModals, AuthModalType } from "@/components/auth-modals";
import { cn } from "@workspace/ui/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	// Auth modal state
	const [authModalOpen, setAuthModalOpen] = useState(false);
	const [authModalType, setAuthModalType] = useState<AuthModalType>(null);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Handler for opening auth modals
	const openAuthModal = (type: AuthModalType) => {
		setAuthModalType(type);
		setAuthModalOpen(true);
		setIsMobileMenuOpen(false); // Close mobile menu when opening modal
	};

	return (
		<>
			<header
				className={cn(
					"fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-5",
					{
						// "bg-white/95 dark:bg-background/95 backdrop-blur-md shadow-sm py-3": isScrolled
						"bg-background/95 backdrop-blur-md shadow-sm py-3": isScrolled,
					},
				)}
			>
				<div className="container-tight flex items-center justify-between px-4 md:px-6">
					<a href="/" className="flex items-center gap-2">
						<div className="bg-primary text-primary-foreground font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center">
							M
						</div>
						<span className="text-foreground font-bold text-xl">
							MindsArchive
						</span>
					</a>

					<nav className="hidden md:flex items-center gap-8">
						<a href="#features" className="nav-link text-foreground">
							Features
						</a>
						<a href="#how-it-works" className="nav-link text-foreground">
							How It Works
						</a>
						<a href="#testimonials" className="nav-link text-foreground">
							Testimonials
						</a>
						<a href="#pricing" className="nav-link text-foreground">
							Pricing
						</a>
					</nav>

					<div className="hidden md:flex items-center gap-4">
						<button
							className="btn-outline"
							onClick={() => openAuthModal("login")}
						>
							Log In
						</button>
						<button
							className="btn-primary"
							onClick={() => openAuthModal("signup")}
						>
							Sign Up
						</button>
					</div>

					<button
						className="md:hidden text-foreground"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
					>
						{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>

				{/* Mobile menu */}
				{isMobileMenuOpen && (
					<div className="md:hidden absolute top-full left-0 right-0 bg-background border-t border-border animate-fade-in shadow-lg">
						<div className="flex flex-col p-4 space-y-3">
							<a
								href="#features"
								className="px-4 py-2 text-foreground hover:bg-muted rounded-md"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Features
							</a>
							<a
								href="#how-it-works"
								className="px-4 py-2 text-foreground hover:bg-muted rounded-md"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								How It Works
							</a>
							<a
								href="#testimonials"
								className="px-4 py-2 text-foreground hover:bg-muted rounded-md"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Testimonials
							</a>
							<a
								href="#pricing"
								className="px-4 py-2 text-foreground hover:bg-muted rounded-md"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								Pricing
							</a>
							<hr className="border-border" />
							<div className="flex flex-col space-y-2 pt-2">
								<button
									className="btn-outline w-full"
									onClick={() => openAuthModal("login")}
								>
									Log In
								</button>
								<button
									className="btn-primary w-full"
									onClick={() => openAuthModal("signup")}
								>
									Sign Up
								</button>
							</div>
						</div>
					</div>
				)}
			</header>

			<AuthModals
				open={authModalOpen}
				type={authModalType}
				onOpenChange={setAuthModalOpen}
				onChangeType={setAuthModalType}
			/>
		</>
	);
};

export default Navbar;
