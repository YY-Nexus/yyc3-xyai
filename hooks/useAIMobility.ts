/**
 * @file useAIMobility.ts
 * @description YYC³ AI浮窗系统移动性Hook - 集成移动性、自适应、连续性引擎
 * @module hooks
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import MobilityEngine, {
  type MobilityContext,
  type MobilityState,
  type MobilityMetrics,
  type Location,
  type Device,
  type Platform,
} from '@/lib/mobility/MobilityEngine';
import AdaptabilityEngine, {
  type AdaptationContext,
  type Adaptation,
  type AdaptationRule,
} from '@/lib/adaptability/AdaptabilityEngine';
import ContinuityEngine, {
  type ContinuityState,
  type ContinuityMetrics,
} from '@/lib/continuity/ContinuityEngine';

export interface AIMobilityState {
  mobility: {
    context: MobilityContext | null;
    state: MobilityState;
    metrics: MobilityMetrics;
    isMoving: boolean;
  };
  adaptability: {
    context: AdaptationContext;
    isAdapting: boolean;
  };
  continuity: {
    state: ContinuityState;
    metrics: ContinuityMetrics;
    isMaintaining: boolean;
  };
}

export interface AIMobilityActions {
  mobility: {
    moveTo: (target: Location | Device | Platform) => Promise<void>;
    serializeState: () => Promise<string>;
    deserializeState: (serializedState: string) => Promise<void>;
    reset: () => Promise<void>;
  };
  adaptability: {
    adapt: () => Promise<void>;
    addRule: (rule: AdaptationRule) => void;
    removeRule: (ruleId: string) => void;
    enableRule: (ruleId: string) => void;
    disableRule: (ruleId: string) => void;
    reset: () => Promise<void>;
  };
  continuity: {
    maintain: () => Promise<void>;
    reset: () => Promise<void>;
  };
}

export function useAIMobility(): {
  state: AIMobilityState;
  actions: AIMobilityActions;
  isInitialized: boolean;
} {
  const [isInitialized, setIsInitialized] = useState(false);
  const [state, setState] = useState<AIMobilityState>({
    mobility: {
      context: null,
      state: {
        isMoving: false,
        moveProgress: 0,
        moveStartTime: 0,
      },
      metrics: {
        totalMoves: 0,
        successfulMoves: 0,
        failedMoves: 0,
        averageMoveTime: 0,
        averageMoveDistance: 0,
      },
      isMoving: false,
    },
    adaptability: {
      context: null as any,
      isAdapting: false,
    },
    continuity: {
      state: {
        isMaintaining: false,
        maintenanceProgress: 0,
        lastMaintenanceTime: 0,
        totalMaintenanceCount: 0,
        successfulMaintenanceCount: 0,
        failedMaintenanceCount: 0,
      },
      metrics: {
        stateCaptureTime: 0,
        stateRestoreTime: 0,
        dataSyncLatency: 0,
        serviceBridgeTime: 0,
        experiencePreservationTime: 0,
        continuitySuccessRate: 0,
        userSatisfactionScore: 0,
      },
      isMaintaining: false,
    },
  });

  const mobilityEngineRef = useRef<MobilityEngine | null>(null);
  const adaptabilityEngineRef = useRef<AdaptabilityEngine | null>(null);
  const continuityEngineRef = useRef<ContinuityEngine | null>(null);

  useEffect(() => {
    const initializeEngines = async () => {
      try {
        mobilityEngineRef.current = MobilityEngine.getInstance();
        adaptabilityEngineRef.current = AdaptabilityEngine.getInstance();
        continuityEngineRef.current = ContinuityEngine.getInstance();

        setupMobilityListeners();
        setupAdaptabilityListeners();
        setupContinuityListeners();

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize AI mobility engines:', error);
      }
    };

    initializeEngines();

    return () => {
      cleanup();
    };
  }, []);

  const setupMobilityListeners = () => {
    const mobilityEngine = mobilityEngineRef.current;
    if (!mobilityEngine) return;

    mobilityEngine.on('initialized', (context: MobilityContext) => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          context,
        },
      }));
    });

    mobilityEngine.on('context-updated', (context: MobilityContext) => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          context,
        },
      }));
    });

    mobilityEngine.on('transition-started', () => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          state: {
            ...prev.mobility.state,
            isMoving: true,
            moveProgress: 0,
            moveStartTime: Date.now(),
          },
          isMoving: true,
        },
      }));
    });

    mobilityEngine.on('move-progress', (moveState: MobilityState) => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          state: moveState,
        },
      }));
    });

    mobilityEngine.on('transition-completed', () => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          state: {
            ...prev.mobility.state,
            isMoving: false,
            moveProgress: 100,
          },
          isMoving: false,
          metrics: mobilityEngine.getMetrics(),
        },
      }));
    });

    mobilityEngine.on('transition-failed', () => {
      setState(prev => ({
        ...prev,
        mobility: {
          ...prev.mobility,
          state: {
            ...prev.mobility.state,
            isMoving: false,
          },
          isMoving: false,
          metrics: mobilityEngine.getMetrics(),
        },
      }));
    });
  };

  const setupAdaptabilityListeners = () => {
    const adaptabilityEngine = adaptabilityEngineRef.current;
    if (!adaptabilityEngine) return;

    adaptabilityEngine.on('initialized', (context: AdaptationContext) => {
      setState(prev => ({
        ...prev,
        adaptability: {
          ...prev.adaptability,
          context,
        },
      }));
    });

    adaptabilityEngine.on('adaptation-started', () => {
      setState(prev => ({
        ...prev,
        adaptability: {
          ...prev.adaptability,
          isAdapting: true,
        },
      }));
    });

    adaptabilityEngine.on('adaptation-completed', () => {
      setState(prev => ({
        ...prev,
        adaptability: {
          ...prev.adaptability,
          isAdapting: false,
          context: adaptabilityEngine.getAdaptationContext(),
        },
      }));
    });

    adaptabilityEngine.on('adaptation-failed', () => {
      setState(prev => ({
        ...prev,
        adaptability: {
          ...prev.adaptability,
          isAdapting: false,
        },
      }));
    });
  };

  const setupContinuityListeners = () => {
    const continuityEngine = continuityEngineRef.current;
    if (!continuityEngine) return;

    continuityEngine.on('initialized', (continuityState: ContinuityState) => {
      setState(prev => ({
        ...prev,
        continuity: {
          ...prev.continuity,
          state: continuityState,
        },
      }));
    });

    continuityEngine.on('continuity-maintenance-started', () => {
      setState(prev => ({
        ...prev,
        continuity: {
          ...prev.continuity,
          state: {
            ...prev.continuity.state,
            isMaintaining: true,
            maintenanceProgress: 0,
          },
          isMaintaining: true,
        },
      }));
    });

    continuityEngine.on('maintenance-progress', (continuityState: ContinuityState) => {
      setState(prev => ({
        ...prev,
        continuity: {
          ...prev.continuity,
          state: continuityState,
        },
      }));
    });

    continuityEngine.on('continuity-maintenance-completed', () => {
      setState(prev => ({
        ...prev,
        continuity: {
          ...prev.continuity,
          state: {
            ...prev.continuity.state,
            isMaintaining: false,
            maintenanceProgress: 100,
          },
          isMaintaining: false,
          metrics: continuityEngine.getMetrics(),
        },
      }));
    });

    continuityEngine.on('continuity-maintenance-failed', () => {
      setState(prev => ({
        ...prev,
        continuity: {
          ...prev.continuity,
          state: {
            ...prev.continuity.state,
            isMaintaining: false,
          },
          isMaintaining: false,
        },
      }));
    });
  };

  const cleanup = () => {
    const mobilityEngine = mobilityEngineRef.current;
    const adaptabilityEngine = adaptabilityEngineRef.current;
    const continuityEngine = continuityEngineRef.current;

    if (mobilityEngine) {
      mobilityEngine.removeAllListeners();
    }
    if (adaptabilityEngine) {
      adaptabilityEngine.removeAllListeners();
    }
    if (continuityEngine) {
      continuityEngine.removeAllListeners();
    }
  };

  const actions: AIMobilityActions = {
    mobility: {
      moveTo: useCallback(async (target: Location | Device | Platform) => {
        const mobilityEngine = mobilityEngineRef.current;
        if (!mobilityEngine) {
          throw new Error('Mobility engine not initialized');
        }
        return mobilityEngine.moveTo(target);
      }, []),

      serializeState: useCallback(async () => {
        const mobilityEngine = mobilityEngineRef.current;
        if (!mobilityEngine) {
          throw new Error('Mobility engine not initialized');
        }
        return mobilityEngine.serializeState();
      }, []),

      deserializeState: useCallback(async (serializedState: string) => {
        const mobilityEngine = mobilityEngineRef.current;
        if (!mobilityEngine) {
          throw new Error('Mobility engine not initialized');
        }
        return mobilityEngine.deserializeState(serializedState);
      }, []),

      reset: useCallback(async () => {
        const mobilityEngine = mobilityEngineRef.current;
        if (!mobilityEngine) {
          throw new Error('Mobility engine not initialized');
        }
        return mobilityEngine.reset();
      }, []),
    },

    adaptability: {
      adapt: useCallback(async () => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        return adaptabilityEngine.adapt();
      }, []),

      addRule: useCallback((rule: AdaptationRule) => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        adaptabilityEngine.addAdaptationRule(rule);
      }, []),

      removeRule: useCallback((ruleId: string) => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        adaptabilityEngine.removeAdaptationRule(ruleId);
      }, []),

      enableRule: useCallback((ruleId: string) => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        adaptabilityEngine.enableAdaptationRule(ruleId);
      }, []),

      disableRule: useCallback((ruleId: string) => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        adaptabilityEngine.disableAdaptationRule(ruleId);
      }, []),

      reset: useCallback(async () => {
        const adaptabilityEngine = adaptabilityEngineRef.current;
        if (!adaptabilityEngine) {
          throw new Error('Adaptability engine not initialized');
        }
        return adaptabilityEngine.reset();
      }, []),
    },

    continuity: {
      maintain: useCallback(async () => {
        const continuityEngine = continuityEngineRef.current;
        if (!continuityEngine) {
          throw new Error('Continuity engine not initialized');
        }
        return continuityEngine.maintainContinuity();
      }, []),

      reset: useCallback(async () => {
        const continuityEngine = continuityEngineRef.current;
        if (!continuityEngine) {
          throw new Error('Continuity engine not initialized');
        }
        return continuityEngine.reset();
      }, []),
    },
  };

  return {
    state,
    actions,
    isInitialized,
  };
}

export default useAIMobility;
