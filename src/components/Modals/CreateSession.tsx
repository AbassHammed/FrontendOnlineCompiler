import React, { useCallback, useState } from 'react';

import { useRouter } from 'next/router';

import { auth, firestore, storage } from '@/firebase/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaRegClipboard } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10000000; // 10MB
const FILE_TYPE = 'application/pdf';

const CreateSession = () => {
  const [pdfFile, setPdfFile] = useState<File>();
  const [sessionId, setSessionId] = useState('');
  const [progressUpload, setProgressUpload] = useState(0);
  const [inputs, setInputs] = useState({ sessionName: '' });
  const [user] = useAuthState(auth);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const generateSessionId = () => Math.random().toString(36).slice(-8).toUpperCase();

  const handleGenerateSessionId = () => {
    setSessionId(generateSessionId());
  };

  const handleInputChange = useCallback((e: any) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSelectedFile = (files: FileList | null) => {
    if (!files || files.length === 0) {
      return toast.warning('No file selected');
    }
    const file = files[0];

    if (file.size > MAX_FILE_SIZE || file.type !== FILE_TYPE) {
      return toast.warning('Invalid file. Only PDF up to 10MB.');
    }
    setPdfFile(file);
  };

  const handleUploadFile = async () => {
    if (!pdfFile) {
      return;
    }

    const uniqueId = uuidv4();
    const storageRef = ref(storage, `pdfFiles/${uniqueId}-${pdfFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pdfFile);

    try {
      const snapshot = await uploadTask;
      setProgressUpload((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      toast.error('Upload failed');
      throw error;
    }
  };

  const handleCreate = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    if (!user) {
      return toast.error('No user logged in');
    }
    if (!inputs.sessionName) {
      return toast.warning('Please fill all fields');
    }

    try {
      const filePath = await handleUploadFile();
      await addDoc(collection(firestore, 'sessions'), {
        userId: user.email,
        sessionName: inputs.sessionName,
        sessionId: sessionId || generateSessionId(),
        filePath,
        timestamp: serverTimestamp(),
      });
      router.push('/Dashboard');
    } catch (e) {
      toast.error('A problem when saving your data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => setPdfFile(undefined);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleCreate}>
      <h3 className="text-xl font-medium text-white">Create a session</h3>
      <div>
        <label htmlFor="sessionName" className="text-sm font-medium block mb-2 text-gray-300">
          Give your session a name
        </label>
        <input
          onChange={handleInputChange}
          type="text"
          name="sessionName"
          id="sessionName"
          className="
            border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5
            bg-gray-600 border-gray-500 placeholder-gray-400 text-white
        "
          placeholder="TP Algorithmique"
        />
      </div>

      <div>
        <label htmlFor="sessionId" className="text-sm font-medium block mb-2 text-gray-300">
          Session ID
        </label>
        <div className="relative flex items-center">
          <input
            readOnly
            value={sessionId}
            type="text"
            name="sessionId"
            id="sessionId"
            className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pr-10
						bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            placeholder="Session ID"
          />
          <FaRegClipboard
            className="absolute right-3 text-white cursor-pointer"
            onClick={handleGenerateSessionId}
          />
        </div>
      </div>

      <div className="container mx-auto mt-5">
        <div className="max-w-lg mx-auto">
          <input
            className="block w-full text-sm text-gray-500
								file:mr-4 file:py-2 file:px-4
								file:rounded-full file:border-0
								file:text-sm file:font-semibold
								file:bg-violet-50 file:text-violet-700
								hover:file:bg-violet-100"
            type="file"
            placeholder="Select file to upload"
            accept="application/pdf"
            onChange={e => handleSelectedFile(e.target.files)}
          />

          {pdfFile && (
            <div className="mt-5 bg-white p-4 rounded shadow relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={handleRemoveFile}>
                <IoClose size={20} />
              </button>

              <p className="text-lg text-gray-500 font-semibold">{pdfFile.name}</p>
              <p className="text-sm text-gray-500">Size: {pdfFile.size} bytes</p>

              <div className="mt-3 bg-gray-200 rounded h-2.5 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-2.5 rounded"
                  style={{ width: `${progressUpload}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-purple hover:bg-brand-purple-s
            ">
        {isLoading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};
export default CreateSession;
