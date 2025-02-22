
import ChatsCard from "../../components/admin/ChatsCard";
import MessagesCard from "../../components/admin/MessagesCard";
import UserCard from "../../components/admin/UserCard";
function Dashboard() {
  return (
    <main className="flex justify-center w-full">
      <div className="grid w-[60%] p-3 gap-2  lg:grid-cols-2 grid-cols-1">
        <ChatsCard/>
        <MessagesCard/>
        <UserCard />
      </div>
    </main>
  );
}

export default Dashboard;
