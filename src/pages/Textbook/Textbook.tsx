import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../layouts/ContentWrapper';
import WordsGroupList from '../../components/WordsGroupList';
import WordList from '../../components/WordList';
import WordCard from '../../components/WordCard';
import Paginate from '../../components/Paginate';
import Button from '../../components/Button';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectCurrentView,
  selectCurrentGroup,
  selectCurrentPage,
  selectCurrentWord,
  selectCurrentMaxPages,
  setGroup,
  setPage,
  setView,
  setWord,
} from '../../store/textbook/textbookSlice';
import { selectCurrentUserId } from '../../store/auth/authSlice';
import useGetTextbookWords from '../../hooks/useGetTextbookWords';
import type { AggregatedWord } from '../../interfaces/userAggregatedWords';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';
import TextbookView from '../../shared/enums/TextbookView';

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const userId = useAppSelector<string | null>(selectCurrentUserId);
  const view = useAppSelector<TextbookView>(selectCurrentView);
  const group = useAppSelector<number>(selectCurrentGroup);
  const page = useAppSelector<number>(selectCurrentPage);
  const word = useAppSelector<Word | AggregatedWord | null>(selectCurrentWord);
  const maxPages = useAppSelector<number>(selectCurrentMaxPages);

  const wordsResponse = useGetTextbookWords({ view, group, page, userId });
  const firstWordOnPage = wordsResponse?.words?.[0] || null;

  useEffect(() => {
    dispatch(setPage(0));
  }, [dispatch, group, view]);

  useEffect(() => {
    dispatch(setWord(firstWordOnPage));
  }, [dispatch, firstWordOnPage, group, page, view]);

  // Update word card when delete word from hard words
  useEffect(() => {
    if (view === TextbookView.USER) {
      dispatch(setWord(firstWordOnPage));
    }
  }, [dispatch, firstWordOnPage, view, wordsResponse.words]);

  const handleClickWordsGroupItem = (groupName: string): void => {
    const selectedGroup: number = wordsGroupNames.indexOf(groupName);

    if (group !== selectedGroup) {
      dispatch(setGroup(selectedGroup));
    }
  };

  const handleChangePage = ({ selected }: { selected: number }): void => {
    dispatch(setPage(selected));
  };

  const handleClickTextbook = (): void => {
    dispatch(setView(TextbookView.MAIN));
  };

  const handleClickVocabulary = (): void => {
    dispatch(setView(TextbookView.USER));
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
        {userId && (
          <Button
            type="button"
            buttonStyle="link"
            inactive={view === 'main'}
            className={s.viewSection_button}
            onClick={handleClickVocabulary}
          >
            Словарь
          </Button>
        )}
      </section>
      <section className={s.groupsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <WordsGroupList onClickItem={handleClickWordsGroupItem} />
      </section>
      <section className={s.wordsSection}>
        <p className={s.sectionTitle}>Слова</p>
        <div className={s.wordsBody}>
          <WordList wordsResponse={wordsResponse} activeWord={word} />
          {word && <WordCard word={word} view={view} userId={userId} />}
        </div>
        <Paginate
          pageCount={maxPages}
          forcePage={page}
          onPageChage={handleChangePage}
          learned={wordsResponse.isLearned}
        />
      </section>
      <section className={s.gamesSection}>
        <p className={s.sectionTitle}>Игры</p>
        <div className={s.gamesBody}>
          <Button
            type="button"
            buttonStyle="primary"
            onClick={(): void => navigate('../games/sprint')}
            disabled={wordsResponse.isLearned}
          >
            Спринт
          </Button>
          <Button
            type="button"
            buttonStyle="primary"
            onClick={(): void => navigate('../games/audiocall')}
            disabled={wordsResponse.isLearned}
          >
            Аудиовызов
          </Button>
        </div>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
