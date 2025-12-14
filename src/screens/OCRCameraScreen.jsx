import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import {OCRFrame, scanOCR} from 'vision-camera-ocr';

const OCRCameraScreen = ({navigation}) => {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedText, setScannedText] = useState('');

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const handleScan = async () => {
    if (!camera.current || isScanning) return;

    setIsScanning(true);
    try {
      const photo = await camera.current.takePhoto();
      const result = await scanOCR(photo.path);

      if (result && result.text) {
        setScannedText(result.text);
        
        // Extract numbers from text (simple extraction)
        const numbers = result.text.match(/\d+\.?\d*/g);
        
        if (numbers && numbers.length >= 2) {
          const temperature = parseFloat(numbers[0]);
          const weight = parseFloat(numbers[1]);
          
          Alert.alert(
            'Data Terdeteksi',
            `Suhu: ${temperature}°C\nBerat: ${weight} kg\n\nApakah data ini benar?`,
            [
              {
                text: 'Batal',
                style: 'cancel',
              },
              {
                text: 'Ya, Gunakan',
                onPress: () => {
                  navigation.navigate('AddOperation', {
                    ocrData: {
                      temperature: temperature.toString(),
                      weight: weight.toString(),
                    },
                  });
                },
              },
            ],
          );
        } else {
          Alert.alert(
            'Error',
            'Tidak dapat mendeteksi data suhu dan berat. Text: ' +
              result.text,
          );
        }
      } else {
        Alert.alert('Error', 'Tidak ada text yang terdeteksi');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Gagal melakukan scan OCR');
    } finally {
      setIsScanning(false);
    }
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Memerlukan izin kamera untuk menggunakan fitur OCR
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}>
          <Text style={styles.buttonText}>Berikan Izin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#059669" />
        <Text style={styles.message}>Memuat kamera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay}>
          <Text style={styles.instructions}>
            Arahkan kamera ke dokumen yang berisi data suhu dan berat
          </Text>
        </View>

        <View style={styles.scanArea}>
          <View style={styles.corner} style={[styles.corner, styles.topLeft]} />
          <View style={styles.corner} style={[styles.corner, styles.topRight]} />
          <View style={styles.corner} style={[styles.corner, styles.bottomLeft]} />
          <View style={styles.corner} style={[styles.corner, styles.bottomRight]} />
        </View>

        <View style={styles.bottomOverlay}>
          {scannedText ? (
            <View style={styles.resultContainer}>
              <Text style={styles.resultLabel}>Text Terdeteksi:</Text>
              <Text style={styles.resultText}>{scannedText}</Text>
            </View>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
              onPress={handleScan}
              disabled={isScanning}>
              {isScanning ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.scanButtonText}>📷 Scan</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.cancelButtonText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#059669',
    padding: 15,
    borderRadius: 8,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructions: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  scanArea: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#059669',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 20,
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  resultLabel: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  resultText: {
    color: 'white',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 10,
  },
  scanButton: {
    backgroundColor: '#059669',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  scanButtonDisabled: {
    backgroundColor: '#047857',
    opacity: 0.7,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OCRCameraScreen;
