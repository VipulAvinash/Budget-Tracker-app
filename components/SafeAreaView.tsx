
import { SafeAreaView } from "react-native-safe-area-context";
import { cssInterop } from "nativewind";

cssInterop(SafeAreaView, {
  className: "style",
});

export default SafeAreaView;