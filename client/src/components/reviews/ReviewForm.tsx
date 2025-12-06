import { useState } from "react";
import api from "../../services/api";

interface Props {
  petId: string;
  onSuccess: () => void;
}

export default function ReviewForm({ petId, onSuccess }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Review cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(`/reviews/${petId}`, {
        text: text.trim(),
      });

      setText("");
      onSuccess(); // refresh list
    } catch (err: any) {
      setError("Failed to submit review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        placeholder="Write a review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border p-2 rounded h-20"
      />

      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Posting..." : "Post Review"}
      </button>
    </form>
  );
}
