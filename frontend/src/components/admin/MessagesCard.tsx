import Card from "./Card";
import useAllMessages from "../../hooks/admin/useAllMessages";
import { Loading } from "../Loading";
function MessagesCard() {
  const { data, isLoading } = useAllMessages();

  return (
    <Card title={"Messages"}>
      {isLoading && !data ? (
        <Loading />
      ) : (
        <p className="grid gap-x-3  w-full grid-cols-2">
          <span>Total Messages</span>
          <span>{data?.length}</span>
        </p>
      )}
    </Card>
  );
}

export default MessagesCard;
