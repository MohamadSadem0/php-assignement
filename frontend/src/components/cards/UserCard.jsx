const UserCard = ({ id, username, email, password, imageUrl }) => {
  return (
    <div className="relative max-w-[300px] bg-gradient-to-br from-slate-900 to-black shadow-lg rounded-xl flex-shrink-0 p-6 border border-slate-800 transform transition duration-500 hover:scale-105 hover:shadow-2xl hover:border-blue-600">
      <div className="flex justify-center mb-4">
        <div className="relative h-[100px] w-[100px] rounded-full bg-slate-800 flex items-center justify-center border-2 border-gray-500 shadow-lg">
          <img
            src={imageUrl}
            alt="User Profile"
            className="h-[90px] w-[90px] rounded-full object-cover"
          />
        </div>
      </div>
      <div className="text-center text-white space-y-2">
        <h2 className="text-xl font-bold tracking-wide">{username}</h2>
        <p className="text-sm font-semibold text-gray-300">ID: {id}</p>
        <p className="text-sm text-gray-400">Email: {email}</p>
      </div>
      <div className="mt-4 bg-gray-800 bg-opacity-90 p-3 rounded-md shadow-inner text-xs text-gray-200 break-words font-mono transform transition-transform duration-300 hover:-translate-y-1">
        <span className="font-semibold">Password:</span> {password}
      </div>
      <button className="mt-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all transform hover:translate-y-1 active:translate-y-2 shadow-md">
        Edit Password
      </button>
    </div>
  );
};

export default UserCard;
