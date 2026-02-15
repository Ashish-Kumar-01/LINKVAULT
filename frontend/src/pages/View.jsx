import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import bg from "../assets/bg.jpg";

export default function View() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/content/${token}`)
      .then((res) => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 410)
          setError("This link has expired or reached its access limit");
        else if (err.response?.status === 403)
          setError("Invalid link");
        else
          setError("Unable to access content");
      });
  }, [token]);

  const formatDate = (d) =>
    new Date(d).toLocaleString();

  const copyText = () => {
    navigator.clipboard.writeText(data.textContent);
    alert("Copied to clipboard");
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-2xl font-bold text-red-500">Content Removed</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <p className="text-xs text-gray-400 mt-1">
          Expired content is automatically deleted from the server for security.
          </p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading secure content...
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white shadow-xl rounded-2xl w-[700px] p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="text-center border-b pb-4">
          <h1 className="text-3xl font-bold text-indigo-600">Secure Content</h1>
          <p className="text-gray-500 text-sm">Private access link</p>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
          <p><b>Type:</b> {data.type === "text" ? "Text" : "File"}</p>
          <p><b>Created:</b> {formatDate(data.createdAt)}</p>
          <p><b>Expires:</b> {formatDate(data.expiresAt)}</p>
          <p>
            <b>Views:</b>{" "}
            {data.maxViews ? `${data.viewsUsed}/${data.maxViews}` : `${data.viewsUsed}`}
          </p>
        </div>

        {/* TEXT CONTENT */}
        {data.type === "text" && (
          <div className="flex flex-col gap-3">
            <div className="bg-gray-900 text-green-300 font-mono rounded-xl p-5 whitespace-pre-wrap max-h-[350px] overflow-auto">
              {data.textContent}
            </div>

            <button
              onClick={copyText}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              Copy Text
            </button>
          </div>
        )}

        {/* FILE CONTENT */}
        {data.type === "file" && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-gray-700 font-medium">
              {data.originalFileName}
            </div>

            <a
              href={`http://localhost:5000/${data.fileUrl}`}
              download
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Download File
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
