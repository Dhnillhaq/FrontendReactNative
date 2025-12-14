import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {OCRFrame, scanOCR} from 'vision-camera-ocr';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const OCRCamera = ({onWeightDetected, onClose}) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const camera = useRef(null);
  const devices = useCameraDevices();
  const device = devices.back;

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();
    setHasPermission(permission === 'authorized');
    if (permission === 'denied') {
      Alert.alert('Permission Denied', 'Camera permission is required for OCR');
    }
  };

  const processOCR = async () => {
    if (!camera.current || isScanning) return;

    setIsScanning(true);
    try {
      const photo = await camera.current.takePhoto({
        qualityPrioritization: 'quality',
        flash: 'off',
      });

      // Scan OCR from photo
      const result = await scanOCR(photo.path);
      
      // Extract number from OCR result
      const extractedWeight = extractWeightFromText(result.text);
      
      if (extractedWeight) {
        setDetectedText(`Detected: ${extractedWeight} kg`);
        Alert.alert(
          'Weight Detected',
          `Found weight: ${extractedWeight} kg\n\nUse this value?`,
          [
            {text: 'Retry', style: 'cancel', onPress: () => setIsScanning(false)},
            {
              text: 'Use',
              onPress: () => {
                onWeightDetected(extractedWeight);
                onClose();
              },
            },
          ],
        );
      } else {
        Alert.alert('No Weight Found', 'Please try again with a clearer image');
        setIsScanning(false);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Scan Failed', 'Failed to scan. Please try again.');
      setIsScanning(false);
    }
  };

  // Extract weight number from OCR text
  const extractWeightFromText = (text) => {
    // Remove all spaces and newlines
    const cleanText = text.replace(/\s+/g, '');
    
    // Try to find patterns like: 1.5kg, 1.5 kg, 1,5kg, 1.5
    const patterns = [
      /(\d+[.,]\d+)\s*kg/i,  // 1.5kg or 1,5kg
      /(\d+[.,]\d+)/,        // Just number with decimal
      /(\d+)\s*kg/i,         // 1kg
      /(\d+)/,               // Just number
    ];

    for (const pattern of patterns) {
      const match = cleanText.match(pattern);
      if (match) {
        // Replace comma with dot for float parsing
        const number = match[1].replace(',', '.');
        const weight = parseFloat(number);
        if (!isNaN(weight) && weight > 0 && weight < 1000) {
          return weight;
        }
      }
    }
    return null;
  };

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Overlay frame for guidance */}
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanFrame}>
            <View style={styles.corner} style={[styles.corner, styles.topLeft]} />
            <View style={styles.corner} style={[styles.corner, styles.topRight]} />
            <View style={styles.corner} style={[styles.corner, styles.bottomLeft]} />
            <View style={styles.corner} style={[styles.corner, styles.bottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructionText}>
            Align the scale display within the frame
          </Text>
          {detectedText ? (
            <Text style={styles.detectedText}>{detectedText}</Text>
          ) : null}
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={30} color="#FFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, isScanning && styles.capturingButton]}
          onPress={processOCR}
          disabled={isScanning}>
          {isScanning ? (
            <ActivityIndicator size="large" color="#FFF" />
          ) : (
            <View style={styles.captureInner} />
          )}
        </TouchableOpacity>

        <View style={styles.closeButton} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 200,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanFrame: {
    width: width * 0.7,
    height: 200,
    borderWidth: 2,
    borderColor: '#FFF',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00FF00',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  detectedText: {
    color: '#00FF00',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#007AFF',
  },
  capturingButton: {
    backgroundColor: '#007AFF',
  },
  captureInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
  },
  permissionText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 50,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 20,
  },
});

export default OCRCamera;