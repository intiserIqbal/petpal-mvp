import { useEffect, useState } from "react";
import api from "../../services/api";

interface Props {
  petId: string;
  refresh: boolean; // toggles to reload reviews
}

export default function ReviewList({ petId, refresh }: Props) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reviews/${petId}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [petId, refresh]);

  if (loading)
    return <p className="text-gray-500">Loading reviews...</p>;

  if (!reviews.length)
    return (
      <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
    );

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border p-3 rounded bg-gray-50"
        >
          <p className="font-semibold">{review.user?.name || "User"}</p>
          <p className="mt-1 text-gray-800">{review.text}</p>

          {review.sentiment && (
            <p
              className={`mt-1 text-sm font-medium ${
                review.sentiment === "POSITIVE"
                  ? "text-green-600"
                  : review.sentiment === "NEGATIVE"
                  ? "text-red-600"
                  : "text-gray-700"
              }`}
            >
              Sentiment: {review.sentiment}
            </p>
          )}

          <p className="text-xs text-gray-500 mt-1">
            {new Date(review.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
