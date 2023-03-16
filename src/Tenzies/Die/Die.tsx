import { FC } from 'react';
import { DieProps } from '.';
import './Die.css'

export const Die: FC<DieProps> = (props) => {
	const dots = Array.from({ length: props.value }, (_, index) => {
		return <span key={index} className="dot"></span>;
	});

	return (
		<div
			{...props}
			onClick={props.onClick}
			className={`dice${props.isheld ? ' active' : ''}`}
			data-num={props.value}
		>
			{dots}
		</div>
	)
};
