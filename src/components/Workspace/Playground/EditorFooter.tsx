import React from "react";
import { FaPlay } from "react-icons/fa";
import { IoCloudDownloadSharp } from "react-icons/io5";

type EditorFooterProps = {
	handleSubmit: () => void;
	handleGenerate: () => void;
};

const EditorFooter: React.FC<EditorFooterProps> = ({ handleSubmit , handleGenerate}) => {
	return (
		<div className='flex bg-dark-layer-1 absolute bottom-0 z-10 w-full'>
			<div className='mx-5 my-[10px] flex justify-between w-full'>
				<div className='mr-2 flex flex-1 flex-nowrap items-center space-x-4'>
					<button
						className='px-3 py-1.5 font-medium items-center transition-all focus:outline-none inline-flex text-sm text-white bg-dark-green-s hover:bg-green-3 rounded-lg'
						onClick={handleGenerate}
					>
						<IoCloudDownloadSharp className="mr-2"/>
						Export file
					</button>
				</div>
				<div className='ml-auto flex items-center space-x-4'>
					<button
						className='px-3 py-1.5 text-sm font-medium items-center whitespace-nowrap transition-all focus:outline-none inline-flex bg-dark-fill-3  hover:bg-dark-fill-2 text-dark-label-2 rounded-lg'
						onClick={handleSubmit}
					>
						<FaPlay  className="mr-2"/>
						Run
					</button>
				</div>
			</div>
		</div>
	);
};
export default EditorFooter;