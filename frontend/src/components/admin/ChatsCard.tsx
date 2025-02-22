import Card from "./Card";

import { Loading } from "../Loading";
import useAllChats from "../../hooks/admin/useAllChats";

function ChatsCard() {
  const { data, isLoading } = useAllChats();

  return (
    <Card title={"Chats"}>
      {isLoading && !data ? (
        <Loading />
      ) : (
        <p className="grid gap-x-3  w-full grid-cols-2">
          <span>Total Chats</span>
          <span>{data?.length}</span>
        </p>
      )}
   
    </Card>
  );
}

export default ChatsCard;
