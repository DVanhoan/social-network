import { useQuery } from "@tanstack/react-query";

const useConversations = (userId) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/conversations/all/${userId}`);
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });
};

export default useConversations;
