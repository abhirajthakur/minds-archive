"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NotFound = () => {
	const pathname = usePathname();
	useEffect(() => {
		console.error(
			"404 Error: User attempted to access non-existent route:",
			pathname,
		);
	}, [pathname]);

	return (
		<div className="min-h-screen flex flex-col bg-white">
			<Navbar />
			<div className="flex-1 flex items-center justify-center py-20">
				<div className="text-center px-4 max-w-md">
					<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
						<span className="text-navy text-5xl font-bold">4</span>
						<span className="text-teal text-5xl font-bold">0</span>
						<span className="text-navy text-5xl font-bold">4</span>
					</div>
					<h1 className="text-3xl font-bold text-navy mb-4">Page Not Found</h1>
					<p className="text-gray mb-8">
						The page you are looking for doesn't exist or has been moved. Let's
						get you back on track.
					</p>
					<a href="/" className="btn-primary inline-flex items-center gap-2">
						<ArrowLeft size={18} />
						<span>Return to Home</span>
					</a>
				</div>
			</div>
			<Footer />
		</div>
	);
};

export default NotFound;
