import { Alert, Platform } from 'react-native';

/**
 * Alert.alert của react-native-web không hiển thị gì (no-op), nên trên web
 * dùng window.confirm / window.alert; trên Android/iOS vẫn dùng Alert gốc.
 */
export function confirmDialog(
  title: string,
  message: string,
  labels: { cancel: string; confirm: string },
  onConfirm: () => void,
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: labels.cancel, style: 'cancel' },
    { text: labels.confirm, style: 'destructive', onPress: onConfirm },
  ]);
}

export function infoDialog(title: string, message: string) {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
