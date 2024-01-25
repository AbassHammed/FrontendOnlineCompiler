import React from 'react';
import Image from "next/image";
import styled from "styled-components";
import { useSetRecoilState } from 'recoil';
import { authModalState } from '@/atoms/authModalAtom';

type NavbarProps = {
  showSign?: boolean;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 5rem;
  background-color: #1A1A1A;
  color: white;
  position: relative;
`;

const TopLeftContainer = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  align-items: center;
`;

const LogoText = styled.h1`
  margin-left: 0.5rem;
  font-family: "Irish Grover", cursive;
`;

const SignInButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #610C9F;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: medium;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: rgb(77, 7, 125);
    color: rgb(179, 179, 179);
    border: 2px solid #610C9F;
  }
`;

const Navbar: React.FC<NavbarProps> = ({showSign}) => {
    const setAuthModalState = useSetRecoilState(authModalState)
  const handleClick = () => {
    setAuthModalState((prev) => ({ ...prev, isOpen: false, type: "login" }));
    setAuthModalState((prev) => ({ ...prev, isOpen: true }));
  };
    return (
        <Container>
            <TopLeftContainer>
                <Image src="/Icon.png" alt="LetsCode Logo" width={50} height={50} />
                <LogoText>LetsCode</LogoText>
            </TopLeftContainer>
            {(showSign && <SignInButton onClick={handleClick}>Sign In</SignInButton>)}
        </Container>
    );
}
export default Navbar;