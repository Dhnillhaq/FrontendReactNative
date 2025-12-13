import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {getOperations, deleteOperation} from '../config/api';

const OperationsListScreen = ({navigation}) => {
  const [operations, setOperations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOperations = async () => {
    try {
      const data = await getOperations();
      setOperations(data);
    } catch (error) {
      console.error('Error loading operations:', error);
      Alert.alert('Error', 'Gagal memuat data operasi');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadOperations();
    });
    return unsubscribe;
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOperations();
  };

  const handleDelete = id => {
    Alert.alert(
      'Konfirmasi',
      'Apakah Anda yakin ingin menghapus operasi ini?',
      [
        {text: 'Batal', style: 'cancel'},
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteOperation(id);
              loadOperations();
              Alert.alert('Sukses', 'Operasi berhasil dihapus');
            } catch (error) {
              Alert.alert('Error', 'Gagal menghapus operasi');
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>{item.group?.name || '-'}</Text>
          <Text style={styles.cardSubtitle}>
            {new Date(item.operationDate).toLocaleDateString('id-ID')}
          </Text>
        </View>
        <View
          style={[
            styles.qualityBadge,
            item.quality === 'OK' ? styles.badgeOK : styles.badgeNotOK,
          ]}>
          <Text style={styles.badgeText}>{item.quality}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Shift:</Text>
          <Text style={styles.infoValue}>{item.shift?.shiftNumber || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Line:</Text>
          <Text style={styles.infoValue}>
            {item.productionLine?.lineCode || '-'}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Suhu:</Text>
          <Text style={styles.infoValue}>{item.temperature}°C</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Berat:</Text>
          <Text style={styles.infoValue}>{item.weight} kg</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Metode:</Text>
          <View
            style={[
              styles.methodBadge,
              item.inputMethod === 'MANUAL'
                ? styles.badgeManual
                : styles.badgeOCR,
            ]}>
            <Text style={styles.badgeText}>{item.inputMethod}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditOperation', {id: item.id})}>
          <Icon name="create-outline" size={20} color="#059669" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}>
          <Icon name="trash-outline" size={20} color="#ef4444" />
          <Text style={styles.deleteButtonText}>Hapus</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={operations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#059669']}
          />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>Belum ada data operasi</Text>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddOperation')}>
        <Icon name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  cardBody: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#111',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#059669',
    gap: 5,
  },
  editButtonText: {
    color: '#059669',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ef4444',
    gap: 5,
  },
  deleteButtonText: {
    color: '#ef4444',
    fontWeight: '600',
  },
  qualityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  methodBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeOK: {
    backgroundColor: '#10b981',
  },
  badgeNotOK: {
    backgroundColor: '#ef4444',
  },
  badgeManual: {
    backgroundColor: '#3b82f6',
  },
  badgeOCR: {
    backgroundColor: '#a855f7',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
});

export default OperationsListScreen;
