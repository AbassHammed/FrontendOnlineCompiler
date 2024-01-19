import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import Timer from "../Timer/Timer";
import styled from "styled-components";
import Logout from "../Buttons/Logout";

type TopbarProps = {
	compilerPage?: boolean;
};

const TopLeftContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-items: center;
`;


const Topbar: React.FC<TopbarProps> = ({ compilerPage }) => {
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(authModalState);



	return (
		<nav className='relative flex h-[50px] w-full shrink-0 items-center px-5 bg-[#0f0f0f] text-dark-gray-7'>
			<div className={`flex w-full items-center justify-between `}>
				<TopLeftContainer>
					<Link href='/' className='h-[22px] flex-1'>
						<Image src='/Icon.png' alt='Logo' height={50} width={50} />
					</Link>
				</TopLeftContainer>

				{/* {compilerPage && (
					<div className='flex items-center gap-4 flex-1 justify-center'>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'
						>
							<FaChevronLeft />
						</div>
						<Link
							href='/'
							className='flex items-center gap-2 font-medium max-w-[170px] text-dark-gray-8 cursor-pointer'
						>
							<div>
								<BsList />
							</div>
							<p>Problem List</p>
						</Link>
						<div
							className='flex items-center justify-center rounded bg-dark-fill-3 hover:bg-dark-fill-2 h-8 w-8 cursor-pointer'

						>
							<FaChevronRight />
						</div>
					</div>
				)} */}

				<div className='flex items-center space-x-4 flex-1 justify-end'>

					{!user && (
						<Link
							href='/auth'
							onClick={() => setAuthModalState((prev) => ({ ...prev, isOpen: true, type: "login" }))}
						>
							<button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded '>Sign In</button>
						</Link>
					)}
					{user && compilerPage && <Timer />}
					{user && (
						<div className='cursor-pointer group relative'>
							<Image src='/avatar.jpeg' alt='Avatar' width={30} height={30} className='rounded-full' />
							<div
								className='absolute top-10 left-2/4 -translate-x-2/4  mx-auto bg-dark-layer-1 text-brand-purple p-2 rounded shadow-lg 
								z-40 group-hover:scale-100 scale-0 
								transition-all duration-300 ease-in-out'
							>
								<p className='text-sm'>{user.email}</p>
							</div>
						</div>
					)}
					<div>
						<a
							href='https://www.buymeacoffee.com/burakorkmezz'
							target='_blank'
							rel='noreferrer'
							className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-purple hover:bg-dark-fill-2'
						>
							Quit
						</a>
					</div>
					{user && <Logout />}
				</div>
			</div>
		</nav>
	);
};
export default Topbar;