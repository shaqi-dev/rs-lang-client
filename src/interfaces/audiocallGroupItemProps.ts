import { MouseEvent } from 'react';

interface AudiocallGroupItemProps {
  active?: boolean;
  className?: string | string[];
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default AudiocallGroupItemProps;
