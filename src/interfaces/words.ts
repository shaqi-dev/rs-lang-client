export interface Word {
  _id: string;
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
}

export interface GetWordsData {
  group: number;
  page: number;
}

export interface GetWordsResponse {
  data: Word[] | undefined;
  error: Error | undefined;
}

export interface GetWordByIdResponse {
  data: Word | undefined;
  error: Error | undefined;
}
