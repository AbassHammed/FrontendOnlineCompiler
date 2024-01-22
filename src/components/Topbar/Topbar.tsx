import { auth } from "@/firebase/firebase";
import Link from "next/link";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import Image from "next/image";
import Timer from "../Timer/Timer";
import styled from "styled-components";
import Logout from "../Buttons/Logout";
import { firestore } from "@/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { toast } from "sonner";

type TopbarProps = {
	compilerPage?: boolean;
	sessionName?: string;
	sessionId?: string;
    UserId?: string
};

const TopLeftContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-items: center;
`;


const Topbar: React.FC<TopbarProps> = ({ compilerPage, sessionName, sessionId, UserId }) => {
	const [user] = useAuthState(auth);
	const setAuthModalState = useSetRecoilState(authModalState);
	const router = useRouter();

	const handleQuit = async () => {
		if (!sessionId) {
			toast.warning("Something Fishy");
			return;
		}
        if (!UserId) {
            toast.warning("An int error occured");
            return;
		}
		

        try {
            const userDocRef = doc(firestore, `sessions/${sessionId}/users`, UserId);
            await updateDoc(userDocRef, {
                connected: false,
                quitedAt: new Date()
            });

            router.push('/');
		} catch (error) {
			toast.error("Error quitting session");
        }
    };



	return (
			<nav className='flex h-[50px] w-full shrink-0 items-center bg-[#0f0f0f] text-dark-gray-7'>
				<div className='flex justify-between w-full px-5'>
					<TopLeftContainer>
						<Link href='/' className='h-[22px]'>
							<Image src='/Icon.png' alt='Logo' height={50} width={50} />
						</Link>
					</TopLeftContainer>

					<div className='hidden md:flex justify-center flex-1 mt-2'>
						<span className='font-bold'>{sessionName}</span>
					</div>

					<div className='flex items-center space-x-4 justify-end'>
						{!user && (
							<Link
								href='/auth'
								onClick={() => setAuthModalState(prev => ({ ...prev, isOpen: true, type: "login" }))}
							>
								<button className='bg-dark-fill-3 py-1 px-2 cursor-pointer rounded'>Sign In</button>
							</Link>
						)}
						{user && compilerPage && <Timer />}
						{user && (
							<div className='cursor-pointer group relative'>
								<Image src='/avatar.jpeg' alt='Avatar' width={30} height={30} className='rounded-full' />
								<div className='absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-dark-layer-1 text-brand-purple p-2 rounded shadow-lg z-40 group-hover:scale-100 scale-0 transition-all duration-300 ease-in-out'>
									<p className='text-sm'>{user.email}</p>
								</div>
							</div>
						)}
						<button
							onClick={handleQuit}
							className='bg-dark-fill-3 py-1.5 px-3 cursor-pointer rounded text-brand-purple hover:bg-dark-fill-2'
						>
							Quit
						</button>
						{user && <Logout />}
					</div>
				</div>
			</nav>

	);
};
export default Topbar;