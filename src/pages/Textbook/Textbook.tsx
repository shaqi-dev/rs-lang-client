import { FC, useState, useEffect, MouseEvent, useCallback } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import ErrorBanner from '../../components/ErrorBanner';
import { getWords } from '../../services/words';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Textbook: FC = () => {
  const [currentLevel, setCurrentLevel] = useState<string>(englishLevels[0]);
  const [currentPage] = useState<number>(1);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [serverError, setServerError] = useState<Error | null>(null);

  const updateWords = useCallback(async (): Promise<void> => {
    const { data, error } = await getWords({
      group: englishLevels.indexOf(currentLevel),
      page: currentPage - 1,
    });

    if (error) setServerError(error);
    if (data) setCurrentWords(data);
  }, [currentLevel, currentPage]);

  useEffect(() => {
    updateWords();
  }, [currentLevel, currentPage, updateWords]);

  const handleClickLevel = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    setCurrentLevel(button.innerText);
  };

  const levelButtons = englishLevels.map((level) => (
    <EnglishLevelButton
      key={level.toLowerCase()}
      active={currentLevel === level}
      onClick={handleClickLevel}
    >
      {level}
    </EnglishLevelButton>
  ));

  const wordElements = currentWords.map((word) => (
    <button type="button" key={word.word}>
      {word.word}
    </button>
  ));

  const serverErrorString = `${serverError?.name}: ${serverError?.message}`;

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.levelsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <div className={s.levelsButtons}>{levelButtons}</div>
      </section>
      <section className={s.words}>
        <p className={s.sectionTitle}>Слова</p>
        {serverError && <ErrorBanner>{serverErrorString}</ErrorBanner>}
        {!serverError && <div className={s.wordsButtons}>{wordElements}</div>}
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
