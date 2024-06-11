import { FocusAwareStatusBar, Text } from "@/ui";
import { Skia } from "@shopify/react-native-skia";
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import { StyleSheet } from "react-native";

export default function Pick() {
  const device = useCameraDevice("back");

  const frameProcessor = useFrameProcessor((frame) => {
    "worklet";
    const paint = Skia.Paint();
    paint.setColor(Skia.Color("red"));
    const surface = Skia.Surface.Make(200, 200);
    if (surface !== null) {
      const canvas = surface.getCanvas();
      canvas.drawRect(Skia.XYWHRect(10, 10, 100, 100), paint);
    }
  }, []);

  if (device == null) return <Text>Loading Camera...</Text>;
  return (
    <>
      <FocusAwareStatusBar />
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          frameProcessor={frameProcessor}
        />
      )}
    </>
  );
}
