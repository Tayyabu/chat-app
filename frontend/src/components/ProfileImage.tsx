import { useCurrentUser } from "../hooks/useCurrentUser";


const ProfileImage = ({ size ,src}: { size: number,src:string }) => {
  const { currentUser, isLoading } = useCurrentUser();
  if (isLoading && !currentUser) {
    return (
      <img
        src={`https://placehold.co/${size}x${size}`}
        loading="lazy"
        width={size.valueOf()}
        title="Profile"
        className="rounded-full mx-3"
      />
    );
  }
  return (
    <img
      src={src}
      loading="lazy"
      width={size.valueOf()}
      title="Profile"
      className="rounded-full mx-3"
    />
  );
};
//
export default ProfileImage;
