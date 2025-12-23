import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import ReviewForm from "../../components/reviews/ReviewForm";
import ReviewList from "../../components/reviews/ReviewList";

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [refreshReviews, setRefreshReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [average, setAverage] = useState(0);

  // Fetch pet data
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`);
        setPet(res.data);
      } catch (err: any) {
        setError("Failed to load pet details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  // Fetch reviews data
  useEffect(() => {
    api.get(`/reviews/pet/${id}`).then((res) => setReviews(res.data.reviews));
    // Optional: If you add an average endpoint
    // api.get(`/reviews/pet/${petId}/average`).then(res => setAverage(res.data.average));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pet?")) return;

    try {
      await api.delete(`/pets/${id}`);
      navigate("/");
    } catch (err) {
      alert("Delete failed. Check console.");
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10">
        <p>Loading pet details...</p>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">
        <p>{error}</p>
      </div>
    );

  if (!pet)
    return (
      <div className="text-center text-gray-600 mt-10">
        <p>Pet not found.</p>
      </div>
    );

  // sentiment color
  const sentimentColor =
    pet.sentiment === "POSITIVE"
      ? "text-green-600"
      : pet.sentiment === "NEGATIVE"
      ? "text-red-600"
      : "text-gray-700";

  return (
    <div className="max-w-3xl mx-auto mt-8 p-5 bg-white shadow rounded">
      <img
        src={pet.image}
        alt={pet.name}
        className="w-full h-64 object-cover rounded"
      />

      <h1 className="text-3xl font-bold mt-4">{pet.name}</h1>

      <p className="mt-1 text-gray-700">Species: {pet.species}</p>

      {pet.age && (
        <p className="text-gray-700">Age: {pet.age} years</p>
      )}

      {pet.location && (
        <p className="text-gray-700">Location: {pet.location}</p>
      )}

      <p className="mt-3">{pet.description}</p>

      <p className={`mt-2 font-semibold ${sentimentColor}`}>
        Sentiment: {pet.sentiment || "NEUTRAL"}
      </p>

      {/* EDIT + DELETE BUTTONS */}
      <div className="flex gap-3 mt-4">
        <Link
          to={`/pets/${pet._id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit
        </Link>

        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>

      {/* REVIEWS */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-3">Reviews</h2>

        <ReviewForm
          petId={pet._id}
          onSuccess={() => setRefreshReviews(!refreshReviews)}
        />

        <ReviewList petId={pet._id} refresh={refreshReviews} />
      </div>
    </div>
  );
}
