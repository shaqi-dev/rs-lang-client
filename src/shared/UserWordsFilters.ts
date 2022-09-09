const UserWordsFilters = {
  HARD: JSON.stringify({ $and: [{ 'userWord.difficulty': 'hard' }] }),
};

export default UserWordsFilters;
