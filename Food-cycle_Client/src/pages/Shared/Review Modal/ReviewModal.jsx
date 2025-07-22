import React, { useState } from 'react';

const ReviewModal = ({ donation, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [desc, setDesc] = useState('');

  const handleSubmit = () => {
    if (!desc.trim()) return;

    // Only pass what the parent needs (it will construct final payload)
    onSubmit({
      rating,
      description: desc.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-base-100 rounded-xl shadow-xl w-full max-w-md p-8 space-y-5">
        <h3 className="text-xl font-semibold">Add Review</h3>

        <div className="text-sm text-base-content/70 mb-2">
          <p>
            <span className="font-medium">Donation:</span> {donation.title}
          </p>
          <p>
            <span className="font-medium">Restaurant:</span>{' '}
            {donation.restaurantName}
          </p>
        </div>

        <textarea
          className="textarea textarea-bordered w-full h-24"
          placeholder="Share your experience…"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />

        <div className="space-x-5 flex items-center">
          <span className="font-medium pt-1">Rating: {rating}</span>
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((n) => (
              <input
                key={n}
                type="radio"
                name="rating"
                className="mask mask-star-2 bg-primary"
                checked={rating === n}
                onChange={() => setRating(n)}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button className="btn btn-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleSubmit}
            disabled={!desc.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
