import { FC } from 'react';
import s from './AudiocallGroupList.module.scss';
import wordsGroupNames from '../../shared/wordsGroupNames';
import AudiocallGroupItem from '../AudiocallGroupItem';

export interface AudiocallGroupListProps {
  onClickItem: (groupName: string) => void;
  activeGroup: number;
}

const AudiocallGroupList: FC<AudiocallGroupListProps> = ({ onClickItem, activeGroup }) => {
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
