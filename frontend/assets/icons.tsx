import Svg, { Path, Rect } from "react-native-svg";
import { COLOR_PALETE } from "../utils/colors";

export function Lupa() {
    return (
        <Svg width={15} height={16} viewBox="0 0 15 16" fill="none">
            <Path
                d="M13.5511 15.2653L8.77841 10.4858C8.35227 10.8272 7.86222 11.0974 7.30824 11.2966C6.75426 11.4957 6.16477 11.5953 5.53977 11.5953C3.99148 11.5953 2.68125 11.0582 1.60909 9.98393C0.536932 8.90967 0.000568182 7.59758 0 6.04765C0 4.49715 0.536364 3.18506 1.60909 2.11138C2.68182 1.0377 3.99205 0.500569 5.53977 0.5C7.08807 0.5 8.3983 1.03713 9.47045 2.11138C10.5426 3.18563 11.079 4.49772 11.0795 6.04765C11.0795 6.67354 10.9801 7.26387 10.7812 7.81863C10.5824 8.3734 10.3125 8.86415 9.97159 9.2909L14.7656 14.0917C14.9219 14.2482 15 14.4403 15 14.6679C15 14.8954 14.9148 15.0946 14.7443 15.2653C14.5881 15.4218 14.3892 15.5 14.1477 15.5C13.9062 15.5 13.7074 15.4218 13.5511 15.2653ZM5.53977 9.88834C6.60511 9.88834 7.5108 9.51479 8.25682 8.76771C9.00284 8.02063 9.37557 7.11394 9.375 6.04765C9.375 4.9808 9.00199 4.07383 8.25597 3.32674C7.50994 2.57966 6.60455 2.2064 5.53977 2.20697C4.47443 2.20697 3.56875 2.58051 2.82273 3.3276C2.0767 4.07468 1.70398 4.98137 1.70455 6.04765C1.70455 7.11451 2.07756 8.02148 2.82358 8.76856C3.5696 9.51565 4.475 9.8889 5.53977 9.88834Z"
                fill="#8C8C8C"
            />
        </Svg>
    );
}


export function PencilIcon() {
    return (
        <Svg
            style={{ position: "absolute", top: 5, right: 5, zIndex: 2 }}
            pointerEvents={"none"}
            width={19 / 1.5}
            height={19 / 1.5}
            viewBox="0 0 19 19"
            fill="none"
        >
            <Path
                d="M16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3043 0.75 14.863 0.75C15.4217 0.75 15.8923 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.571 18.275 4.113C18.2917 4.655 18.1083 5.11733 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z"
                fill="black"
            />
        </Svg>
    );
}


export function TransportStopMarker() {
    return (
        <Svg width={31 / 1.5} height={35 / 1.5} viewBox="0 0 31 35" fill="none">
            <Rect width="31" height="35" rx="5" fill={COLOR_PALETE.troleybus} />
            <Path
                d="M5 23.4211C5 24.5789 5.51187 25.6184 6.3125 26.3421V28.6842C6.3125 29.4079 6.90312 30 7.625 30H8.9375C9.65938 30 10.25 29.4079 10.25 28.6842V27.3684H20.75V28.6842C20.75 29.4079 21.3406 30 22.0625 30H23.375C24.0969 30 24.6875 29.4079 24.6875 28.6842V26.3421C25.4881 25.6184 26 24.5789 26 23.4211V10.2632C26 5.65789 21.3013 5 15.5 5C9.69875 5 5 5.65789 5 10.2632V23.4211ZM9.59375 24.7368C8.50437 24.7368 7.625 23.8553 7.625 22.7632C7.625 21.6711 8.50437 20.7895 9.59375 20.7895C10.6831 20.7895 11.5625 21.6711 11.5625 22.7632C11.5625 23.8553 10.6831 24.7368 9.59375 24.7368ZM21.4062 24.7368C20.3169 24.7368 19.4375 23.8553 19.4375 22.7632C19.4375 21.6711 20.3169 20.7895 21.4062 20.7895C22.4956 20.7895 23.375 21.6711 23.375 22.7632C23.375 23.8553 22.4956 24.7368 21.4062 24.7368ZM23.375 16.8421H7.625V10.2632H23.375V16.8421Z"
                fill="white"
            />
        </Svg>
    );
}

