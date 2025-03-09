import React, { useState, useRef, useEffect, useMemo } from 'react'
import styles from './styles.module.scss'

interface Props {
	items: { [key: number | string]: number },
	onChange: (value: number) => void,
	current?: number,
}

const Slider: React.FC<Props> = ({ items, onChange, current }) => {
	const [pointOffset, setPointOffset] = useState<number>(0);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [isDragging, setIsDragging] = useState<boolean>(false);

	const sliderRef = useRef<HTMLDivElement>(null);
	const sliderLegendRef = useRef<HTMLDivElement>(null);
	const pointerRef = useRef<HTMLDivElement>(null);

	const keys = useMemo(() => Object.keys(items), [items]);

	useEffect(() => {
		if (undefined !== current) {
			const indexByItems = keys.findIndex(key => items[key] === current);
			const newIndex = -1 === indexByItems ? 0 : indexByItems;
			setPointOffset((newIndex / (keys.length - 1)) * 100);
		}
	}, [current]);

	const handleMouseDown = (event: React.MouseEvent) => {
		setIsDragging(true);
		updateSliderPosition(event.clientX);
		updateSliderPosition(event.clientX);
	};

	const handleTouchStart = (event: React.TouchEvent) => {
		setIsDragging(true);
		updateSliderPosition(event.touches[0].clientX);
	};

	const handleMouseMove = (event: MouseEvent) => {
		if (isDragging) {
			updateSliderPosition(event.clientX);
		}
	};

	const handleTouchMove = (event: TouchEvent) => {
		if (isDragging) {
			updateSliderPosition(event.touches[0].clientX);
		}
	};

	const handleMouseUp = () => {
		if (isDragging) {
			setIsDragging(false);
			snapToNearestValue();
			onChange(items[keys[selectedIndex]]);
		}
	};

	const handleTouchEnd = () => {
		if (isDragging) {
			setIsDragging(false);
			snapToNearestValue();
			onChange(items[keys[selectedIndex]]);
		}
	};

	const updateSliderPosition = (clientX: number) => {
		if (sliderRef.current) {
			const rect = sliderRef.current.getBoundingClientRect();
			const offsetX = clientX - rect.left;
			const width = rect.width;
			const newIndex = Math.round((offsetX / width) * (keys.length - 1));

			setSelectedIndex(Math.max(0, Math.min(keys.length - 1, newIndex)));

			let normalizedOffset = offsetX;
			if (normalizedOffset < 0) {
				normalizedOffset = 0;
			} else if (normalizedOffset > width) {
				normalizedOffset = width;
			}

			setPointOffset((normalizedOffset / width) * 100);
		}
	};

	const snapToNearestValue = () => {
		if (sliderRef.current) {
			const legendItems = sliderLegendRef.current.getElementsByClassName(styles.legendContainer__text);
			const selectedLegendRect = legendItems[selectedIndex].getBoundingClientRect();
			const pointerRect = pointerRef.current.getBoundingClientRect();
			const sliderRect = sliderRef.current.getBoundingClientRect();

			if (selectedIndex === keys.length - 1)
			{
				setPointOffset((sliderRect.width - pointerRect.width / 2) / sliderRect.width * 100);
			}
			else if (selectedIndex === 0)
			{
				setPointOffset((pointerRect.width / 2) / sliderRect.width * 100);
			}
			else
			{
				const offsetX = selectedLegendRect.left - sliderRect.left + selectedLegendRect.width / 2;
				setPointOffset(offsetX / sliderRect.width * 100);
			}
		}
	};

	useEffect(() => {
		document.addEventListener('mousemove', handleMouseMove);
		document.addEventListener('mouseup', handleMouseUp);
		document.addEventListener('touchmove', handleTouchMove);
		document.addEventListener('touchend', handleTouchEnd);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
			document.removeEventListener('mouseup', handleMouseUp);
			document.removeEventListener('touchmove', handleTouchMove);
			document.removeEventListener('touchend', handleTouchEnd);
		};
	}, [isDragging, selectedIndex]);

	return (
		<div className={styles.sliderContainer}>
			<div
				ref={sliderRef}
				className={styles.slider}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
			>
				<div
					className={styles.slider__pointer}
					style={{
						left: `${pointOffset}%`,
						transition: isDragging ? 'none' : undefined,
						borderColor: isDragging ? '#13A69D' : undefined,
					}}
					ref={pointerRef}
				/>
			</div>

			<div className={styles.slider__legendContainer} ref={sliderLegendRef}>
				{keys.map((key, index) => (
					<div key={index} className={styles.legendContainer__text}>
						{key}
					</div>
				))}
			</div>
		</div>
	);
}

export default Slider
