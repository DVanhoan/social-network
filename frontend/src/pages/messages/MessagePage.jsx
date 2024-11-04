import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";

import useConversations from "../../hooks/useConversations";

import datas from "../../utils/data";

const MessagesPage = () => {
  const [text, setText] = useState("");

  const { data: frendships, isLoading } = useQuery({
    queryKey: ["frendships"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/frendships");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { id: userId } = useParams();

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    refetch,
  } = useConversations(userId);

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  console.log(conversations);
  return (
    <>
      <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <p className="font-bold">Messages</p>
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="p-2 md:p-3 cursor-pointer rounded-md hover:bg-gray-600"
            >
              <IoSettingsOutline className="w-5 h-5 md:w-6 md:h-6" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-44 md:w-52"
              style={{ right: "0", left: "auto" }}
            >
              <li>
                <a>Hello world</a>
              </li>
            </ul>
          </div>
        </div>
        {/* search */}
        <div className="flex items-center gap-2 border-b border-gray-700 p-2">
          <FaSearch className="text-gray-500 w-6 h-6" />
          <textarea
            className="textarea w-full p-2 text-lg resize-none border-none focus:outline-none"
            style={{ height: "40px" }}
            placeholder="Search..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {isLoading ||
          (isLoadingConversations && (
            <div className="flex justify-center h-full items-center">
              <LoadingSpinner size="lg" />
            </div>
          ))}
        {frendships?.length === 0 && (
          <div className="text-center p-4 font-bold">No conversations 🤔</div>
        )}

        <div className="flex flex-col gap-4 border-b border-gray-700">
          <ul className="list-none p-0">
            <div className="flex gap-4 overflow-x-auto whitespace-nowrap py-4">
              <ul className="flex list-none p-0">
                {datas.map((story, index) => (
                  <li key={index} className="flex-shrink-0 mr-4">
                    <div className="flex items-center gap-3 ml-2">
                      <img
                        src={story.profileImg || "/avatar-placeholder.png"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      {/* <div className="flex flex-col">
                        <span className="font-bold">{story.username}</span>
                        <span className="text-sm text-gray-500">
                          {story.time}
                        </span>
                      </div> */}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </ul>
        </div>
        {frendships?.map((friend) => (
          <div className="border-b border-gray-700" key={friend._id}>
            <div className="flex gap-4 items-center p-4 border-b border-gray-700">
              <Link to={`/profile/`} className="flex items-center gap-3 w-full">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={friend.profileImg || "/avatar-placeholder.png"}
                      alt={`${friend.fullName}'s profile`}
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center w-full">
                  <span className="font-bold text-base">{friend.fullName}</span>
                  <span className="text-gray-500 truncate">hjsads</span>
                </div>
                {/*<div className="text-gray-500 text-sm whitespace-nowrap">*/}
                {/*    {conversation.timestamp}*/}
                {/*</div>*/}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default MessagesPage;
