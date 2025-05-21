import { useContext, useRef, useState } from "react";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import { ChatContext } from "../context/ChatContext";

function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useContext(ChatContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetInput = () => {
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      sendMessage({ text, image: imagePreview });
      resetInput();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="p-4 w-full bg-gray-100 rounded-b-lg shadow-inner">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-3">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image preview"
              className="w-20 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
            />
            <button
              type="button"
              onClick={resetInput}
              title="Remove image"
              className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="w-full bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700 transition"
            title="Attach image"
          >
            <Image size={20} />
          </button>
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-2 rounded-full bg-gray-300 text-gray-800 hover:bg-gray-700 hover:text-white transition disabled:opacity-40"
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

export default MessageInput;
