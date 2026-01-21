/**
 * @file MobilityEngine.ts
 * @description YYC³ AI浮窗系统移动性引擎 - 负责处理系统在不同位置、设备、平台之间的移动
 * @module lib/mobility
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface Location {
  type: 'physical' | 'virtual' | 'network';
  coordinates?: {
    x: number;
    y: number;
    z?: number;
  };
  url?: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export interface Device {
  id: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'iot';
  name: string;
  os: string;
  osVersion: string;
  capabilities: DeviceCapabilities;
  status: 'online' | 'offline' | 'busy';
  lastSeen: number;
}

export interface DeviceCapabilities {
  screenSize: { width: number; height: number };
  touchSupport: boolean;
  microphone: boolean;
  camera: boolean;
  networkSpeed: 'slow' | 'medium' | 'fast';
  storage: number;
  memory: number;
  cpuCores: number;
}

export interface Platform {
  type: 'web' | 'mobile' | 'desktop' | 'api';
  name: string;
  version: string;
  features: string[];
}

export interface MobilityContext {
  currentLocation: Location;
  currentDevice: Device;
  currentPlatform: Platform;
  targetLocation?: Location;
  targetDevice?: Device;
  targetPlatform?: Platform;
  timestamp: number;
}

export interface MobilityState {
  isMoving: boolean;
  moveProgress: number;
  moveStartTime: number;
  moveEndTime?: number;
  moveError?: Error;
}

export interface MobilityMetrics {
  totalMoves: number;
  successfulMoves: number;
  failedMoves: number;
  averageMoveTime: number;
  averageMoveDistance: number;
}

export class MobilityEngine extends EventEmitter {
  private static instance: MobilityEngine;
  private currentContext: MobilityContext | null = null;
  private moveState: MobilityState = {
    isMoving: false,
    moveProgress: 0,
    moveStartTime: 0,
  };
  private metrics: MobilityMetrics = {
    totalMoves: 0,
    successfulMoves: 0,
    failedMoves: 0,
    averageMoveTime: 0,
    averageMoveDistance: 0,
  };
  private spatialManager: SpatialManager;
  private deviceManager: DeviceManager;
  private platformManager: PlatformManager;
  private serviceManager: ServiceManager;

  private constructor() {
    super();
    this.spatialManager = new SpatialManager();
    this.deviceManager = new DeviceManager();
    this.platformManager = new PlatformManager();
    this.serviceManager = new ServiceManager();
    this.initialize();
  }

  static getInstance(): MobilityEngine {
    if (!MobilityEngine.instance) {
      MobilityEngine.instance = new MobilityEngine();
    }
    return MobilityEngine.instance;
  }

  private async initialize(): Promise<void> {
    await this.detectCurrentContext();
    this.setupEventListeners();
    this.emit('initialized', this.currentContext);
  }

  public async dispose(): Promise<void> {
    // Remove all event listeners
    this.removeAllListeners();
    
    // Clean up manager event listeners
    this.spatialManager.removeAllListeners();
    this.deviceManager.removeAllListeners();
    this.platformManager.removeAllListeners();
    
    // Clean up state manually without re-initializing
    this.currentContext = null;
    this.moveState = {
      isMoving: false,
      moveProgress: 0,
      moveStartTime: 0,
    };
    this.metrics = {
      totalMoves: 0,
      successfulMoves: 0,
      failedMoves: 0,
      averageMoveTime: 0,
      averageMoveDistance: 0,
    };
    
    // Emit dispose event
    this.emit('disposed');
  }

  private async detectCurrentContext(): Promise<void> {
    const currentLocation = await this.spatialManager.detectCurrentLocation();
    const currentDevice = await this.deviceManager.detectCurrentDevice();
    const currentPlatform = await this.platformManager.detectCurrentPlatform();

    this.currentContext = {
      currentLocation,
      currentDevice,
      currentPlatform,
      timestamp: Date.now(),
    };
  }

  private setupEventListeners(): void {
    this.spatialManager.on('location-changed', (location: Location) => {
      this.handleLocationChange(location);
    });

    this.deviceManager.on('device-changed', (device: Device) => {
      this.handleDeviceChange(device);
    });

    this.platformManager.on('platform-changed', (platform: Platform) => {
      this.handlePlatformChange(platform);
    });
  }

  private handleLocationChange(location: Location): void {
    if (this.currentContext) {
      this.currentContext.currentLocation = location;
      this.currentContext.timestamp = Date.now();
      this.emit('context-updated', this.currentContext);
    }
  }

  private handleDeviceChange(device: Device): void {
    if (this.currentContext) {
      this.currentContext.currentDevice = device;
      this.currentContext.timestamp = Date.now();
      this.emit('context-updated', this.currentContext);
    }
  }

  private handlePlatformChange(platform: Platform): void {
    if (this.currentContext) {
      this.currentContext.currentPlatform = platform;
      this.currentContext.timestamp = Date.now();
      this.emit('context-updated', this.currentContext);
    }
  }

  public getCurrentContext(): MobilityContext | null {
    return this.currentContext;
  }

  public getMoveState(): MobilityState {
    return { ...this.moveState };
  }

  public getMetrics(): MobilityMetrics {
    return { ...this.metrics };
  }

  public async moveTo(
    target: Location | Device | Platform
  ): Promise<void> {
    if (this.moveState.isMoving) {
      throw new Error('Already moving');
    }

    const currentContext = this.currentContext;
    if (!currentContext) {
      throw new Error('No current context');
    }

    const targetContext = await this.getTargetContext(target);

    await this.validateTransition(currentContext, targetContext);
    await this.prepareTransition(currentContext, targetContext);
    await this.executeTransition(currentContext, targetContext);
    await this.finalizeTransition(currentContext, targetContext);
  }

  private async getTargetContext(
    target: Location | Device | Platform
  ): Promise<Partial<MobilityContext>> {
    if ('type' in target && (target.type === 'physical' || target.type === 'virtual' || target.type === 'network')) {
      return { targetLocation: target as Location };
    } else if ('id' in target && 'type' in target) {
      return { targetDevice: target as Device };
    } else if ('type' in target && (target.type === 'web' || target.type === 'mobile' || target.type === 'desktop' || target.type === 'api')) {
      return { targetPlatform: target as Platform };
    }
    throw new Error('Invalid target');
  }

  private async validateTransition(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
    const validationErrors: string[] = [];

    if (targetContext.targetLocation) {
      const locationValid = await this.spatialManager.validateLocation(
        targetContext.targetLocation
      );
      if (!locationValid) {
        validationErrors.push('Invalid target location');
      }
    }

    if (targetContext.targetDevice) {
      const deviceValid = await this.deviceManager.validateDevice(
        targetContext.targetDevice
      );
      if (!deviceValid) {
        validationErrors.push('Invalid target device');
      }
    }

    if (targetContext.targetPlatform) {
      const platformValid = await this.platformManager.validatePlatform(
        targetContext.targetPlatform
      );
      if (!platformValid) {
        validationErrors.push('Invalid target platform');
      }
    }

    if (validationErrors.length > 0) {
      throw new Error(`Transition validation failed: ${validationErrors.join(', ')}`);
    }

    this.emit('transition-validated', { currentContext, targetContext });
  }

  private async prepareTransition(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
    this.emit('transition-preparing', { currentContext, targetContext });

    await this.serviceManager.prepareServices(currentContext, targetContext);

    this.emit('transition-prepared', { currentContext, targetContext });
  }

  private async executeTransition(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
    this.moveState.isMoving = true;
    this.moveState.moveStartTime = Date.now();
    this.moveState.moveProgress = 0;

    this.emit('transition-started', { currentContext, targetContext });

    try {
      if (targetContext.targetLocation) {
        await this.spatialManager.moveToLocation(targetContext.targetLocation);
        this.moveState.moveProgress = 33;
        this.emit('move-progress', this.moveState);
      }

      if (targetContext.targetDevice) {
        await this.deviceManager.moveToDevice(targetContext.targetDevice);
        this.moveState.moveProgress = 66;
        this.emit('move-progress', this.moveState);
      }

      if (targetContext.targetPlatform) {
        await this.platformManager.moveToPlatform(targetContext.targetPlatform);
        this.moveState.moveProgress = 100;
        this.emit('move-progress', this.moveState);
      }

      this.moveState.moveEndTime = Date.now();
      this.metrics.totalMoves++;
      this.metrics.successfulMoves++;
      this.updateAverageMoveTime();

      this.emit('transition-completed', { currentContext, targetContext });
    } catch (error) {
      this.moveState.moveError = error as Error;
      this.metrics.totalMoves++;
      this.metrics.failedMoves++;
      this.emit('transition-failed', { currentContext, targetContext, error });
      throw error;
    } finally {
      this.moveState.isMoving = false;
    }
  }

  private async finalizeTransition(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
    this.emit('transition-finalizing', { currentContext, targetContext });

    await this.serviceManager.finalizeServices(currentContext, targetContext);

    await this.detectCurrentContext();

    this.emit('transition-finalized', { currentContext, targetContext });
  }

  private updateAverageMoveTime(): void {
    if (this.moveState.moveEndTime && this.moveState.moveStartTime) {
      const moveTime = this.moveState.moveEndTime - this.moveState.moveStartTime;
      const totalMoveTime = this.metrics.averageMoveTime * (this.metrics.successfulMoves - 1);
      this.metrics.averageMoveTime = (totalMoveTime + moveTime) / this.metrics.successfulMoves;
    }
  }

  public async serializeState(): Promise<string> {
    if (!this.currentContext) {
      throw new Error('No current context to serialize');
    }

    const state = {
      context: this.currentContext,
      moveState: this.moveState,
      metrics: this.metrics,
      timestamp: Date.now(),
    };

    return JSON.stringify(state);
  }

  public async deserializeState(serializedState: string): Promise<void> {
    const state = JSON.parse(serializedState);

    this.currentContext = state.context;
    this.moveState = state.moveState;
    this.metrics = state.metrics;

    this.emit('state-restored', this.currentContext);
  }

  public async reset(): Promise<void> {
    this.currentContext = null;
    this.moveState = {
      isMoving: false,
      moveProgress: 0,
      moveStartTime: 0,
    };
    this.metrics = {
      totalMoves: 0,
      successfulMoves: 0,
      failedMoves: 0,
      averageMoveTime: 0,
      averageMoveDistance: 0,
    };

    await this.initialize();
  }
}

class SpatialManager extends EventEmitter {
  private currentLocation: Location | null = null;

  async detectCurrentLocation(): Promise<Location> {
    if (typeof window === 'undefined') {
      return {
        type: 'virtual',
        path: '/default',
      };
    }

    this.currentLocation = {
      type: 'virtual',
      url: window.location.href,
      path: window.location.pathname,
      metadata: {
        hash: window.location.hash,
        search: window.location.search,
      },
    };

    return this.currentLocation;
  }

  async validateLocation(location: Location): Promise<boolean> {
    return location.type === 'physical' || location.type === 'virtual' || location.type === 'network';
  }

  async moveToLocation(location: Location): Promise<void> {
    if (location.type === 'virtual' && location.url) {
      window.location.href = location.url;
    }

    this.currentLocation = location;
    this.emit('location-changed', location);
  }
}

class DeviceManager extends EventEmitter {
  private currentDevice: Device | null = null;

  async detectCurrentDevice(): Promise<Device> {
    if (typeof window === 'undefined') {
      return {
        id: 'default-device',
        type: 'desktop',
        name: 'Default Device',
        os: 'Unknown',
        osVersion: 'Unknown',
        capabilities: {
          screenSize: { width: 1920, height: 1080 },
          touchSupport: false,
          microphone: false,
          camera: false,
          networkSpeed: 'fast',
          storage: 1024,
          memory: 8,
          cpuCores: 4,
        },
        status: 'online',
        lastSeen: Date.now(),
      };
    }

    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isTablet = /iPad|Tablet/i.test(userAgent);

    this.currentDevice = {
      id: this.generateDeviceId(),
      type: isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
      name: this.getDeviceName(userAgent),
      os: this.getOS(userAgent),
      osVersion: this.getOSVersion(userAgent),
      capabilities: {
        screenSize: { width: window.innerWidth, height: window.innerHeight },
        touchSupport: 'ontouchstart' in window,
        microphone: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        networkSpeed: this.estimateNetworkSpeed(),
        storage: this.estimateStorage(),
        memory: this.estimateMemory(),
        cpuCores: navigator.hardwareConcurrency || 4,
      },
      status: 'online',
      lastSeen: Date.now(),
    };

    return this.currentDevice;
  }

  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceName(userAgent: string): string {
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Android/i.test(userAgent)) return 'Android Device';
    if (/Mac/i.test(userAgent)) return 'Mac';
    if (/Windows/i.test(userAgent)) return 'Windows PC';
    if (/Linux/i.test(userAgent)) return 'Linux PC';
    return 'Unknown Device';
  }

  private getOS(userAgent: string): string {
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/Mac/i.test(userAgent)) return 'macOS';
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  private getOSVersion(userAgent: string): string {
    const match = userAgent.match(/(OS|Android|Windows|Mac OS X) ([\d_.]+)/);
    return match ? match[2].replace(/_/g, '.') : 'Unknown';
  }

  private estimateNetworkSpeed(): 'slow' | 'medium' | 'fast' {
    const connection = (navigator as any).connection;
    if (connection) {
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        return 'slow';
      }
      if (connection.effectiveType === '3g') {
        return 'medium';
      }
      return 'fast';
    }
    return 'fast';
  }

  private estimateStorage(): number {
    if (navigator.storage && navigator.storage.estimate) {
      return navigator.storage.estimate().then(estimate => estimate.quota || 0);
    }
    return 0;
  }

  private estimateMemory(): number {
    return (navigator as any).deviceMemory || 4;
  }

  async validateDevice(device: Device): Promise<boolean> {
    return device.status === 'online';
  }

  async moveToDevice(device: Device): Promise<void> {
    this.currentDevice = device;
    this.emit('device-changed', device);
  }
}

class PlatformManager extends EventEmitter {
  private currentPlatform: Platform | null = null;

  async detectCurrentPlatform(): Promise<Platform> {
    if (typeof window === 'undefined') {
      return {
        type: 'api',
        name: 'Server',
        version: '1.0.0',
        features: [],
      };
    }

    this.currentPlatform = {
      type: 'web',
      name: 'Web Platform',
      version: '1.0.0',
      features: [
        'drag-and-drop',
        'voice-recognition',
        'voice-synthesis',
        'responsive-design',
      ],
    };

    return this.currentPlatform;
  }

  async validatePlatform(platform: Platform): Promise<boolean> {
    return platform.type === 'web' || platform.type === 'mobile' || platform.type === 'desktop' || platform.type === 'api';
  }

  async moveToPlatform(platform: Platform): Promise<void> {
    this.currentPlatform = platform;
    this.emit('platform-changed', platform);
  }
}

class ServiceManager {
  async prepareServices(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
  }

  async finalizeServices(
    currentContext: MobilityContext,
    targetContext: Partial<MobilityContext>
  ): Promise<void> {
  }
}

export default MobilityEngine;
