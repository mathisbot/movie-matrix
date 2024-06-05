import { useState } from 'react';

const VoteButton = () => {
  const [vote, setVote] = useState('');

  const handleVote = (value: string) => {
    setVote(value);
  };

  return (
    <div className="flex items-center space-x-4">
      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="vote"
          value="like"
          checked={vote === 'like'}
          onChange={() => handleVote('like')}
          className="hidden"
        />
        <div
          className={`cursor-pointer p-2 rounded-full transition-transform transform ${
            vote === 'like' ? 'bg-green-500 text-white scale-110' : 'bg-gray-200 scale-100'
          }`}
        >
          👍
        </div>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="radio"
          name="vote"
          value="dislike"
          checked={vote === 'dislike'}
          onChange={() => handleVote('dislike')}
          className="hidden"
        />
        <div
          className={`cursor-pointer p-2 rounded-full transition-transform transform ${
            vote === 'dislike' ? 'bg-red-500 text-white scale-110' : 'bg-gray-200 scale-100'
          }`}
        >
          👎
        </div>
      </label>
    </div>
  );
};

export default VoteButton;
