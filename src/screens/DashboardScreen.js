import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {operationAPI} from '../config/api';

const DashboardScreen = ({navigation}) => {
  const [operations, setOperations] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [operationsRes, statsRes] = await Promise.all([
        operationAPI.getAll(),
        operationAPI.getStatistics(),
      ]);

      setOperations(operationsRes.data);
      setStatistics(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  const StatCard = ({title, value, icon, color}) => (
    <View style={[styles.statCard, {borderLeftColor: color}]}>
      <View style={styles.statIconContainer}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  const OperationItem = ({item}) => (
    <View style={styles.operationCard}>
      <View style={styles.operationHeader}>
        <View style={styles.operationDate}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.operationDateText}>
            {new Date(item.operationDate).toLocaleDateString('id-ID')}
          </Text>
        </View>
        <View
          style={[
            styles.qualityBadge,
            item.quality === 'OK' ? styles.qualityOK : styles.qualityNotOK,
          ]}>
          <Text style={styles.qualityText}>{item.quality}</Text>
        </View>
      </View>

      <View style={styles.operationDetails}>
        <View style={styles.detailRow}>
          <Icon name="people-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Group:</Text>
          <Text style={styles.detailValue}>{item.group?.name || '-'}</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="time-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Shift:</Text>
          <Text style={styles.detailValue}>
            {item.shift?.shiftNumber || '-'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="git-branch-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Line:</Text>
          <Text style={styles.detailValue}>
            {item.productionLine?.lineCode || '-'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="thermometer-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Temp:</Text>
          <Text style={styles.detailValue}>{item.temperature}°C</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="scale-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Weight:</Text>
          <Text style={styles.detailValue}>{item.weight} kg</Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="phone-portrait-outline" size={16} color="#666" />
          <Text style={styles.detailLabel}>Method:</Text>
          <Text style={styles.detailValue}>{item.inputMethod}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Statistics Section */}
        {statistics && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Today's Statistics</Text>
            <View style={styles.statsGrid}>
              <StatCard
                title="Total Operations"
                value={statistics.totalOperations || 0}
                icon="file-tray-full-outline"
                color="#007AFF"
              />
              <StatCard
                title="Quality OK"
                value={statistics.qualityOK || 0}
                icon="checkmark-circle-outline"
                color="#4CAF50"
              />
              <StatCard
                title="Quality Not OK"
                value={statistics.qualityNotOK || 0}
                icon="close-circle-outline"
                color="#F44336"
              />
              <StatCard
                title="Avg Temperature"
                value={`${statistics.avgTemperature?.toFixed(1) || 0}°C`}
                icon="thermometer-outline"
                color="#FF9800"
              />
              <StatCard
                title="Avg Weight"
                value={`${statistics.avgWeight?.toFixed(2) || 0} kg`}
                icon="scale-outline"
                color="#9C27B0"
              />
              <StatCard
                title="Active Lines"
                value={statistics.activeLines || 0}
                icon="git-branch-outline"
                color="#00BCD4"
              />
            </View>
          </View>/
        )}

        {/* Recent Operations Section */}
        <View style={styles.operationsSection}>
          <View style={styles.operationsHeader}>
            <Text style={styles.sectionTitle}>Recent Operations</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('OperationForm')}>
              <Icon name="add-circle" size={28} color="#007AFF" />
            </TouchableOpacity>
          </View>

          {operations.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="document-outline" size={64} color="#CCC" />
              <Text style={styles.emptyText}>No operations yet</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('OperationForm')}>
                <Text style={styles.addButtonText}>Add First Operation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={operations}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => <OperationItem item={item} />}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('OperationForm')}>
        <Icon name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  operationsSection: {
    padding: 16,
    paddingBottom: 80,
  },
  operationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  operationCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  operationDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationDateText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
  },
  qualityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  qualityOK: {
    backgroundColor: '#E8F5E9',
  },
  qualityNotOK: {
    backgroundColor: '#FFEBEE',
  },
  qualityText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  operationDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    width: 70,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

export default DashboardScreen;