import MobilityEngine from './lib/mobility/MobilityEngine';

async function testDispose() {
  console.log('Testing MobilityEngine dispose functionality...');
  
  // Create engine instance
  const engine = MobilityEngine.getInstance();
  
  // Check initial listener count
  const initialLocationListeners = engine.spatialManager.listenerCount('location-changed');
  const initialDeviceListeners = engine.deviceManager.listenerCount('device-changed');
  const initialPlatformListeners = engine.platformManager.listenerCount('platform-changed');
  
  console.log(`Initial listeners: location=${initialLocationListeners}, device=${initialDeviceListeners}, platform=${initialPlatformListeners}`);
  
  // Add some test listeners
  const locationHandler = () => console.log('location changed');
  const deviceHandler = () => console.log('device changed');
  const platformHandler = () => console.log('platform changed');
  
  engine.spatialManager.on('location-changed', locationHandler);
  engine.deviceManager.on('device-changed', deviceHandler);
  engine.platformManager.on('platform-changed', platformHandler);
  
  // Check listener count after adding
  const afterAddLocationListeners = engine.spatialManager.listenerCount('location-changed');
  const afterAddDeviceListeners = engine.deviceManager.listenerCount('device-changed');
  const afterAddPlatformListeners = engine.platformManager.listenerCount('platform-changed');
  
  console.log(`Listeners after adding: location=${afterAddLocationListeners}, device=${afterAddDeviceListeners}, platform=${afterAddPlatformListeners}`);
  
  // Call dispose
  await engine.dispose();
  
  // Check listener count after dispose
  const afterDisposeLocationListeners = engine.spatialManager.listenerCount('location-changed');
  const afterDisposeDeviceListeners = engine.deviceManager.listenerCount('device-changed');
  const afterDisposePlatformListeners = engine.platformManager.listenerCount('platform-changed');
  
  console.log(`Listeners after dispose: location=${afterDisposeLocationListeners}, device=${afterDisposeDeviceListeners}, platform=${afterDisposePlatformListeners}`);
  
  if (afterDisposeLocationListeners === 0 && afterDisposeDeviceListeners === 0 && afterDisposePlatformListeners === 0) {
    console.log('✅ Dispose method successfully removed all listeners!');
  } else {
    console.log('❌ Dispose method did not remove all listeners!');
  }
}

testDispose().catch(console.error);