import { View } from "react-native";
import { COLOR_PALETE } from "../../utils/colors";
import {
    BusIcon,
    CategoryBtn,
    CategoryBtnText,
    CategoryBtnWrapper,
    SearchInput,
    TransportRow,
    TransportRowBtn,
    TransportRowText,
    transportTypes,
    Wrapper,
} from "./SharedComponents";

export function ListOfTransport({ route, navigation }: any) {
    const { transportType } = route.params;
    const itemsColor = transportTypes[transportType].color;

    return (
        <Wrapper>
            <View style={{ gap: 13 }}>
                <SearchInput />
                <CategoryBtnWrapper>
                    {transportTypes.map((Type, idx) => (
                        <CategoryBtn
                            onPress={() =>
                                navigation.navigate("ListOfTransport", {
                                    transportType: idx,
                                })
                            }
                            isActive={idx === transportType}
                            key={idx}
                            style={{ backgroundColor: Type.color }}
                        >
                            <Type.icon />
                            <CategoryBtnText>{Type.title}</CategoryBtnText>
                        </CategoryBtn>
                    ))}
                </CategoryBtnWrapper>
            </View>
            <TransportRow style={{ columnGap: 10 / 1.5, rowGap: 25 / 2 }}>
                {Array.from(new Array(15 + transportType + 1), () => 1).map((_, i) => (
                    <TransportRowBtn key={i} bg={itemsColor}>
                        <TransportRowText>12</TransportRowText>
                    </TransportRowBtn>
                ))}
            </TransportRow>
        </Wrapper>
    );
}
