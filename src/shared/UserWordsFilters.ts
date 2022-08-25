const UserWordsFilters = {
  HARD: JSON.stringify({ $and: [{ 'userWord.difficulty': 'hard' }] }),
  WEAK: JSON.stringify({ $and: [{ 'userWord.difficulty': 'hard' }] }),
};

export default UserWordsFilters;
