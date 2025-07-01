"use client";

import {
	Brain,
	Clock,
	FileText,
	LayoutGrid,
	MessageSquare,
	Search,
} from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
	{
		icon: <Brain size={24} className="text-teal" />,
		title: "AI-Powered Analysis",
		description:
			"Our intelligent system analyzes your content to extract key concepts, summarize information, and create personalized study materials.",
	},
	{
		icon: <FileText size={24} className="text-coral" />,
		title: "Multi-Source Integration",
		description:
			"Upload PDFs, presentations, documents, videos, and web articles - all in one place for comprehensive learning.",
	},
	{
		icon: <Search size={24} className="text-lavender" />,
		title: "Semantic Search",
		description:
			"Find exactly what you're looking for with our powerful semantic search that understands context and relationships.",
	},
	{
		icon: <MessageSquare size={24} className="text-teal" />,
		title: "Intelligent Assistant",
		description:
			"Ask questions, get explanations, and receive study recommendations from our AI assistant that understands your content.",
	},
	{
		icon: <LayoutGrid size={24} className="text-coral" />,
		title: "Knowledge Management",
		description:
			"Organize your learning materials with smart tagging, categorization, and interconnected knowledge mapping.",
	},
	{
		icon: <Clock size={24} className="text-lavender" />,
		title: "Time Optimization",
		description:
			"Save hours of study time with automated summarization, key concept extraction, and personalized learning paths.",
	},
];

const FeatureSection = () => {
	const sectionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const cards = sectionRef.current?.querySelectorAll(".feature-card");
						cards?.forEach((card, index) => {
							setTimeout(() => {
								card.classList.add("animate-scale-in");
							}, index * 100);
						});
						observer.disconnect();
					}
				});
			},
			{
				threshold: 0.1,
			},
		);

		if (sectionRef.current) {
			observer.observe(sectionRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<section id="features" className="section bg-gray-50" ref={sectionRef}>
			<div className="container-tight">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<div className="mb-4">
						<span className="chip bg-navy/10 text-navy">Key Features</span>
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
						Everything You Need for Smarter Learning
					</h2>
					<p className="text-gray text-lg">
						Our platform combines cutting-edge AI technology with proven
						learning techniques to help you study more effectively.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
					{features.map((feature, index) => (
						<div
							key={index}
							className="feature-card opacity-0"
							style={{ animationFillMode: "forwards" }}
						>
							<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
								{feature.icon}
							</div>
							<h3 className="text-xl font-semibold text-navy mb-2">
								{feature.title}
							</h3>
							<p className="text-gray">{feature.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeatureSection;
