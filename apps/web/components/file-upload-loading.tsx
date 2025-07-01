import { Progress } from "@workspace/ui/components/progress";
import { Loader2 } from "lucide-react";

interface FileUploadLoadingProps {
	isUploading: boolean;
	fileCount: number;
	uploadedCount: number;
}

const FileUploadLoading = ({
	isUploading,
	fileCount,
	uploadedCount,
}: FileUploadLoadingProps) => {
	if (!isUploading) {
		return null;
	}

	const progress = fileCount > 0 ? (uploadedCount / fileCount) * 100 : 0;

	return (
		<div className="space-y-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
			<div className="flex items-center space-x-3">
				<div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full">
					<Loader2 size={16} className="animate-spin text-blue-600" />
				</div>
				<div className="flex-1">
					<div className="flex items-center justify-between mb-1">
						<span className="text-sm font-medium text-blue-900 dark:text-blue-100">
							Uploading files...
						</span>
						<span className="text-sm text-blue-700 dark:text-blue-300">
							{uploadedCount} of {fileCount}
						</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>
			</div>
			<p className="text-xs text-blue-600 dark:text-blue-400">
				Please wait while your files are being uploaded and processed.
			</p>
		</div>
	);
};

export default FileUploadLoading;
