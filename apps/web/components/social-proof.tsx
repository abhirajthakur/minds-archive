"use client";

import { useEffect, useRef } from "react";

const universities = [
	{ name: "Stanford University", initials: "SU" },
	{ name: "MIT", initials: "MIT" },
	{ name: "Harvard", initials: "H" },
	{ name: "UC Berkeley", initials: "UCB" },
	{ name: "Oxford University", initials: "OU" },
	{ name: "Cambridge", initials: "C" },
];

const testimonials = [
	{
		quote:
			"StudySync has completely transformed how I prepare for exams. The AI study assistant feels like having a personal tutor available 24/7.",
		name: "Alex Johnson",
		role: "Computer Science Student",
		university: "Stanford University",
		avatar: "A",
	},
	{
		quote:
			"The semantic search feature saved me countless hours when working on my thesis. I can find exactly what I need across hundreds of research papers.",
		name: "Priya Sharma",
		role: "PhD Candidate",
		university: "MIT",
		avatar: "P",
	},
	{
		quote:
			"As an educator, I've seen a marked improvement in student engagement and comprehension when they use StudySync for collaborative learning.",
		name: "Dr. Michael Chen",
		role: "Associate Professor",
		university: "Harvard",
		avatar: "M",
	},
];

const stats = [
	{ value: "3.8M+", label: "Active Students" },
	{ value: "94%", label: "Improved Grades" },
	{ value: "12+", label: "Study Time Saved" },
];

const SocialProof = () => {
	const testimonialRef = useRef<HTMLDivElement>(null);
	const statsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observerOptions = {
			threshold: 0.2,
			rootMargin: "0px 0px -100px 0px",
		};

		const testimonialObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const cards =
						testimonialRef.current?.querySelectorAll(".testimonial-card");
					cards?.forEach((card, index) => {
						setTimeout(() => {
							card.classList.add("animate-fade-in");
						}, index * 200);
					});
					testimonialObserver.disconnect();
				}
			});
		}, observerOptions);

		const statsObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const statItems = statsRef.current?.querySelectorAll(".stat-item");
					statItems?.forEach((item, index) => {
						setTimeout(() => {
							item.classList.add("animate-scale-in");
						}, index * 200);
					});
					statsObserver.disconnect();
				}
			});
		}, observerOptions);

		if (testimonialRef.current) {
			testimonialObserver.observe(testimonialRef.current);
		}

		if (statsRef.current) {
			statsObserver.observe(statsRef.current);
		}

		return () => {
			testimonialObserver.disconnect();
			statsObserver.disconnect();
		};
	}, []);

	return (
		<section id="testimonials" className="section bg-white">
			<div className="container-tight">
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-20">
					<div className="flex-1">
						<div className="mb-4">
							<span className="chip bg-coral/10 text-coral">Trusted By</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
							Top Academic Institutions Worldwide
						</h2>
						<p className="text-gray text-lg mb-8">
							StudySync is being used by students and educators at leading
							universities around the world to enhance learning outcomes.
						</p>

						<div className="grid grid-cols-3 gap-4">
							{universities.map((uni, index) => (
								<div
									key={index}
									className="h-20 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center"
								>
									<div className="w-10 h-10 rounded-md bg-navy text-white font-bold flex items-center justify-center">
										{uni.initials}
									</div>
									<span className="ml-2 text-navy font-medium hidden md:inline-block">
										{uni.name}
									</span>
								</div>
							))}
						</div>
					</div>

					<div className="flex-1" ref={statsRef}>
						<div className="mb-4">
							<span className="chip bg-lavender/10 text-lavender">
								Platform Impact
							</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
							Real Results for Students
						</h2>
						<p className="text-gray text-lg mb-8">
							Our platform is designed to help students achieve better results
							with less time spent studying.
						</p>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							{stats.map((stat, index) => (
								<div
									key={index}
									className="stat-item opacity-0 text-center p-6 rounded-lg border border-gray-100 hover:border-navy/20 transition-all duration-300 bg-white shadow-sm hover:shadow"
									style={{ animationFillMode: "forwards" }}
								>
									<div className="text-3xl md:text-4xl font-bold text-navy mb-2">
										{stat.value}
									</div>
									<div className="text-gray">{stat.label}</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div ref={testimonialRef}>
					<div className="text-center max-w-3xl mx-auto mb-12">
						<div className="mb-4">
							<span className="chip bg-teal/10 text-teal">Testimonials</span>
						</div>
						<h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
							What Our Users Say
						</h2>
						<p className="text-gray text-lg">
							Hear from students and educators who have transformed their
							learning experience with StudySync.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{testimonials.map((testimonial, index) => (
							<div
								key={index}
								className="testimonial-card opacity-0 p-6 rounded-xl border border-gray-100 hover:border-navy/20 transition-all duration-300 bg-white shadow-sm hover:shadow"
								style={{ animationFillMode: "forwards" }}
							>
								<div className="flex items-start mb-4">
									<div className="w-12 h-12 rounded-full bg-teal flex items-center justify-center text-white font-bold text-lg mr-3">
										{testimonial.avatar}
									</div>
									<div>
										<h4 className="font-semibold text-navy">
											{testimonial.name}
										</h4>
										<p className="text-sm text-gray">
											{testimonial.role}, {testimonial.university}
										</p>
									</div>
								</div>
								<p className="text-gray">{testimonial.quote}</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default SocialProof;
