import { useState } from "react";
import axios from "axios";
import bg from "../assets/bg.jpg";

export default function Upload() {
  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [expiry, setExpiry] = useState(10);
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [oneTime, setOneTime] = useState(false);
  const [maxViews, setMaxViews] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (mode === "text" && !text.trim()) {
      alert("Please enter some text");
      return;
    }

    if (mode === "file" && !file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    // expiry logic
    if (expiryDate && expiryTime) {
      const iso = new Date(`${expiryDate}T${expiryTime}`).toISOString();
      formData.append("expiresAt", iso);
    } else {
      formData.append("expiryMinutes", expiry);
    }

    formData.append("oneTime", oneTime);
    if (maxViews) formData.append("maxViews", maxViews);

    if (mode === "text") formData.append("text", text);
    if (mode === "file") formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/upload", formData);
      setLink(res.data.link);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white shadow-2xl rounded-2xl w-[520px] p-8 flex flex-col gap-6">

        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">LinkVault</h1>
          <p className="text-gray-500 text-sm mt-1">Secure temporary sharing</p>
        </div>

        {/* Mode Switch */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 py-2 rounded-lg transition font-medium ${
              mode === "text"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Share Text
          </button>

          <button
            onClick={() => setMode("file")}
            className={`flex-1 py-2 rounded-lg transition font-medium ${
              mode === "file"
                ? "bg-white shadow text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Share File
          </button>
        </div>

        {/* Text Input */}
        {mode === "text" && (
          <textarea
            className="border rounded-xl p-4 h-40 resize-none focus:outline-blue-500"
            placeholder="Paste text to share securely..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        )}

        {/* File Input */}
        {mode === "file" && (
          <div className="border-2 border-dashed rounded-xl p-6 text-center bg-gray-50">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <p className="text-xs text-gray-500 mt-2">
              Max size: 5MB • Allowed: PDF, TXT, PNG, JPG
            </p>
            {file && (
              <p className="text-sm text-gray-700 mt-2">
                Selected: <span className="font-medium">{file.name}</span>
              </p>
            )}
          </div>
        )}

        {/* Expiry Section */}
        <div className="flex flex-col gap-3">
          <label className="font-semibold text-gray-700">Expiry Time</label>

          {/* Preset durations */}
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-blue-500"
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={60}>1 hour</option>
            <option value={1440}>1 day</option>
          </select>

          {/* Exact date/time */}
          <div className="bg-gray-50 border rounded-xl p-3 flex flex-col gap-2">
            <p className="text-sm text-gray-600 font-medium">
              Or choose exact expiry
            </p>

            <div className="flex gap-2">
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="border rounded px-2 py-1 w-1/2"
              />

              <input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="border rounded px-2 py-1 w-1/2"
              />
            </div>

            <p className="text-xs text-gray-400">
              Leave empty to use preset duration
            </p>
          </div>
        </div>

        {/* Max Views */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700">
            Maximum Views (optional)
          </label>
          <input
            type="number"
            min="1"
            placeholder="Unlimited if empty"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:outline-blue-500"
          />
        </div>

        {/* One Time */}
        <label className="flex items-center gap-3 text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={oneTime}
            onChange={(e) => setOneTime(e.target.checked)}
            className="w-4 h-4"
          />
          One-time view (self destruct after opening)
        </label>

        {/* Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-xl font-semibold"
        >
          {loading ? "Uploading..." : "Generate Secure Link"}
        </button>

        {/* Result */}
        {link && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-700 text-center">
              Your private link
            </p>

            <div className="flex gap-2 mt-3">
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-sm border rounded px-2 py-2 bg-white break-all"
              >
                {link}
              </a>

              <button
                onClick={copyToClipboard}
                className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
