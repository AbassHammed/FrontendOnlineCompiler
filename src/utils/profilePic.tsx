type ProfilePictureProps = {
    email: string | null | undefined;
};
const ProfilePicture: React.FC<ProfilePictureProps> = ({ email }) => {
    
    if (!email)
        return;
  const firstLetter = email.charAt(0).toUpperCase();

  const profilePicStyle = {
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    backgroundColor: '#801792',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px', 
    fontWeight: '300px',
  };

  return (
    <div style={profilePicStyle}>
      {firstLetter}
    </div>
  );
};

export default ProfilePicture;