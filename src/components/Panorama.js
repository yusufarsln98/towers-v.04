import React, { useContext } from 'react';
import {
	ReactPhotoSphereViewer,
	VisibleRangePlugin,
} from 'react-photo-sphere-viewer';
import { AppContext } from '../App';
import styles from './Panorama.module.css';
import Controls from './Controls';

export function loadPanorama(
	psvRef,
	pano,
	panoData,
	setPanoChanged,
	reset = false
) {
	setPanoChanged(true);
	psvRef.current
		.setPanorama(pano, {
			showLoader: false,
			panoData: panoData,
			yaw: reset ? 0 : psvRef.current.getPosition().yaw,
			pitch: reset ? 0 : psvRef.current.getPosition().pitch,
			zoom: reset ? 10 : psvRef.current.getZoomLevel(),
		})
		.then(() => {
			const visibleRange = psvRef.current.getPlugin(VisibleRangePlugin);
			visibleRange.setRangesFromPanoData();
			visibleRange.setVerticalRange([0, 0]);
			setPanoChanged(false);
			psvRef.current.animate({
				yaw: psvRef.current.getPosition().yaw + 0.1,
				pitch: psvRef.current.getPosition().pitch,
				speed: '0.5rpm',
			});
		});
}

function Panorama({ psvRef, pano, panoData, setIsLoaded }) {
	const { panoChanged } = useContext(AppContext);
	return (
		<>
			<div
				className={`${styles.container} ${panoChanged ? styles.blurred : ''}`}
			>
				<ReactPhotoSphereViewer
					ref={psvRef}
					loadingImg={null}
					loadingTxt={null}
					width={'100%'}
					height={'100%'}
					src={pano}
					defaultZoomLvl={10}
					navbar={false}
					onReady={() => {
						setIsLoaded(true);
						const visibleRange = psvRef.current.getPlugin(VisibleRangePlugin);
						visibleRange.setRangesFromPanoData();
						visibleRange.setVerticalRange([0, 0]);
					}}
					panoData={panoData}
					plugins={[
						[
							VisibleRangePlugin,
							{
								usePanoData: true,
							},
						],
					]}
				/>
			</div>
			<Controls psvRef={psvRef} />
		</>
	);
}

export default Panorama;
