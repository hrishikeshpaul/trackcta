import { View } from 'react-native';
import Svg, { Path, G, Rect } from 'react-native-svg';

interface Props {
    direction: number;
}

export default function Arrow({ direction }: Props) {
    return (
        <View
            style={{
                transform: [{ rotate: `${direction}deg` }, { translateX: 4 }, { translateY: 0 }],
            }}
        >
            <Svg width="17" height="20" viewBox="0 0 17 20">
                <G id="Group_4" data-name="Group 4" transform="translate(-230 -558)">
                    <Rect
                        id="Rectangle_8"
                        data-name="Rectangle 8"
                        width="17"
                        height="20"
                        transform="translate(230 558)"
                        fill="none"
                    />
                    <G id="arrow" transform="translate(235.095 563.919)">
                        <Path
                            id="Path_18"
                            data-name="Path 18"
                            d="M18,15.662V7.5"
                            transform="translate(-14.595 -7.5)"
                            fill="none"
                            stroke="#c84a44"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        />
                        <Path
                            id="Path_19"
                            data-name="Path 19"
                            d="M7.5,11.581,10.9,7.5l3.4,4.081"
                            transform="translate(-7.5 -7.5)"
                            fill="none"
                            stroke="#c84a44"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                        />
                    </G>
                </G>
            </Svg>
        </View>
    );
}
