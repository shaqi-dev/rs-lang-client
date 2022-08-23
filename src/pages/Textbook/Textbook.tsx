import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import ContentWrapper from '../../layouts/ContentWrapper';
import WordsGroupList from '../../components/WordsGroupList';
import WordList from '../../components/WordList';
import WordCard from '../../components/WordCard';
import Paginate from '../../components/Paginate';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectCurrentView,
  selectCurrentGroup,
  selectCurrentPage,
  selectCurrentWord,
  setGroup,
  setPage,
  setWord,
  setView,
} from '../../store/textbook/textbookSlice';
import Button from '../../components/Button';
import ErrorBanner from '../../components/ErrorBanner';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';
import { useGetTextbookWords } from './useGetTextbookWords';

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const view = useAppSelector<'main' | 'user'>(selectCurrentView);
  const group = useAppSelector<number>(selectCurrentGroup);
  const page = useAppSelector<number>(selectCurrentPage);
  const word = useAppSelector<Word | AggregatedWord | null>(selectCurrentWord);

  const { words, error, isLoading, maxPages } = useGetTextbookWords();

  const wordsListErrorElement = (err: FetchBaseQueryError | SerializedError): JSX.Element => {
    if ('status' in err) {
      const errorMessage = 'error' in err ? err.error : JSON.stringify(err.data);
      return <ErrorBanner>An error has occurred: {errorMessage}</ErrorBanner>;
    }
    return <ErrorBanner>{err.message}</ErrorBanner>;
  };

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (group !== selectedGroup) {
      dispatch(setGroup(selectedGroup));
    }
  };

  useEffect(() => {
    dispatch(setPage(0));
  }, [dispatch, group, view]);

  const handleChangePage = ({ selected }: { selected: number }): void => {
    dispatch(setPage(selected));
  };

  useEffect(() => {
    dispatch(setWord((words && words[0]) || null));
  }, [dispatch, page, group, view, words]);

  const handleClickTextbook = (): void => {
    dispatch(setView('main'));
  };

  const handleClickVocabulary = (): void => {
    dispatch(setView('user'));
  };

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.viewSection}>
        <Button
          type="button"
          buttonStyle="link"
          inactive={view === 'user'}
          className={s.viewSection_button}
          onClick={handleClickTextbook}
        >
          Учебник
        </Button>
        <Button
          type="button"
          buttonStyle="link"
          inactive={view === 'main'}
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
          {isLoading && <p>Loading...</p>}
          {error && wordsListErrorElement(error)}
          {!error && words && !words.length && <p>В этом разделе еще нет слов</p>}
          {!error && words && !!words.length && <WordList words={words} />}
          {word && <WordCard word={word} />}
        </div>
        <Paginate pageCount={maxPages} forcePage={page} onPageChage={handleChangePage} />
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