export function GpsIconSvg() {
    return (
        <Svg width="25" height="25" viewBox="0 0 34 35" fill="none">
            <Path
                d="M16.9998 11.3332C13.5928 11.3332 10.8332 14.0928 10.8332 17.4998C10.8332 20.9069 13.5928 23.6665 16.9998 23.6665C20.4069 23.6665 23.1665 20.9069 23.1665 17.4998C23.1665 14.0928 20.4069 11.3332 16.9998 11.3332ZM30.7823 15.9582C30.0732 9.52942 24.9703 4.4265 18.5415 3.71734V0.541504H15.4582V3.71734C9.02942 4.4265 3.9265 9.52942 3.21734 15.9582H0.0415039V19.0415H3.21734C3.9265 25.4703 9.02942 30.5732 15.4582 31.2823V34.4582H18.5415V31.2823C24.9703 30.5732 30.0732 25.4703 30.7823 19.0415H33.9582V15.9582H30.7823ZM16.9998 28.2915C11.0336 28.2915 6.20817 23.4661 6.20817 17.4998C6.20817 11.5336 11.0336 6.70817 16.9998 6.70817C22.9661 6.70817 27.7915 11.5336 27.7915 17.4998C27.7915 23.4661 22.9661 28.2915 16.9998 28.2915Z"
                fill="#29221E"
            />
        </Svg>
    );
}

export function CreatePostIcon() {
    return (
        <Svg width={70 / 1.5} height={70 / 1.5} viewBox="0 0 70 70" fill="none">
            <Path
                d="M38.5 38.5H31.5V17.5H38.5M38.5 52.5H31.5V45.5H38.5M35 0C30.4037 0 25.8525 0.905302 21.6061 2.66422C17.3597 4.42313 13.5013 7.00121 10.2513 10.2513C3.68749 16.815 0 25.7174 0 35C0 44.2826 3.68749 53.185 10.2513 59.7487C13.5013 62.9988 17.3597 65.5769 21.6061 67.3358C25.8525 69.0947 30.4037 70 35 70C44.2826 70 53.185 66.3125 59.7487 59.7487C66.3125 53.185 70 44.2826 70 35C70 30.4037 69.0947 25.8525 67.3358 21.6061C65.5769 17.3597 62.9988 13.5013 59.7487 10.2513C56.4987 7.00121 52.6403 4.42313 48.3939 2.66422C44.1475 0.905302 39.5963 0 35 0Z"
                fill="#FF3838"
            />
        </Svg>
    );
}

export function BusIcon() {
    return (
        <Svg width={18 / 1.5} height={26 / 1.5} viewBox="0 0 18 26" fill="none">
            <Path
                d="M0.5 17.7368C0.5 18.6632 0.914375 19.4947 1.5625 20.0737V21.9474C1.5625 22.5263 2.04062 23 2.625 23H3.6875C4.27187 23 4.75 22.5263 4.75 21.9474V20.8947H13.25V21.9474C13.25 22.5263 13.7281 23 14.3125 23H15.375C15.9594 23 16.4375 22.5263 16.4375 21.9474V20.0737C17.0856 19.4947 17.5 18.6632 17.5 17.7368V7.21053C17.5 3.52632 13.6962 3 9 3C4.30375 3 0.5 3.52632 0.5 7.21053V17.7368ZM4.21875 18.7895C3.33687 18.7895 2.625 18.0842 2.625 17.2105C2.625 16.3368 3.33687 15.6316 4.21875 15.6316C5.10063 15.6316 5.8125 16.3368 5.8125 17.2105C5.8125 18.0842 5.10063 18.7895 4.21875 18.7895ZM13.7812 18.7895C12.8994 18.7895 12.1875 18.0842 12.1875 17.2105C12.1875 16.3368 12.8994 15.6316 13.7812 15.6316C14.6631 15.6316 15.375 16.3368 15.375 17.2105C15.375 18.0842 14.6631 18.7895 13.7812 18.7895ZM15.375 12.4737H2.625V7.21053H15.375V12.4737Z"
                fill="white"
            />
        </Svg>
    );
}


