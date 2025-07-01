import { Play } from "lucide-react";

const HeroSection = () => {
	return (
		// <section className="pt-28 pb-20 md:pt-36 md:pb-28 hero-gradient relative overflow-hidden">
		<section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-background/60 dark:bg-transparent relative overflow-hidden">
			<div className="container-tight px-4 md:px-6 relative z-10">
				<div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
					<div className="inline-block animate-fade-in mb-4">
						{/* <span className="chip bg-lavender/10 text-lavender"> */}
						<span className="chip bg-lavender/20 text-lavender">
							AI-Powered Learning Platform
						</span>
					</div>

					{/* <h1 */}
					{/* 	className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6 animate-reveal" */}
					{/* 	style={{ "--reveal-delay": 1 } as React.CSSProperties} */}
					{/* > */}

					<h1
						className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-reveal"
						style={{ "--reveal-delay": 1 } as React.CSSProperties}
					>
						Transform Your Study <br className="hidden md:block" />
						<span className="text-teal">with AI</span>
					</h1>

					{/* <p */}
					{/* 	className="text-gray text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-reveal" */}
					{/* 	style={{ "--reveal-delay": 2 } as React.CSSProperties} */}
					{/* > */}
					<p
						className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-reveal"
						style={{ "--reveal-delay": 2 } as React.CSSProperties}
					>
						Upload, analyze, and master your learning materials with our
						intelligent platform that helps you understand complex topics faster
						and more effectively.
					</p>

					<div
						className="flex flex-col sm:flex-row justify-center gap-4 animate-reveal"
						style={{ "--reveal-delay": 3 } as React.CSSProperties}
					>
						<button className="btn-primary text-base">Start Free Trial</button>
						<button className="btn-outline flex items-center justify-center gap-2 text-base">
							{/* <Play size={18} className="text-navy" /> */}
							<Play size={18} className="text-primary" />

							<span>Watch Demo</span>
						</button>
					</div>
				</div>

				<div
					className="relative max-w-5xl mx-auto animate-reveal"
					style={{ "--reveal-delay": 4 } as React.CSSProperties}
				>
					{/* <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-white"> */}
					{/* 	<div className="bg-gray-200 w-full h-full flex items-center justify-center"> */}
					{/* 		<div className="glass bg-white/50 backdrop-blur-lg py-8 px-6 rounded-2xl border border-white/20 shadow-lg max-w-2xl"> */}

					<div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl border border-border">
						<div className="bg-card w-full h-full flex items-center justify-center">
							<div className="glass bg-white/10 backdrop-blur-lg py-8 px-6 rounded-2xl border border-white/10 shadow-lg max-w-2xl">
								<div className="flex gap-4 mb-4">
									{/* <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold"> */}
									{/* 	AI */}
									{/* </div> */}

									<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
										AI
									</div>
									<div className="flex-1">
										{/* <div className="bg-gray-100 rounded-2xl p-4"> */}
										{/* 	<p className="text-navy"> */}
										{/* 		I've analyzed your uploaded materials and found the key */}
										{/* 		concepts you need to focus on for your upcoming exam... */}
										{/* 	</p> */}
										<div className="bg-muted rounded-2xl p-4">
											<p className="text-foreground">
												I've analyzed your uploaded materials and found the key
												concepts you need to focus on for your upcoming exam...
											</p>
										</div>
										<div className="h-8"></div>
										{/* <div className="bg-teal/10 rounded-2xl p-4"> */}
										{/* 	<p className="text-navy"> */}
										{/* 		Can you help me understand the relationship between the */}
										{/* 		theories in chapter 4 and the case studies? */}
										{/* 	</p> */}
										<div className="bg-teal/20 rounded-2xl p-4">
											<p className="text-foreground">
												Can you help me understand the relationship between the
												theories in chapter 4 and the case studies?
											</p>
										</div>
									</div>
								</div>
								{/* <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"> */}
								<div className="w-full h-1 bg-muted rounded-full overflow-hidden">
									<div className="h-full w-3/4 bg-teal animate-pulse-slow"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Decorative elements */}
					{/* <div */}
					{/* 	className="absolute -top-6 -left-6 w-20 h-20 bg-lavender/10 rounded-full animate-float" */}
					{/* 	style={{ animationDelay: "0.5s" }} */}
					{/* ></div> */}
					{/* <div */}
					{/* 	className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal/10 rounded-full animate-float" */}
					{/* 	style={{ animationDelay: "1.5s" }} */}
					{/* ></div> */}

					<div
						className="absolute -top-6 -left-6 w-20 h-20 bg-lavender/20 rounded-full animate-float"
						style={{ animationDelay: "0.5s" }}
					></div>
					<div
						className="absolute -bottom-4 -right-4 w-16 h-16 bg-teal/20 rounded-full animate-float"
						style={{ animationDelay: "1.5s" }}
					></div>
				</div>

				{/* Social proof strip */}
				{/* <div */}
				{/* 	className="mt-12 bg-white/50 backdrop-blur-sm rounded-xl p-6 animate-reveal" */}
				{/* 	style={{ "--reveal-delay": 5 } as React.CSSProperties} */}
				{/* > */}
				<div
					className="mt-12 bg-card/50 backdrop-blur-sm rounded-xl p-6 animate-reveal"
					style={{ "--reveal-delay": 5 } as React.CSSProperties}
				>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
						<div className="text-center">
							<div className="text-2xl font-bold text-foreground">50,000+</div>
							<div className="text-muted-foreground text-sm">Active Users</div>
							{/* <div className="text-2xl font-bold text-navy">50,000+</div> */}
							{/* <div className="text-gray text-sm">Active Users</div> */}
						</div>
						<div className="text-center">
							{/* <div className="text-2xl font-bold text-navy">4.8/5</div> */}
							{/* <div className="text-gray text-sm">Average Rating</div> */}

							<div className="text-2xl font-bold text-foreground">4.8/5</div>
							<div className="text-muted-foreground text-sm">
								Average Rating
							</div>
						</div>
						<div className="col-span-2 flex justify-around gap-4">
							{/* <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold"> */}
							{/* 	YALE */}
							{/* </div> */}
							{/* <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold"> */}
							{/* 	MIT */}
							{/* </div> */}
							{/* <div className="w-16 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold"> */}
							{/* 	UCLA */}
							{/* </div> */}
							<div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold">
								YALE
							</div>
							<div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold">
								MIT
							</div>
							<div className="w-16 h-8 bg-muted rounded flex items-center justify-center text-xs font-bold">
								UCLA
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Background decorative elements */}
			{/* <div className="absolute top-1/4 right-[5%] w-64 h-64 bg-teal/5 rounded-full blur-3xl"></div> */}
			{/* <div className="absolute bottom-1/4 left-[5%] w-72 h-72 bg-lavender/5 rounded-full blur-3xl"></div> */}
			<div className="absolute top-1/4 right-[5%] w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>
			<div className="absolute bottom-1/4 left-[5%] w-72 h-72 bg-lavender/10 rounded-full blur-3xl"></div>
		</section>
	);
};

export default HeroSection;
