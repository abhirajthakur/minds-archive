import { LoginForm, SignupForm } from "@/components/auth-form";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@workspace/ui/components/dialog";

export type AuthModalType = "login" | "signup" | null;

interface AuthModalsProps {
	open: boolean;
	type: AuthModalType;
	onOpenChange: (open: boolean) => void;
	onChangeType: (type: AuthModalType) => void;
}

export const AuthModals = ({
	open,
	type,
	onOpenChange,
	onChangeType,
}: AuthModalsProps) => {
	const handleChangeType = (newType: AuthModalType) => {
		onChangeType(newType);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md w-full p-0 overflow-hidden">
				<DialogHeader className="pt-6 px-6">
					<DialogTitle className="text-2xl font-bold text-center">
						{type === "login" ? "Welcome Back" : "Create Your Account"}
					</DialogTitle>
					<DialogDescription className="text-center text-gray">
						{type === "login"
							? "Log in to your StudySync account"
							: "Join StudySync to revolutionize your learning"}
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 pb-6">
					{type === "login" ? (
						<LoginForm onSwitchToSignup={() => handleChangeType("signup")} />
					) : (
						<SignupForm onSwitchToLogin={() => handleChangeType("login")} />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};
