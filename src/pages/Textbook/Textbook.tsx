import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentWrapper from '../../layouts/ContentWrapper';
import WordsGroupList from '../../components/WordsGroupList';
import WordList from '../../components/WordList';
import WordCard from '../../components/WordCard';
import Paginate from '../../components/Paginate';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectCurrentGroup,
  selectCurrentPage,
  selectCurrentWord,
  setGroup,
  setPage,
} from '../../store/textbook/textbookSlice';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';
import Button from '../../components/Button';

const Textbook: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const group: number = useAppSelector(selectCurrentGroup);
  const page: number = useAppSelector(selectCurrentPage);
  const word: Word | null = useAppSelector(selectCurrentWord);
  const maxPages = 30;

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
          <WordList />
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
