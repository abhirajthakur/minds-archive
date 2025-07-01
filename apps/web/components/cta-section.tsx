import { ArrowRight } from "lucide-react";

const CTASection = () => {
	return (
		<section className="section bg-navy text-white relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
				<div className="absolute top-1/4 left-[10%] w-64 h-64 bg-teal/10 rounded-full blur-3xl"></div>
				<div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-lavender/10 rounded-full blur-3xl"></div>
			</div>

			<div className="container-tight relative z-10">
				<div className="max-w-4xl mx-auto text-center">
					<div className="mb-4">
						<span className="chip bg-white/10 text-white">
							Get Started Today
						</span>
					</div>

					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						Ready to Transform Your{" "}
						<span className="text-teal">Learning Experience?</span>
					</h2>

					<p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
						Join thousands of students who are already using StudySync to
						achieve better results with less study time.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<button className="bg-white hover:bg-gray-100 text-navy font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
							Start Free Trial
						</button>
						<button className="border border-white/30 hover:border-white text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group">
							<span>Schedule a Demo</span>
							<ArrowRight
								size={18}
								className="transform group-hover:translate-x-1 transition-transform"
							/>
						</button>
					</div>

					<div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-xl mx-auto">
						<p className="text-sm text-gray-300 mb-4">
							No credit card required. Free 14-day trial.
						</p>
						<form className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								placeholder="Enter your email"
								className="flex-1 bg-white/5 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal"
							/>
							<button className="bg-teal hover:bg-teal/90 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300">
								Get Started
							</button>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
};

export default CTASection;