export function BigTrolleyIcon() {
    return (
        <Svg width={57 / 1.5} height={89 / 1.5} viewBox="0 0 57 89" fill="none">
            <Path
                d="M14.5938 13.9065H20.4344L14.8719 4.17211C14.3156 2.78149 14.5938 1.11274 15.9844 0.278364C17.375 -0.277886 19.0438 0.000238595 19.8781 1.39086L26.8312 13.9065H31.5594L25.9969 4.17211C25.4406 2.78149 25.7188 1.11274 27.1094 0.278364C28.5 -0.277886 30.1687 0.000238595 31.0031 1.39086L37.9562 13.9065H42.4062C50.1937 13.9065 56.3125 20.0252 56.3125 27.8127V52.844V69.5315C56.3125 72.0346 55.2 74.2596 53.5312 75.6502V80.6565C53.5312 85.3846 49.9156 89.0002 45.1875 89.0002C40.4594 89.0002 36.8438 85.3846 36.8438 80.6565V77.8752H20.1562V80.6565C20.1562 85.3846 16.5406 89.0002 11.8125 89.0002C7.08437 89.0002 3.46875 85.3846 3.46875 80.6565V75.6502C1.8 74.2596 0.6875 72.0346 0.6875 69.5315V52.844V27.8127C0.6875 20.0252 6.80625 13.9065 14.5938 13.9065ZM36.8438 66.7502H45.1875C46.8562 66.7502 47.9688 65.6377 47.9688 63.969C47.9688 62.3002 46.8562 61.1877 45.1875 61.1877H36.8438C35.175 61.1877 34.0625 62.3002 34.0625 63.969C34.0625 65.6377 35.175 66.7502 36.8438 66.7502ZM11.8125 66.7502H20.1562C21.825 66.7502 22.9375 65.6377 22.9375 63.969C22.9375 62.3002 21.825 61.1877 20.1562 61.1877H11.8125C10.1437 61.1877 9.03125 62.3002 9.03125 63.969C9.03125 65.6377 10.1437 66.7502 11.8125 66.7502ZM6.25 50.0627H50.75V30.594H6.25V50.0627Z"
                fill="white"
            />
        </Svg>
    );
}
export function BigBusIcon() {
    return (
        <Svg width={69 / 1.5} height={87 / 1.5} viewBox="0 0 69 87" fill="none">
            <Path
                d="M0 64.1053C0 68.1347 1.68187 71.7521 4.3125 74.2705V82.4211C4.3125 84.9395 6.25312 87 8.625 87H12.9375C15.3094 87 17.25 84.9395 17.25 82.4211V77.8421H51.75V82.4211C51.75 84.9395 53.6906 87 56.0625 87H60.375C62.7469 87 64.6875 84.9395 64.6875 82.4211V74.2705C67.3181 71.7521 69 68.1347 69 64.1053V18.3158C69 2.28947 53.5613 0 34.5 0C15.4387 0 0 2.28947 0 18.3158V64.1053ZM15.0938 68.6842C11.5144 68.6842 8.625 65.6163 8.625 61.8158C8.625 58.0153 11.5144 54.9474 15.0938 54.9474C18.6731 54.9474 21.5625 58.0153 21.5625 61.8158C21.5625 65.6163 18.6731 68.6842 15.0938 68.6842ZM53.9062 68.6842C50.3269 68.6842 47.4375 65.6163 47.4375 61.8158C47.4375 58.0153 50.3269 54.9474 53.9062 54.9474C57.4856 54.9474 60.375 58.0153 60.375 61.8158C60.375 65.6163 57.4856 68.6842 53.9062 68.6842ZM60.375 41.2105H8.625V18.3158H60.375V41.2105Z"
                fill="white"
            />
        </Svg>
    );
}
export function BigTramIcon() {
    return (
        <Svg width={61 / 1.5} height={91 / 1.5} viewBox="0 0 61 91" fill="none">
            <Path
                d="M60.5 67.977V29.575C60.5 16.8805 49.3143 14.105 34.7429 13.6955L38 6.825H51.9286V0H9.07143V6.825H29.4286L26.1714 13.741C12.7571 14.1505 0.5 16.9715 0.5 29.575V67.977C0.5 74.5745 5.6 80.08 11.6 81.4905L4.78571 88.725V91H14.3429L22.9143 81.9H39.0714L47.6429 91H56.2143V88.725L49.7857 81.9H49.4429C56.6857 81.9 60.5 75.6665 60.5 67.977ZM30.5 75.075C26.9429 75.075 24.0714 72.0265 24.0714 68.25C24.0714 64.4735 26.9429 61.425 30.5 61.425C34.0571 61.425 36.9286 64.4735 36.9286 68.25C36.9286 72.0265 34.0571 75.075 30.5 75.075ZM51.9286 54.6H9.07143V31.85H51.9286V54.6Z"
                fill="white"
            />
        </Svg>
    );
}

