"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AuthFormProps {
	onSwitchToSignup?: () => void;
	onSwitchToLogin?: () => void;
}

export const LoginForm = ({ onSwitchToSignup }: AuthFormProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		await authClient.signIn.email({
			email,
			password,
			callbackURL: "/chat",
		});
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray mb-1"
					>
						Email
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail size={18} className="text-gray" />
						</div>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="bg-gray-50 border border-gray-200 text-gray rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
							placeholder="you@example.com"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray mb-1"
					>
						Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock size={18} className="text-gray" />
						</div>
						<input
							id="password"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="bg-gray-50 border border-gray-200 text-gray rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff size={18} className="text-gray" />
							) : (
								<Eye size={18} className="text-gray" />
							)}
						</button>
					</div>
				</div>

				<div className="flex items-center justify-between">
					<div className="flex items-center">
						<input
							id="remember-me"
							type="checkbox"
							className="h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
						/>
						<label
							htmlFor="remember-me"
							className="ml-2 block text-sm text-gray"
						>
							Remember me
						</label>
					</div>
					<Link
						href="#"
						className="text-sm font-medium text-teal hover:text-teal/80"
					>
						Forgot password?
					</Link>
				</div>

				<Button
					type="submit"
					className="btn-primary w-full flex items-center justify-center gap-2"
				>
					<LogIn size={18} />
					<span>Sign in</span>
				</Button>
			</form>

			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray">Or continue with</span>
					</div>
				</div>

				<div className="mt-6 flex justify-center">
					<Button
						type="button"
						className="inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray hover:bg-gray-50 w-full"
						onClick={async () => {
							const data = await authClient.signIn.social({
								provider: "google",
								callbackURL: "/chat",
							});
							console.log(data);
						}}
					>
						<Image
							src="/google.svg"
							alt="Google Login"
							width={24}
							height={24}
							className="object-contain"
						/>
						<span>Continue with Google</span>
					</Button>
				</div>
			</div>

			<p className="mt-8 text-center text-sm text-gray">
				Don't have an account?{" "}
				<button
					onClick={onSwitchToSignup}
					className="font-medium text-teal hover:text-teal/80"
				>
					Sign up
				</button>
			</p>
		</div>
	);
};

export const SignupForm = ({ onSwitchToLogin }: AuthFormProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle signup logic here
		console.log("Signup attempt with:", formData);
	};

	return (
		<div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray mb-1"
					>
						Email
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail size={18} className="text-gray" />
						</div>
						<input
							id="email"
							name="email"
							type="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="bg-gray-50 border border-gray-200 text-gray rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
							placeholder="you@example.com"
						/>
					</div>
				</div>

				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray mb-1"
					>
						Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock size={18} className="text-gray" />
						</div>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"}
							value={formData.password}
							onChange={handleChange}
							required
							className="bg-gray-50 border border-gray-200 text-gray rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="absolute inset-y-0 right-0 pr-3 flex items-center"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff size={18} className="text-gray" />
							) : (
								<Eye size={18} className="text-gray" />
							)}
						</button>
					</div>
				</div>

				<div>
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray mb-1"
					>
						Confirm Password
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock size={18} className="text-gray" />
						</div>
						<input
							id="confirmPassword"
							name="confirmPassword"
							type={showPassword ? "text" : "password"}
							value={formData.confirmPassword}
							onChange={handleChange}
							required
							className="bg-gray-50 border border-gray-200 text-gray rounded-lg block w-full pl-10 p-2.5 focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent"
							placeholder="••••••••"
						/>
					</div>
				</div>

				<div className="flex items-start">
					<div className="flex items-center h-5">
						<input
							id="terms"
							type="checkbox"
							required
							className="h-4 w-4 text-teal focus:ring-teal border-gray-300 rounded"
						/>
					</div>
					<div className="ml-3 text-sm">
						<label htmlFor="terms" className="text-gray">
							I agree to the{" "}
							<a href="#" className="text-teal hover:text-teal/80">
								Terms of Service
							</a>{" "}
							and{" "}
							<a href="#" className="text-teal hover:text-teal/80">
								Privacy Policy
							</a>
						</label>
					</div>
				</div>

				<button type="submit" className="btn-primary w-full">
					Create Account
				</button>
			</form>

			<div className="mt-6">
				<div className="relative">
					<div className="absolute inset-0 flex items-center">
						<div className="w-full border-t border-gray-200"></div>
					</div>
					<div className="relative flex justify-center text-sm">
						<span className="px-2 bg-white text-gray">Or sign up with</span>
					</div>
				</div>

				<div className="mt-6 flex justify-center">
					<button
						type="button"
						className="inline-flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-gray hover:bg-gray-50 w-full"
						onClick={async () => {
							const data = await authClient.signIn.social({
								provider: "google",
								callbackURL: "/chat",
							});
							console.log(data);
						}}
					>
						<Image
							src="/google.svg"
							alt="Google Login"
							width={24}
							height={24}
							className="object-contain"
						/>
						<span>Continue with Google</span>
					</button>
				</div>
			</div>

			<p className="mt-8 text-center text-sm text-gray">
				Already have an account?{" "}
				<button
					onClick={onSwitchToLogin}
					className="font-medium text-teal hover:text-teal/80"
				>
					Sign in
				</button>
			</p>
		</div>
	);
};
