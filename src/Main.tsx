import {Series} from 'remotion';
import {MapTrip} from './MapTrip';
import {EiffelTower3D} from './EiffelTower3D';

export const Main: React.FC = () => {
	return (
		<Series>
			<Series.Sequence durationInFrames={450}>
				<MapTrip />
			</Series.Sequence>
			<Series.Sequence durationInFrames={150}>
				<EiffelTower3D />
			</Series.Sequence>
		</Series>
	);
};
