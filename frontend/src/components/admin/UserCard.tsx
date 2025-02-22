import { useUsers } from "../../hooks/useUsers";
import { Loading } from "../Loading";
import Card from "./Card";
const UserCard = () => {
  const { isLoading, data } = useUsers();
  return (
    <Card title={"Users"}>
      {isLoading && !data ? (
        <Loading />
      ) : (
        <p className="grid gap-x-3 pb-3 w-full grid-cols-2">
          <span>Admin Users</span>
          <span>
            {" "}
            {data?.filter((user) => user.roles.includes("Admin")).length}
          </span>
          <span>Staff Only Users</span>
          <span>
            {
              data?.filter(
                (user) =>
                  !user.roles.includes("Admin") && user.roles.includes("Staff")
              ).length
            }
          </span>
          <span>Only Users</span>
          <span>
            {
              data?.filter(
                (user) =>
                  !user.roles.includes("Admin") && !user.roles.includes("Staff")
              ).length
            }
          </span>
          <span>Total</span>
          <span>{data?.length}</span>
        </p>
      )}
    </Card>
  );
};

export default UserCard;
