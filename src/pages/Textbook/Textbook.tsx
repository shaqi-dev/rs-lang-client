import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import ContentWrapper from '../../layouts/ContentWrapper';
import WordsGroupList from '../../components/WordsGroupList';
import WordList from '../../components/WordList';
import WordCard from '../../components/WordCard';
import Paginate from '../../components/Paginate';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useGetWordsQuery } from '../../services/wordsApi';
import { useGetUserAggregatedWordsQuery } from '../../services/userAggregatedWordsApi';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import {
  selectCurrentGroup,
  selectCurrentPage,
  selectCurrentWord,
  setGroup,
  setPage,
  setWord,
} from '../../store/textbook/textbookSlice';
import s from './Textbook.module.scss';
import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import type { Word } from '../../interfaces/words';

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [view, setView] = useState<'textbook' | 'vocabulary'>('textbook');
  const group: number = useAppSelector(selectCurrentGroup);
  const page: number = useAppSelector(selectCurrentPage);
  const word: Word | AggregatedWord | null = useAppSelector(selectCurrentWord);
  const userId = useAppSelector(selectCurrentUserId);
  const wordsPerPage = 20;
  const textbookMaxPages = 30;
  let vocabularyMaxPages = 0;

  const {
    data: words,
    error: wordsError,
    isLoading: wordsIsLoading,
  } = useGetWordsQuery({ group, page });
  const {
    data: userWordsData,
    error: userWordsError,
    isLoading: userWordsIsLoading,
  } = useGetUserAggregatedWordsQuery({
    userId,
    group,
    page,
    filter: JSON.stringify({
      $and: [{ 'userWord.difficulty': 'weak' }],
    }),
  });

  let userWords: AggregatedWord[] = [];

  if (userWordsData) {
    userWords = userWordsData[0].paginatedResults;
    vocabularyMaxPages = Math.floor(userWordsData[0].totalCount[0].count / wordsPerPage);
  }

  const wordsListErrorElement = (error: FetchBaseQueryError | SerializedError): JSX.Element => {
    if ('status' in error) {
      const errorMessage = 'error' in error ? error.error : JSON.stringify(error.data);
      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }
    return <ErrorBanner>{error.message}</ErrorBanner>;
  };

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (group !== selectedGroup) {
      dispatch(setGroup(selectedGroup));
      dispatch(setPage(0));
    }
  };

  const handleChangePage = ({ selected }: { selected: number }): void => {
    dispatch(setPage(selected));
  };

  const handleClickTextbook = (): void => {
    setView('textbook');
    dispatch(setPage(0));
    if (words) {
      dispatch(setWord(words[0]));
    }
  };

  const handleClickVocabulary = (): void => {
    setView('vocabulary');
    dispatch(setPage(0));
    if (userWords) {
      dispatch(setWord(userWords[0]));
    }
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.viewSection}>
        <Button
          type="button"
          buttonStyle="link"
          inactive={view === 'vocabulary'}
          className={s.viewSection_button}
          onClick={handleClickTextbook}
        >
          Учебник
        </Button>
        <Button
          type="button"
          buttonStyle="link"
          inactive={view === 'textbook'}
          className={s.viewSection_button}
          onClick={handleClickVocabulary}
        >
          Словарь
        </Button>
      </section>
      <section className={s.groupsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <WordsGroupList onClickItem={handleClickWordsGroupItem} />
      </section>
      <section className={s.wordsSection}>
        <p className={s.sectionTitle}>Слова</p>
        <div className={s.wordsBody}>
          {view === 'textbook' &&
            ((wordsIsLoading && <p>Loading...</p>) ||
              (wordsError && wordsListErrorElement(wordsError)) ||
              (!wordsError && words && <WordList words={words} />))}
          {view === 'vocabulary' &&
            ((userWordsIsLoading && <p>Loading...</p>) ||
              (userWordsError && wordsListErrorElement(userWordsError)) ||
              (!userWordsError && userWords && <WordList words={userWords} />))}

          {((view === 'textbook' && !wordsError) || (view === 'vocabulary' && !userWordsError)) &&
            word && <WordCard word={word} />}
        </div>
        <Paginate
          pageCount={view === 'textbook' ? textbookMaxPages : vocabularyMaxPages}
          forcePage={page}
          onPageChage={handleChangePage}
        />
      </section>
      <section className={s.gamesSection}>
        <p className={s.sectionTitle}>Игры</p>
        <div className={s.gamesBody}>
          <Button type="button" buttonStyle="primary" onClick={(): void => navigate('sprint')}>
            Спринт
          </Button>
          <Button type="button" buttonStyle="primary" onClick={(): void => navigate('audiocall')}>
            Аудиовызов
          </Button>
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
