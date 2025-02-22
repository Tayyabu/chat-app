import { Edit2, Trash2 } from "lucide-react";
import Button from "../../components/Button";
import { Loading } from "../../components/Loading";
import { useState } from "react";
import { User, useUsers } from "../../hooks/useUsers";
import { customToast, customToastError, isAuthorized } from "../../lib/utils";
import { SubmitHandler } from "react-hook-form";
import ProfileImage from "../../components/ProfileImage";
import UserForm, { UserFormInputs } from "../../components/admin/UserForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axiosInterceptor";
import { useCurrentUser } from "../../hooks/useCurrentUser";

function Users() {
  const [user, setUser] = useState<User>();
  const { data, isLoading } = useUsers();
  const { currentUser } = useCurrentUser();
  const client = useQueryClient();
  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/users/${id}`),
    onSuccess() {
      client.invalidateQueries({ queryKey: ["users"] });
      customToast("User Delete Successfully");
      setUser(undefined);
    },
    onError() {
      customToastError(
        deleteUserMutation.error?.message ?? "Something Went Wrong"
      );
      deleteUserMutation.reset();
    },
  });
  const updateUserMutation = useMutation({
    mutationFn: (data: UserFormInputs) => {
      return api.put(`/api/users/${user?.id}`, {
        ...data,
        roles: data.roles.split(","),
      });
    },
    onSuccess() {
      client.invalidateQueries({ queryKey: ["users"] });
      customToast("User Updated Successfully");
      setUser(undefined);
    },
    onError() {
      customToastError(
        updateUserMutation.error?.message ?? "Something Went Wrong"
      );
      updateUserMutation.reset();
    },
  });
  const onSubmit: SubmitHandler<UserFormInputs> = (data) => {
    updateUserMutation.mutate(data);
  };
  const usersRows = data?.map((user) => {
    return (
      currentUser?.id !== user.id && (
        <tr key={user.id}>
          <td className={`px-3  text-center border `}>
            {user.id.substring(0, 5)}
          </td>
          <td className="px-3 text-center border ">{user.email}</td>
          <td className="px-3 text-center border ">
            <ProfileImage size={50} src={user.profilePic} />
          </td>
          <td className="px-3 text-center border ">{user.roles.join(",")}</td>
          <td className="px-3   text-center border ">
            {isAuthorized(["Admin"]) && (
              <>
                <Button
                  onClick={() => {
                    deleteUserMutation.mutate(user.id);
                    // console.log(deleteMessageMutation.status);
                  }}
                  className="bg-red-500 mr-1 px-3 hover:bg-red-400"
                >
                  <Trash2 />
                </Button>
                <Button onClick={() => setUser(user)}>
                  <Edit2 />
                </Button>
              </>
            )}
          </td>
        </tr>
      )
    );
  });

  return (
    <div className="h-screen  ">
      <div className="container flex justify-center ">
        <h2 className="text-4xl mt-5 font-semibold px-5">Messages</h2>
      </div>
      {user && <UserForm onSubmit={onSubmit} setUser={setUser} user={user} />}
      {!data?.length && isLoading ? (
        <div className="h-full m-7 w-full grid place-content-center">
          <div className="text-2xl">
            <Loading />
          </div>
        </div>
      ) : !data?.length && !isLoading ? (
        <div className="container bg-zinc-800 w-full flex h-full items-center justify-center ">
          <h1>No User Found</h1>
        </div>
      ) : (
        <div className="w-full bg-zinc-800  ">
          <div className="w-full p-3 flex justify-center">
            <table className="bg-zinc-800  ">
              <thead>
                <tr>
                  <th className=" bg-green-500 border-0 rounded-tl-2xl ">#</th>
                  <th className=" bg-green-500 border-0 ">Email</th>
                  <th className=" bg-green-500 border-0 ">Profile Pic</th>
                  <th className=" bg-green-500 border-0  ">Roles</th>
                  <th className=" bg-green-500 border-0  rounded-tr-2xl">
                    Edit/Delete
                  </th>
                </tr>
              </thead>
              <tbody>{usersRows}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
