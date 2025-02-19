

function SearchForm({
  setSearchText,
}: {
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <form className="w-full " onSubmit={(e) => e.preventDefault()}>
      <input
        onChange={(e) => {
          setSearchText(e.target.value);
        }}
        type="text"
        placeholder="Search your Chat"
        className="dark:bg-zinc-800  p-3 rounded-md outline-zinc-500 w-full"
      />
    </form>
  );
}

export default SearchForm;
