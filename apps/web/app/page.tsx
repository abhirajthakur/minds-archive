import CTASection from "@/components/cta-section";
import FeatureSection from "@/components/feature-section";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import SocialProof from "@/components/social-proof";

export default function Page() {
	return (
		<div className="min-h-screen bg-white">
			<Navbar />
			<HeroSection />
			<FeatureSection />
			<SocialProof />
			<CTASection />
			<Footer />
		</div>
	);
}
