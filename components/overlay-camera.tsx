import { View } from "@/ui";
import React from "react";

const OverlayContainer: React.FC = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Overlay background */}
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />

      {/* Scanner area */}
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
        <View
          style={{
            width: 250,
            height: 250,
            borderColor: "#fff",
            borderWidth: 1,
            borderRadius: 10,
          }}
        />
        <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }} />
      </View>

      {/* Overlay background */}
      <View
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      />
    </View>
  );
};

export default OverlayContainer;
