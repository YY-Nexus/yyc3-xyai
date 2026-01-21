/**
 * @file OptimizationEngine.ts
 * @description YYC³ AI浮窗系统优化引擎 - 多目标优化算法
 * @module lib/optimization
 * @author YYC³
 * @version 1.0.0
 * @created 2026-01-20
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

import { EventEmitter } from 'events';

export interface OptimizationObjective {
  id: string;
  name: string;
  description: string;
  type: 'minimize' | 'maximize';
  weight: number;
  currentValue: number;
  targetValue: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface OptimizationConstraint {
  id: string;
  name: string;
  description: string;
  type: 'equality' | 'inequality' | 'bound';
  lowerBound?: number;
  upperBound?: number;
  currentValue: number;
  penalty: number;
}

export interface OptimizationVariable {
  id: string;
  name: string;
  description: string;
  type: 'continuous' | 'discrete' | 'binary';
  minValue: number;
  maxValue: number;
  currentValue: number;
  stepSize?: number;
  allowedValues?: number[];
}

export interface OptimizationContext {
  timestamp: number;
  objectives: OptimizationObjective[];
  constraints: OptimizationConstraint[];
  variables: OptimizationVariable[];
  environment: Record<string, unknown>;
  user: Record<string, unknown>;
  system: Record<string, unknown>;
}

export interface OptimizationSolution {
  id: string;
  variables: Map<string, number>;
  objectiveValues: Map<string, number>;
  constraintViolations: Map<string, number>;
  fitness: number;
  paretoRank: number;
  crowdingDistance: number;
  isFeasible: boolean;
  timestamp: number;
}

export interface OptimizationResult {
  id: string;
  algorithm: string;
  solutions: OptimizationSolution[];
  bestSolution: OptimizationSolution;
  paretoFront: OptimizationSolution[];
  iterations: number;
  executionTime: number;
  convergence: number;
  timestamp: number;
}

export interface OptimizationMetrics {
  totalOptimizations: number;
  successfulOptimizations: number;
  failedOptimizations: number;
  averageIterations: number;
  averageExecutionTime: number;
  averageFitness: number;
  totalSolutions: number;
  feasibleSolutions: number;
  averageParetoSize: number;
}

export interface OptimizationEngineConfig {
  enableMultiObjective: boolean;
  enableParetoOptimization: boolean;
  enableConstraints: boolean;
  maxIterations: number;
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  tournamentSize: number;
  convergenceThreshold: number;
  maxExecutionTime: number;
  enableParallel: boolean;
  numberOfThreads: number;
}

export class OptimizationEngine extends EventEmitter {
  private static instance: OptimizationEngine;
  private algorithms: Map<string, OptimizationAlgorithm> = new Map();
  private results: OptimizationResult[] = [];
  private metrics: OptimizationMetrics;
  private config: OptimizationEngineConfig;
  private geneticAlgorithm: GeneticAlgorithm;
  private particleSwarmOptimization: ParticleSwarmOptimization;
  private simulatedAnnealing: SimulatedAnnealing;
  private multiObjectiveOptimizer: MultiObjectiveOptimizer;

  private constructor(config?: Partial<OptimizationEngineConfig>) {
    super();
    this.config = this.initializeConfig(config);
    this.geneticAlgorithm = new GeneticAlgorithm(this.config);
    this.particleSwarmOptimization = new ParticleSwarmOptimization(this.config);
    this.simulatedAnnealing = new SimulatedAnnealing(this.config);
    this.multiObjectiveOptimizer = new MultiObjectiveOptimizer(this.config);
    this.metrics = this.initializeMetrics();
    this.initialize();
  }

  static getInstance(config?: Partial<OptimizationEngineConfig>): OptimizationEngine {
    if (!OptimizationEngine.instance) {
      OptimizationEngine.instance = new OptimizationEngine(config);
    }
    return OptimizationEngine.instance;
  }

  private initializeConfig(config?: Partial<OptimizationEngineConfig>): OptimizationEngineConfig {
    return {
      enableMultiObjective: true,
      enableParetoOptimization: true,
      enableConstraints: true,
      maxIterations: 1000,
      populationSize: 100,
      mutationRate: 0.1,
      crossoverRate: 0.8,
      tournamentSize: 3,
      convergenceThreshold: 0.001,
      maxExecutionTime: 30000,
      enableParallel: false,
      numberOfThreads: 4,
      ...config,
    };
  }

  private initializeMetrics(): OptimizationMetrics {
    return {
      totalOptimizations: 0,
      successfulOptimizations: 0,
      failedOptimizations: 0,
      averageIterations: 0,
      averageExecutionTime: 0,
      averageFitness: 0,
      totalSolutions: 0,
      feasibleSolutions: 0,
      averageParetoSize: 0,
    };
  }

  private async initialize(): Promise<void> {
    this.loadDefaultAlgorithms();
    this.emit('initialized', this.metrics);
  }

  private loadDefaultAlgorithms(): void {
    const defaultAlgorithms: OptimizationAlgorithm[] = [
      {
        id: 'genetic-algorithm',
        name: 'Genetic Algorithm',
        description: 'Evolutionary optimization using genetic operators',
        type: 'evolutionary',
        isMultiObjective: true,
        isConstrained: true,
        parameters: {
          populationSize: this.config.populationSize,
          mutationRate: this.config.mutationRate,
          crossoverRate: this.config.crossoverRate,
          tournamentSize: this.config.tournamentSize,
        },
      },
      {
        id: 'particle-swarm-optimization',
        name: 'Particle Swarm Optimization',
        description: 'Swarm intelligence optimization',
        type: 'swarm',
        isMultiObjective: true,
        isConstrained: true,
        parameters: {
          swarmSize: this.config.populationSize,
          inertiaWeight: 0.7,
          cognitiveWeight: 1.5,
          socialWeight: 1.5,
        },
      },
      {
        id: 'simulated-annealing',
        name: 'Simulated Annealing',
        description: 'Probabilistic optimization technique',
        type: 'metaheuristic',
        isMultiObjective: false,
        isConstrained: true,
        parameters: {
          initialTemperature: 1000,
          coolingRate: 0.95,
          minTemperature: 0.01,
        },
      },
    ];

    for (const algorithm of defaultAlgorithms) {
      this.algorithms.set(algorithm.id, algorithm);
    }
  }

  public async optimize(
    context: OptimizationContext,
    algorithmId?: string
  ): Promise<OptimizationResult> {
    const startTime = Date.now();

    this.emit('optimization-started', { context, timestamp: startTime });

    try {
      const algorithm = algorithmId
        ? this.algorithms.get(algorithmId)
        : this.selectBestAlgorithm(context);

      if (!algorithm) {
        throw new Error('No suitable algorithm found');
      }

      const result = await this.executeOptimization(algorithm, context);

      const executionTime = Date.now() - startTime;
      result.executionTime = executionTime;

      this.results.push(result);
      this.updateMetrics(result);

      this.emit('optimization-completed', result);
      return result;
    } catch (error) {
      this.metrics.failedOptimizations++;
      this.emit('optimization-failed', { context, error });
      throw error;
    }
  }

  private selectBestAlgorithm(context: OptimizationContext): OptimizationAlgorithm {
    const isMultiObjective = context.objectives.length > 1;
    const hasConstraints = context.constraints.length > 0;

    const suitableAlgorithms = Array.from(this.algorithms.values()).filter(algo =>
      (!isMultiObjective || algo.isMultiObjective) &&
      (!hasConstraints || algo.isConstrained)
    );

    if (suitableAlgorithms.length === 0) {
      throw new Error('No suitable algorithm found for the given context');
    }

    return suitableAlgorithms[0];
  }

  private async executeOptimization(
    algorithm: OptimizationAlgorithm,
    context: OptimizationContext
  ): Promise<OptimizationResult> {
    switch (algorithm.id) {
      case 'genetic-algorithm':
        return this.geneticAlgorithm.optimize(context, this.config);
      case 'particle-swarm-optimization':
        return this.particleSwarmOptimization.optimize(context, this.config);
      case 'simulated-annealing':
        return this.simulatedAnnealing.optimize(context, this.config);
      default:
        return this.geneticAlgorithm.optimize(context, this.config);
    }
  }

  public async multiObjectiveOptimize(
    context: OptimizationContext
  ): Promise<OptimizationResult> {
    if (!this.config.enableMultiObjective) {
      throw new Error('Multi-objective optimization is disabled');
    }

    if (context.objectives.length < 2) {
      throw new Error('At least two objectives are required for multi-objective optimization');
    }

    return this.multiObjectiveOptimizer.optimize(context, this.config);
  }

  public async findParetoFront(
    solutions: OptimizationSolution[]
  ): Promise<OptimizationSolution[]> {
    return this.multiObjectiveOptimizer.findParetoFront(solutions);
  }

  public async optimizeResourceAllocation(
    resources: Record<string, number>,
    demands: Record<string, number>,
    constraints: OptimizationConstraint[]
  ): Promise<OptimizationResult> {
    const variables: OptimizationVariable[] = Object.keys(resources).map(key => ({
      id: `var_${key}`,
      name: key,
      description: `Allocation for ${key}`,
      type: 'continuous',
      minValue: 0,
      maxValue: resources[key],
      currentValue: resources[key],
    }));

    const objectives: OptimizationObjective[] = [
      {
        id: 'obj_efficiency',
        name: 'Efficiency',
        description: 'Maximize resource utilization efficiency',
        type: 'maximize',
        weight: 0.4,
        currentValue: 0.5,
        targetValue: 1.0,
        priority: 'high',
      },
      {
        id: 'obj_cost',
        name: 'Cost',
        description: 'Minimize total cost',
        type: 'minimize',
        weight: 0.3,
        currentValue: 1.0,
        targetValue: 0.5,
        priority: 'high',
      },
      {
        id: 'obj_reliability',
        name: 'Reliability',
        description: 'Maximize system reliability',
        type: 'maximize',
        weight: 0.3,
        currentValue: 0.7,
        targetValue: 1.0,
        priority: 'high',
      },
    ];

    const context: OptimizationContext = {
      timestamp: Date.now(),
      objectives,
      constraints,
      variables,
      environment: { resources, demands },
      user: {},
      system: {},
    };

    return this.optimize(context);
  }

  public async optimizePerformance(
    currentMetrics: Record<string, number>,
    targetMetrics: Record<string, number>,
    constraints: OptimizationConstraint[]
  ): Promise<OptimizationResult> {
    const variables: OptimizationVariable[] = Object.keys(currentMetrics).map(key => ({
      id: `var_${key}`,
      name: key,
      description: `Optimization variable for ${key}`,
      type: 'continuous',
      minValue: targetMetrics[key] * 0.8,
      maxValue: currentMetrics[key],
      currentValue: currentMetrics[key],
    }));

    const objectives: OptimizationObjective[] = [
      {
        id: 'obj_performance',
        name: 'Performance',
        description: 'Minimize execution time',
        type: 'minimize',
        weight: 0.5,
        currentValue: currentMetrics.executionTime || 100,
        targetValue: targetMetrics.executionTime || 50,
        priority: 'critical',
      },
      {
        id: 'obj_memory',
        name: 'Memory Usage',
        description: 'Minimize memory usage',
        type: 'minimize',
        weight: 0.3,
        currentValue: currentMetrics.memoryUsage || 50,
        targetValue: targetMetrics.memoryUsage || 30,
        priority: 'high',
      },
      {
        id: 'obj_quality',
        name: 'Quality',
        description: 'Maximize quality score',
        type: 'maximize',
        weight: 0.2,
        currentValue: 0.8,
        targetValue: 1.0,
        priority: 'medium',
      },
    ];

    const context: OptimizationContext = {
      timestamp: Date.now(),
      objectives,
      constraints,
      variables,
      environment: { currentMetrics, targetMetrics },
      user: {},
      system: {},
    };

    return this.optimize(context);
  }

  private updateMetrics(result: OptimizationResult): void {
    this.metrics.totalOptimizations++;
    this.metrics.successfulOptimizations++;

    const totalIterations = this.metrics.averageIterations * (this.metrics.totalOptimizations - 1);
    this.metrics.averageIterations = (totalIterations + result.iterations) / this.metrics.totalOptimizations;

    const totalExecutionTime = this.metrics.averageExecutionTime * (this.metrics.totalOptimizations - 1);
    this.metrics.averageExecutionTime = (totalExecutionTime + result.executionTime) / this.metrics.totalOptimizations;

    const totalFitness = this.metrics.averageFitness * (this.metrics.totalOptimizations - 1);
    this.metrics.averageFitness = (totalFitness + result.bestSolution.fitness) / this.metrics.totalOptimizations;

    this.metrics.totalSolutions += result.solutions.length;
    this.metrics.feasibleSolutions += result.solutions.filter(s => s.isFeasible).length;

    const totalParetoSize = this.metrics.averageParetoSize * (this.metrics.totalOptimizations - 1);
    this.metrics.averageParetoSize = (totalParetoSize + result.paretoFront.length) / this.metrics.totalOptimizations;
  }

  public getAlgorithm(algorithmId: string): OptimizationAlgorithm | undefined {
    return this.algorithms.get(algorithmId);
  }

  public getAllAlgorithms(): OptimizationAlgorithm[] {
    return Array.from(this.algorithms.values());
  }

  public addAlgorithm(algorithm: OptimizationAlgorithm): void {
    this.algorithms.set(algorithm.id, algorithm);
    this.emit('algorithm-added', algorithm);
  }

  public updateAlgorithm(algorithmId: string, updates: Partial<OptimizationAlgorithm>): void {
    const existingAlgorithm = this.algorithms.get(algorithmId);
    if (!existingAlgorithm) {
      throw new Error(`Algorithm not found: ${algorithmId}`);
    }

    const updatedAlgorithm: OptimizationAlgorithm = {
      ...existingAlgorithm,
      ...updates,
      id: algorithmId,
    };

    this.algorithms.set(algorithmId, updatedAlgorithm);
    this.emit('algorithm-updated', updatedAlgorithm);
  }

  public removeAlgorithm(algorithmId: string): void {
    const removed = this.algorithms.delete(algorithmId);
    if (removed) {
      this.emit('algorithm-removed', algorithmId);
    }
  }

  public getResults(limit?: number): OptimizationResult[] {
    const results = [...this.results].reverse();
    return limit ? results.slice(0, limit) : results;
  }

  public getMetrics(): OptimizationMetrics {
    return { ...this.metrics };
  }

  public getConfig(): OptimizationEngineConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<OptimizationEngineConfig>): void {
    this.config = { ...this.config, ...updates };
    this.emit('config-updated', this.config);
  }

  public async reset(): Promise<void> {
    this.algorithms.clear();
    this.results = [];
    this.metrics = this.initializeMetrics();
    this.loadDefaultAlgorithms();
    this.emit('reset', this.metrics);
  }
}

interface OptimizationAlgorithm {
  id: string;
  name: string;
  description: string;
  type: 'evolutionary' | 'swarm' | 'metaheuristic' | 'gradient' | 'hybrid';
  isMultiObjective: boolean;
  isConstrained: boolean;
  parameters: Record<string, unknown>;
}

class GeneticAlgorithm {
  constructor(private config: OptimizationEngineConfig) {}

  async optimize(
    context: OptimizationContext,
    config: OptimizationEngineConfig
  ): Promise<OptimizationResult> {
    const startTime = Date.now();
    const population = this.initializePopulation(context, config.populationSize);
    let bestSolution = population[0];
    let convergence = 1.0;
    let iteration = 0;

    while (iteration < config.maxIterations && convergence > config.convergenceThreshold) {
      const evaluatedPopulation = this.evaluatePopulation(population, context);

      const currentBest = this.findBestSolution(evaluatedPopulation);
      if (currentBest.fitness > bestSolution.fitness) {
        bestSolution = currentBest;
      }

      const selectedPopulation = this.selection(evaluatedPopulation, config);
      const offspringPopulation = this.crossover(selectedPopulation, config);
      const mutatedPopulation = this.mutation(offspringPopulation, config);

      population.length = 0;
      population.push(...mutatedPopulation);

      convergence = this.calculateConvergence(evaluatedPopulation);
      iteration++;
    }

    const solutions = this.evaluatePopulation(population, context);
    const paretoFront = await this.findParetoFront(solutions);

    return {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      algorithm: 'genetic-algorithm',
      solutions,
      bestSolution,
      paretoFront,
      iterations: iteration,
      executionTime: Date.now() - startTime,
      convergence,
      timestamp: Date.now(),
    };
  }

  private initializePopulation(context: OptimizationContext, size: number): OptimizationSolution[] {
    const population: OptimizationSolution[] = [];

    for (let i = 0; i < size; i++) {
      const variables = new Map<string, number>();

      for (const variable of context.variables) {
        const value = this.randomValue(variable.minValue, variable.maxValue);
        variables.set(variable.id, value);
      }

      population.push({
        id: `sol_${i}`,
        variables,
        objectiveValues: new Map(),
        constraintViolations: new Map(),
        fitness: 0,
        paretoRank: 0,
        crowdingDistance: 0,
        isFeasible: false,
        timestamp: Date.now(),
      });
    }

    return population;
  }

  private randomValue(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  private evaluatePopulation(
    population: OptimizationSolution[],
    context: OptimizationContext
  ): OptimizationSolution[] {
    return population.map(solution => this.evaluateSolution(solution, context));
  }

  private evaluateSolution(
    solution: OptimizationSolution,
    context: OptimizationContext
  ): OptimizationSolution {
    const objectiveValues = new Map<string, number>();
    const constraintViolations = new Map<string, number>();

    for (const objective of context.objectives) {
      const value = this.calculateObjectiveValue(solution, objective);
      objectiveValues.set(objective.id, value);
    }

    let isFeasible = true;

    for (const constraint of context.constraints) {
      const violation = this.calculateConstraintViolation(solution, constraint);
      constraintViolations.set(constraint.id, violation);

      if (violation > 0) {
        isFeasible = false;
      }
    }

    const fitness = this.calculateFitness(objectiveValues, constraintViolations, context);

    return {
      ...solution,
      objectiveValues,
      constraintViolations,
      fitness,
      isFeasible,
    };
  }

  private calculateObjectiveValue(
    solution: OptimizationSolution,
    objective: OptimizationObjective
  ): number {
    const variableValue = solution.variables.get('var_0') || 0;

    switch (objective.type) {
      case 'minimize':
        return variableValue;
      case 'maximize':
        return 1 - variableValue;
      default:
        return variableValue;
    }
  }

  private calculateConstraintViolation(
    solution: OptimizationSolution,
    constraint: OptimizationConstraint
  ): number {
    const variableValue = solution.variables.get('var_0') || 0;

    switch (constraint.type) {
      case 'equality':
        return Math.abs(variableValue - constraint.currentValue);
      case 'inequality':
        return Math.max(0, variableValue - (constraint.upperBound || Infinity));
      case 'bound':
        return Math.max(0, variableValue - (constraint.upperBound || Infinity)) +
               Math.max(0, (constraint.lowerBound || 0) - variableValue);
      default:
        return 0;
    }
  }

  private calculateFitness(
    objectiveValues: Map<string, number>,
    constraintViolations: Map<string, number>,
    context: OptimizationContext
  ): number {
    let fitness = 0;

    for (const objective of context.objectives) {
      const value = objectiveValues.get(objective.id) || 0;
      fitness += value * objective.weight;
    }

    const penalty = Array.from(constraintViolations.values()).reduce((sum, v) => sum + v, 0);
    fitness -= penalty;

    return fitness;
  }

  private findBestSolution(population: OptimizationSolution[]): OptimizationSolution {
    return population.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  private selection(
    population: OptimizationSolution[],
    config: OptimizationEngineConfig
  ): OptimizationSolution[] {
    const selected: OptimizationSolution[] = [];

    for (let i = 0; i < population.length; i++) {
      const tournament = this.tournamentSelection(population, config.tournamentSize);
      selected.push(tournament);
    }

    return selected;
  }

  private tournamentSelection(
    population: OptimizationSolution[],
    tournamentSize: number
  ): OptimizationSolution {
    let best = population[Math.floor(Math.random() * population.length)];

    for (let i = 1; i < tournamentSize; i++) {
      const competitor = population[Math.floor(Math.random() * population.length)];
      if (competitor.fitness > best.fitness) {
        best = competitor;
      }
    }

    return best;
  }

  private crossover(
    population: OptimizationSolution[],
    config: OptimizationEngineConfig
  ): OptimizationSolution[] {
    const offspring: OptimizationSolution[] = [];

    for (let i = 0; i < population.length; i += 2) {
      if (i + 1 < population.length && Math.random() < config.crossoverRate) {
        const [child1, child2] = this.crossoverSolutions(population[i], population[i + 1]);
        offspring.push(child1, child2);
      } else {
        offspring.push(population[i]);
        if (i + 1 < population.length) {
          offspring.push(population[i + 1]);
        }
      }
    }

    return offspring;
  }

  private crossoverSolutions(
    parent1: OptimizationSolution,
    parent2: OptimizationSolution
  ): [OptimizationSolution, OptimizationSolution] {
    const child1Variables = new Map<string, number>();
    const child2Variables = new Map<string, number>();

    for (const [key, value1] of parent1.variables.entries()) {
      const value2 = parent2.variables.get(key) || 0;
      const alpha = Math.random();

      child1Variables.set(key, alpha * value1 + (1 - alpha) * value2);
      child2Variables.set(key, (1 - alpha) * value1 + alpha * value2);
    }

    const child1: OptimizationSolution = {
      ...parent1,
      id: `child_${Date.now()}_1`,
      variables: child1Variables,
    };

    const child2: OptimizationSolution = {
      ...parent2,
      id: `child_${Date.now()}_2`,
      variables: child2Variables,
    };

    return [child1, child2];
  }

  private mutation(
    population: OptimizationSolution[],
    config: OptimizationEngineConfig
  ): OptimizationSolution[] {
    return population.map(solution => {
      if (Math.random() < config.mutationRate) {
        return this.mutateSolution(solution);
      }
      return solution;
    });
  }

  private mutateSolution(solution: OptimizationSolution): OptimizationSolution {
    const mutatedVariables = new Map<string, number>();

    for (const [key, value] of solution.variables.entries()) {
      const mutation = (Math.random() - 0.5) * 0.1;
      mutatedVariables.set(key, value + mutation);
    }

    return {
      ...solution,
      variables: mutatedVariables,
    };
  }

  private calculateConvergence(population: OptimizationSolution[]): number {
    const fitnessValues = population.map(s => s.fitness);
    const mean = fitnessValues.reduce((sum, v) => sum + v, 0) / fitnessValues.length;
    const variance = fitnessValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / fitnessValues.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / (Math.abs(mean) + 1e-10);
  }

  async findParetoFront(solutions: OptimizationSolution[]): Promise<OptimizationSolution[]> {
    const paretoFront: OptimizationSolution[] = [];

    for (const solution of solutions) {
      let isDominated = false;

      for (const other of solutions) {
        if (solution.id === other.id) continue;

        if (this.dominates(other, solution)) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoFront.push(solution);
      }
    }

    return paretoFront;
  }

  private dominates(solution1: OptimizationSolution, solution2: OptimizationSolution): boolean {
    const objectives1 = Array.from(solution1.objectiveValues.values());
    const objectives2 = Array.from(solution2.objectiveValues.values());

    const allBetterOrEqual = objectives1.every((v, i) => v >= objectives2[i]);
    const atLeastOneBetter = objectives1.some((v, i) => v > objectives2[i]);

    return allBetterOrEqual && atLeastOneBetter;
  }
}

class ParticleSwarmOptimization {
  constructor(private config: OptimizationEngineConfig) {}

  async optimize(
    context: OptimizationContext,
    config: OptimizationEngineConfig
  ): Promise<OptimizationResult> {
    const startTime = Date.now();
    const swarm = this.initializeSwarm(context, config.populationSize);
    let bestSolution = swarm[0];
    let convergence = 1.0;
    let iteration = 0;

    while (iteration < config.maxIterations && convergence > config.convergenceThreshold) {
      for (const particle of swarm) {
        this.updateParticle(particle, bestSolution, context);
      }

      const currentBest = this.findBestSolution(swarm);
      if (currentBest.fitness > bestSolution.fitness) {
        bestSolution = currentBest;
      }

      convergence = this.calculateConvergence(swarm);
      iteration++;
    }

    const solutions = swarm;
    const paretoFront = await this.findParetoFront(solutions);

    return {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      algorithm: 'particle-swarm-optimization',
      solutions,
      bestSolution,
      paretoFront,
      iterations: iteration,
      executionTime: Date.now() - startTime,
      convergence,
      timestamp: Date.now(),
    };
  }

  private initializeSwarm(context: OptimizationContext, size: number): OptimizationSolution[] {
    const swarm: OptimizationSolution[] = [];

    for (let i = 0; i < size; i++) {
      const variables = new Map<string, number>();

      for (const variable of context.variables) {
        const value = Math.random() * (variable.maxValue - variable.minValue) + variable.minValue;
        variables.set(variable.id, value);
      }

      swarm.push({
        id: `particle_${i}`,
        variables,
        objectiveValues: new Map(),
        constraintViolations: new Map(),
        fitness: 0,
        paretoRank: 0,
        crowdingDistance: 0,
        isFeasible: false,
        timestamp: Date.now(),
      });
    }

    return swarm;
  }

  private updateParticle(
    particle: OptimizationSolution,
    bestSolution: OptimizationSolution,
    context: OptimizationContext
  ): void {
    const inertiaWeight = 0.7;
    const cognitiveWeight = 1.5;
    const socialWeight = 1.5;

    for (const [key, value] of particle.variables.entries()) {
      const personalBest = value;
      const globalBest = bestSolution.variables.get(key) || value;

      const r1 = Math.random();
      const r2 = Math.random();

      const velocity = inertiaWeight * value +
                     cognitiveWeight * r1 * (personalBest - value) +
                     socialWeight * r2 * (globalBest - value);

      const newValue = value + velocity;
      particle.variables.set(key, newValue);
    }

    const evaluated = this.evaluateParticle(particle, context);
    particle.fitness = evaluated.fitness;
    particle.objectiveValues = evaluated.objectiveValues;
    particle.constraintViolations = evaluated.constraintViolations;
    particle.isFeasible = evaluated.isFeasible;
  }

  private evaluateParticle(
    particle: OptimizationSolution,
    context: OptimizationContext
  ): OptimizationSolution {
    const objectiveValues = new Map<string, number>();
    const constraintViolations = new Map<string, number>();

    for (const objective of context.objectives) {
      const value = particle.variables.get('var_0') || 0;
      objectiveValues.set(objective.id, value);
    }

    let isFeasible = true;

    for (const constraint of context.constraints) {
      const value = particle.variables.get('var_0') || 0;
      const violation = Math.max(0, value - (constraint.upperBound || Infinity));
      constraintViolations.set(constraint.id, violation);

      if (violation > 0) {
        isFeasible = false;
      }
    }

    const fitness = Array.from(objectiveValues.values()).reduce((sum, v) => sum + v, 0);

    return {
      ...particle,
      objectiveValues,
      constraintViolations,
      fitness,
      isFeasible,
    };
  }

  private findBestSolution(swarm: OptimizationSolution[]): OptimizationSolution {
    return swarm.reduce((best, current) =>
      current.fitness > best.fitness ? current : best
    );
  }

  private calculateConvergence(swarm: OptimizationSolution[]): number {
    const fitnessValues = swarm.map(s => s.fitness);
    const mean = fitnessValues.reduce((sum, v) => sum + v, 0) / fitnessValues.length;
    const variance = fitnessValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / fitnessValues.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / (Math.abs(mean) + 1e-10);
  }

  async findParetoFront(solutions: OptimizationSolution[]): Promise<OptimizationSolution[]> {
    const paretoFront: OptimizationSolution[] = [];

    for (const solution of solutions) {
      let isDominated = false;

      for (const other of solutions) {
        if (solution.id === other.id) continue;

        const objectives1 = Array.from(solution.objectiveValues.values());
        const objectives2 = Array.from(other.objectiveValues.values());

        const allBetterOrEqual = objectives1.every((v, i) => v >= objectives2[i]);
        const atLeastOneBetter = objectives1.some((v, i) => v > objectives2[i]);

        if (allBetterOrEqual && atLeastOneBetter) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoFront.push(solution);
      }
    }

    return paretoFront;
  }
}

class SimulatedAnnealing {
  constructor(private config: OptimizationEngineConfig) {}

  async optimize(
    context: OptimizationContext,
    config: OptimizationEngineConfig
  ): Promise<OptimizationResult> {
    const startTime = Date.now();
    let currentSolution = this.initializeSolution(context);
    let bestSolution = currentSolution;
    let temperature = 1000;
    const coolingRate = 0.95;
    const minTemperature = 0.01;
    let iteration = 0;

    while (temperature > minTemperature && iteration < config.maxIterations) {
      const newSolution = this.generateNeighbor(currentSolution, context);

      const delta = newSolution.fitness - currentSolution.fitness;

      if (delta > 0 || Math.random() < Math.exp(delta / temperature)) {
        currentSolution = newSolution;

        if (currentSolution.fitness > bestSolution.fitness) {
          bestSolution = currentSolution;
        }
      }

      temperature *= coolingRate;
      iteration++;
    }

    const solutions = [currentSolution, bestSolution];
    const paretoFront = await this.findParetoFront(solutions);

    return {
      id: `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      algorithm: 'simulated-annealing',
      solutions,
      bestSolution,
      paretoFront,
      iterations: iteration,
      executionTime: Date.now() - startTime,
      convergence: temperature,
      timestamp: Date.now(),
    };
  }

  private initializeSolution(context: OptimizationContext): OptimizationSolution {
    const variables = new Map<string, number>();

    for (const variable of context.variables) {
      const value = Math.random() * (variable.maxValue - variable.minValue) + variable.minValue;
      variables.set(variable.id, value);
    }

    return {
      id: `solution_${Date.now()}`,
      variables,
      objectiveValues: new Map(),
      constraintViolations: new Map(),
      fitness: 0,
      paretoRank: 0,
      crowdingDistance: 0,
      isFeasible: false,
      timestamp: Date.now(),
    };
  }

  private generateNeighbor(
    solution: OptimizationSolution,
    context: OptimizationContext
  ): OptimizationSolution {
    const newVariables = new Map<string, number>();

    for (const [key, value] of solution.variables.entries()) {
      const variable = context.variables.find(v => v.id === key);
      if (variable) {
        const step = (variable.maxValue - variable.minValue) * 0.1;
        const newValue = value + (Math.random() - 0.5) * step;
        const clampedValue = Math.max(variable.minValue, Math.min(variable.maxValue, newValue));
        newVariables.set(key, clampedValue);
      } else {
        newVariables.set(key, value);
      }
    }

    return {
      ...solution,
      id: `solution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      variables: newVariables,
    };
  }

  async findParetoFront(solutions: OptimizationSolution[]): Promise<OptimizationSolution[]> {
    return solutions;
  }
}

class MultiObjectiveOptimizer {
  constructor(private config: OptimizationEngineConfig) {}

  async optimize(
    context: OptimizationContext,
    config: OptimizationEngineConfig
  ): Promise<OptimizationResult> {
    const startTime = Date.now();
    const geneticAlgorithm = new GeneticAlgorithm(config);
    const result = await geneticAlgorithm.optimize(context, config);

    const paretoFront = await this.findParetoFront(result.solutions);
    result.paretoFront = paretoFront;

    return {
      ...result,
      executionTime: Date.now() - startTime,
    };
  }

  async findParetoFront(solutions: OptimizationSolution[]): Promise<OptimizationSolution[]> {
    const paretoFront: OptimizationSolution[] = [];

    for (const solution of solutions) {
      let isDominated = false;

      for (const other of solutions) {
        if (solution.id === other.id) continue;

        if (this.dominates(other, solution)) {
          isDominated = true;
          break;
        }
      }

      if (!isDominated) {
        paretoFront.push(solution);
      }
    }

    return paretoFront;
  }

  private dominates(solution1: OptimizationSolution, solution2: OptimizationSolution): boolean {
    const objectives1 = Array.from(solution1.objectiveValues.values());
    const objectives2 = Array.from(solution2.objectiveValues.values());

    const allBetterOrEqual = objectives1.every((v, i) => v >= objectives2[i]);
    const atLeastOneBetter = objectives1.some((v, i) => v > objectives2[i]);

    return allBetterOrEqual && atLeastOneBetter;
  }
}

export default OptimizationEngine;
