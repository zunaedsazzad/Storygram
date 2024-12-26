import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";

interface ImageUploadProps {
	onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onUpload = (result: any) => {
		onChange(result.info.secure_url);
	};

	return (
		<div className="w-full">
			<CldUploadWidget uploadPreset="profilePicture" onSuccess={onUpload}>
				{({ open }) => {
					return (
						<button
							type="button"
							onClick={() => open()}
							className="w-full flex items-center justify-center gap-2 rounded-md p-2 bg-indigo-700 hover:bg-indigo-600 transition-colors"
						>
							<Plus className="h-4 w-4 mr-2" />
							Change Profile Picture
						</button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
