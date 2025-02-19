import ProfileImage from "../components/ProfileImage";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import Button from "../components/Button";
import api from "../api/axiosInterceptor";
import { customToast, customToastError } from "../lib/utils";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Loading } from "../components/Loading";
import { useQueryClient } from "@tanstack/react-query";

function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser, isError, isLoading, setCurrentUser } = useCurrentUser();
  const [uploading, setUploading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const client = useQueryClient();
  function handleClick() {
    fileInputRef.current?.click();
  }
  if (isLoading && !isError && !currentUser)
    return (
      <div className="h-full mt-5 w-full grid place-content-center">
        <div className="text-2xl">
          <Loading />
        </div>
      </div>
    );

  return (
    <main>
      <div className="flex justify-center items-center m-4">
        <ProfileImage src={currentUser?.profilePic as string} size={200} />
        <input
          onChange={(e) => {
            if (e.target.files?.length) {
              setProfilePic(e.target.files[0]);
              const reader = new FileReader();
              reader.onload = function (event) {
                setCurrentUser((pre) => {
                  return {
                    ...pre,
                    profilePic: event.target?.result,
                  } as typeof pre;
                });
              };
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
        />
        <button onClick={handleClick}>
          <Camera />
        </button>
      </div>
      <div className="w-full flex justify-center">
        <h1 className="text-2xl">{currentUser?.email}</h1>
      </div>
      <div className="w-full flex justify-center">
        <Button
          onClick={async () => {
            if (profilePic) {
              const formData = new FormData();
              formData.append("file", profilePic);
              setUploading(true);
              try {
                const response = await api.post(
                  "/api/users/profilePic/upload",
                  formData
                );
                if (response.status === 201) {
                  customToast("Image Uploaded Successfully!");
                  setProfilePic(null);
                  client.invalidateQueries({ queryKey: ["users"] });
                  return setUploading(false);
                }

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (error: unknown) {
                customToastError("Something went wrong!Please try later.");
                setUploading(false);
              }
            }
          }}
        >
          {uploading ? "Saving" : "Save"}
        </Button>
      </div>
    </main>
  );
}

export default Profile;
