const UserWordsFilters = {
  HARD: JSON.stringify({ $and: [{ 'userWord.difficulty': 'hard' }] }),
  AUDIOCALL_WEAK: JSON.stringify({
    $or: [
      { 'userWord.optional.audiocall': '0' },
      { 'userWord.optional.audiocall': '1' },
      { 'userWord.optional.audiocall': '2' },
      { 'userWord.difficulty': 'weak' },
      { userWord: null },
    ],
  }),
  SPRINT_WEAK: JSON.stringify({
    $or: [
      { 'userWord.optional.sprint': '0' },
      { 'userWord.optional.sprint': '1' },
      { 'userWord.optional.sprint': '2' },
      { 'userWord.difficulty': 'weak' },
      { userWord: null },
    ],
  }),
};

export default UserWordsFilters;
