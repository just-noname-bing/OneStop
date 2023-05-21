import React, { ReactNode } from "react"
import { View } from "react-native"

interface Props { children: ReactNode }

export default function PageContainer({ children }: Props): JSX.Element {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white"
            }}
        >
            {children}
        </View>
    )
}
