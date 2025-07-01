import { LoginForm } from "@/components/auth-form";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

const Login = () => {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Navbar />
			<div className="flex-1 flex items-center justify-center px-4 py-20">
				<LoginForm />
			</div>
			<Footer />
		</div>
	);
};

export default Login;
