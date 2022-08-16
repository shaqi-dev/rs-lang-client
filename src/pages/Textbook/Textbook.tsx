import { FC, useState, useEffect, MouseEvent, useCallback } from 'react';
import ContentWrapper from '../../layouts/ContentWrapper';
import EnglishLevelButton from '../../components/EnglishLevelButton';
import WordButton from '../../components/WordButton';
import ErrorBanner from '../../components/ErrorBanner';
import { getWords } from '../../services/words';
import type { Word } from '../../interfaces/words';
import s from './Textbook.module.scss';

const englishLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const Textbook: FC = () => {
  const [currentLevel, setCurrentLevel] = useState<string>(englishLevels[0]);
  const [currentPage] = useState<number>(1);
  const [currentWords, setCurrentWords] = useState<Word[]>([]);
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [serverError, setServerError] = useState<Error | null>(null);

  const updateWords = useCallback(async (): Promise<void> => {
    const { data, error } = await getWords({
      group: englishLevels.indexOf(currentLevel),
      page: currentPage - 1,
    });

    if (error) setServerError(error);
    if (data) {
      setCurrentWords(data);
      setCurrentWord(data[0]);
    }
  }, [currentLevel, currentPage]);

  useEffect(() => {
    updateWords();
  }, [currentLevel, currentPage, updateWords]);

  const handleClickLevel = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    setCurrentLevel(button.innerText);
  };

  const handleClickWord = (e: MouseEvent<HTMLButtonElement>): void => {
    const button = e.target as HTMLButtonElement;
    const word = currentWords.filter((item) => item.word === button.innerText)[0];
    setCurrentWord(word);
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

  const wordElements = currentWords.map((word, i) => {
    const isActive = (currentWord && currentWord.word === word.word) || (!currentWord && i === 0);

    return (
      <WordButton key={word.word} active={isActive} onClick={handleClickWord}>
        {word.word}
      </WordButton>
    );
  });

  const serverErrorBanner = (
    <ErrorBanner>
      `${serverError?.name}: ${serverError?.message}`
    </ErrorBanner>
  );

  return (
    <ContentWrapper className={s.wrapper}>
      <section className={s.levelsSection}>
        <p className={s.sectionTitle}>Уровень сложности</p>
        <div className={s.levelsButtons}>{levelButtons}</div>
      </section>
      <section className={s.wordsSection}>
        <p className={s.sectionTitle}>Слова</p>
        <div className={s.wordsBody}>
          <div className={s.wordsButtons}>
            {serverError && serverErrorBanner}
            {!serverError && wordElements}
          </div>
          <div className={s.wordsCard}>
            {currentWord && `${currentWord.word} - ${currentWord.wordTranslate}`}
          </div>
        </div>
        <div className={s.wordsPagination}>Пагинация</div>
      </section>
    </ContentWrapper>
  );
};

export default Textbook;
