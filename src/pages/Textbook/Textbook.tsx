import { FC, useState, useEffect, useCallback } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import WordsGroupList from '../../components/WordsGroupList';
import WordList from '../../components/WordList';
import WordCard from '../../components/WordCard';
import Paginate from '../../components/Paginate';
import ErrorBanner from '../../components/ErrorBanner';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectCurrentGroup,
  selectCurrentPage,
  setGroup,
  setPage,
} from '../../store/textbook/textbookSlice';
import { getWords } from '../../services/words';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const group: number = useAppSelector(selectCurrentGroup);
  const page: number = useAppSelector(selectCurrentPage);
  const maxPages = 30;

  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [serverError, setServerError] = useState<Error | null>(null);

  const updateWords = useCallback(async (): Promise<void> => {
    const { data, error } = await getWords({
      group,
      page,
    });

    if (error) setServerError(error);
    if (data) {
      setCurrentWords(data);
      setCurrentWord(data[0]);
    }
  }, [group, page]);

  useEffect(() => {
    updateWords();
  }, [group, page, updateWords]);

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

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.groupsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <WordsGroupList onClickItem={handleClickWordsGroupItem} />
      </section>
      <section className={s.wordsSection}>
        <p className={s.sectionTitle}>Слова</p>
        <div className={s.wordsBody}>
          {serverError && (
            <ErrorBanner>
              `${serverError?.name}: ${serverError?.message}`
            </ErrorBanner>
          )}
          {!serverError && (
            <WordList words={currentWords} activeWord={currentWord} onClickItem={setCurrentWord} />
          )}
          {currentWord && <WordCard word={currentWord} />}
        </div>
        {currentWords && (
          <Paginate pageCount={maxPages} forcePage={page} onPageChage={handleChangePage} />
        )}
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
