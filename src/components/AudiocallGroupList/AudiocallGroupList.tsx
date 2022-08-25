import { FC } from 'react';
import s from './AudiocallGroupList.module.scss';
import wordsGroupNames from '../../shared/wordsGroupNames';
import { useAppSelector } from '../../hooks/redux';
import AudiocallGroupItem from '../AudiocallGroupItem';
import { selectAudiocallGroup } from '../../store/audiocall/audiocallSlice';
import AudiocallGroupListProps from '../../interfaces/audiocallGroupListProps';

const AudiocallGroupList: FC<AudiocallGroupListProps> = ({ onClickItem }) => {
  const activeGroup: number = useAppSelector(selectAudiocallGroup);
  const activeGroupName: string = wordsGroupNames[activeGroup];

  return (
    <ul className={s.audiocallGroups}>
      {wordsGroupNames.map((name) => (
        <li className={s.listItem} key={name}>
          <AudiocallGroupItem
            active={activeGroupName === name}
            onClick={(): void => onClickItem(name)}
            className={name}
          >
            {name}
          </AudiocallGroupItem>
        </li>
      ))}
    </ul>
  );
};

export default AudiocallGroupList;
