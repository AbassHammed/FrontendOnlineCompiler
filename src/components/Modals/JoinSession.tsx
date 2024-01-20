import { firestore } from "@/firebase/firebase";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
type JoinSessionProps = {};

const JoinSession: React.FC<JoinSessionProps> = () => {
	const [inputs, setInputs] = useState({ sessionId: "", UserName: "" });
	const router = useRouter();
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

  const handleJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const { sessionId, userName } = inputs;
    if (!inputs.sessionId || !inputs.UserName) {
      toast("Please fill all fields", { position: "top-center", autoClose: 3000, theme: "dark" });
      return;
    }

    // Query for a session with the given sessionId
    const sessionsQuery = query(collection(firestore, "sessions"), where("sessionId", "==", inputs.sessionId));
    const querySnapshot = await getDocs(sessionsQuery);

    if (!querySnapshot.empty) {
      // Session exists
      const sessionDoc = querySnapshot.docs[0]; // Take the first document found with the sessionId
      const sessionData = sessionDoc.data();
      const filePath = sessionData.filePath;
      const sessionName = sessionData.sessionName;
      
      // Reference to the users sub-collection for the session
      const usersRef = collection(firestore, `sessions/${sessionDoc.id}/users`);
      // Add user to this session's users collection
      await addDoc(usersRef, {
        name: inputs.UserName,
        joinedAt: new Date()
      });

      // You may want to do something with filePath and sessionName, like storing them in state or passing to another component
      // Redirect to the session page or next relevant page with session details
		router.push({
			pathname: `/compiler/${inputs.sessionId}`,
			query: { filePath: sessionData.filePath, sessionName: sessionData.sessionName },
		});
    } else {
      // Session does not exist
      toast("Session ID not found", { position: "top-center", autoClose: 3000, theme: "dark" });
    }
  };
	return (
		<form className='space-y-6 px-6 pb-4' onSubmit={handleJoin}>
			<h3 className='text-xl font-medium text-white'>Join a session</h3>
			<div>
				<label htmlFor='sessionId' className='text-sm font-medium block mb-2 text-gray-300'>
					Your session ID
				</label>
				<input
					onChange={handleInputChange}
					type='sessionId'
					name='sessionId'
					id='sessionId'
					className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        '
					placeholder='25AZ7R9B'
				/>
            </div>
            <div>
				<label htmlFor='UserName' className='text-sm font-medium block mb-2 text-gray-300'>
					Your name
				</label>
				<input
					onChange={handleInputChange}
					type='UserName'
					name='UserName'
					id='UserName'
					className='
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        '
					placeholder='Coco jojo'
				/>
			</div>

			<button
				type='submit'
				className='w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s
            '
			>
				Join
			</button>
		</form>
	);
};
export default JoinSession;

