/**
 * lib/character-manager.ts 测试用例
 * 测试 CharacterManager 单例类的核心功能
 */

import { CharacterManager } from '@/lib/character-manager';

describe('lib/character-manager', () => {
  let characterManager: CharacterManager;

  beforeEach(() => {
    characterManager = CharacterManager.getInstance();
  });

  describe('单例模式', () => {
    it('应该返回同一个实例', () => {
      const instance1 = CharacterManager.getInstance();
      const instance2 = CharacterManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('应该成功初始化角色管理器', () => {
      expect(characterManager).toBeInstanceOf(CharacterManager);
    });
  });

  describe('角色获取', () => {
    it('应该能够获取女性角色配置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      expect(femaleCharacter).toBeDefined();
      expect(femaleCharacter.id).toBe('xiaoyu');
      expect(femaleCharacter.name).toBe('小语');
      expect(femaleCharacter.gender).toBe('female');
    });

    it('应该能够获取男性角色配置', () => {
      const maleCharacter = characterManager.getCharacterByGender('male');
      expect(maleCharacter).toBeDefined();
      expect(maleCharacter.id).toBe('xiaoyan');
      expect(maleCharacter.name).toBe('小言');
      expect(maleCharacter.gender).toBe('male');
    });

    it('应该根据用户信息自动选择角色', () => {
      const child = {
        id: 'test-child-1',
        name: '测试用户',
        gender: 'female' as const,
        birthday: new Date('2020-01-01'),
      };

      const character = characterManager.getCharacterForUser(child);
      expect(character).toBeDefined();
      expect(character.name).toBe('测试用户');
      expect(character.gender).toBe('female');
    });

    it('当没有用户信息时应该返回默认女性角色', () => {
      const character = characterManager.getCharacterForUser(null);
      expect(character).toBeDefined();
      expect(character.gender).toBe('female');
    });

    it('应该根据用户生日更新角色年龄', () => {
      const birthday = new Date('2020-01-01');
      const child = {
        id: 'test-child-2',
        name: '测试用户',
        gender: 'male' as const,
        birthday,
      };

      const character = characterManager.getCharacterForUser(child);
      const expectedAge = new Date().getFullYear() - birthday.getFullYear();
      expect(character.age).toBe(expectedAge);
    });

    it('应该处理无效的性别值', () => {
      const child = {
        id: 'test-child-3',
        name: '测试用户',
        gender: 'other' as any,
      };

      const character = characterManager.getCharacterForUser(child);
      expect(character).toBeDefined();
      expect(character.gender).toBe('female');
    });
  });

  describe('图片路径管理', () => {
    it('应该能够获取角色默认图片路径', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const imagePath = characterManager.getCharacterImagePath(femaleCharacter);
      expect(imagePath).toBe('/role-photos/girl/xiaoyu-lolita-blue-008.png');
    });

    it('应该能够获取带表情的角色图片路径', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const imagePath = characterManager.getCharacterImagePath(
        femaleCharacter,
        'happy'
      );
      expect(imagePath).toContain('xiaoyu-lolita-blue-010.png');
    });

    it('应该能够获取带主题的角色图片路径', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const imagePath = characterManager.getCharacterImagePath(
        femaleCharacter,
        undefined,
        'pink'
      );
      expect(imagePath).toContain('xiaoyu-lolita-pink-001.png');
    });

    it('应该能够获取AI浮窗头像路径', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const avatarPath = characterManager.getAIFloatingAvatarPath(femaleCharacter);
      expect(avatarPath).toContain('girl-xiaoyu-lolita-pink-001.png');
    });

    it('应该能够获取成长记录头像路径', () => {
      const maleCharacter = characterManager.getCharacterByGender('male');
      const avatarPath = characterManager.getGrowthAvatarPath(maleCharacter);
      expect(avatarPath).toContain('boy-xiaoyan-casual-002.png');
    });

    it('应该能够获取设置页面头像路径', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const avatarPath = characterManager.getSettingAvatarPath(femaleCharacter);
      expect(avatarPath).toContain('girl-xiaoyu-lolita-blue-002.png');
    });
  });

  describe('主题颜色管理', () => {
    it('应该能够获取女性角色主题颜色', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const colors = characterManager.getCharacterThemeColors(femaleCharacter);
      expect(colors).toBeDefined();
      expect(colors.primary).toBe('#ec4899');
      expect(colors.secondary).toBe('#f9a8d4');
    });

    it('应该能够获取男性角色主题颜色', () => {
      const maleCharacter = characterManager.getCharacterByGender('male');
      const colors = characterManager.getCharacterThemeColors(maleCharacter);
      expect(colors).toBeDefined();
      expect(colors.primary).toBe('#3b82f6');
      expect(colors.secondary).toBe('#93c5fd');
    });

    it('应该能够获取指定主题的颜色', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const colors = characterManager.getCharacterThemeColors(
        femaleCharacter,
        'pink'
      );
      expect(colors).toBeDefined();
      expect(colors.primary).toBe('#ec4899');
    });

    it('应该包含渐变颜色', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const colors = characterManager.getCharacterThemeColors(femaleCharacter);
      expect(colors.gradient).toBeDefined();
      expect(colors.gradient).toContain('linear-gradient');
    });
  });

  describe('表情管理', () => {
    it('应该能够获取指定表情配置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const expression = characterManager.getCharacterExpression(
        femaleCharacter,
        'happy'
      );
      expect(expression).toBeDefined();
      expect(expression?.name).toBe('happy');
      expect(expression?.displayName).toBe('开心');
    });

    it('当表情不存在时应该返回null', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const expression = characterManager.getCharacterExpression(
        femaleCharacter,
        'nonexistent'
      );
      expect(expression).toBeNull();
    });

    it('应该能够获取随机表情', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const expression = characterManager.getRandomExpression(femaleCharacter);
      expect(expression).toBeDefined();
      expect(femaleCharacter.expressions).toContain(expression);
    });

    it('应该能够根据上下文获取表情', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const expression = characterManager.getContextualExpression(
        femaleCharacter,
        'success'
      );
      expect(expression).toBeDefined();
      expect(expression?.name).toBe('happy');
    });

    it('当没有匹配的上下文时应该返回开心表情', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const expression = characterManager.getContextualExpression(
        femaleCharacter,
        'unknown_context'
      );
      expect(expression).toBeDefined();
      expect(expression?.name).toBe('happy');
    });
  });

  describe('语音和个性管理', () => {
    it('应该能够获取角色的经典用语', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const catchphrase = characterManager.getCatchphrase(femaleCharacter);
      expect(catchphrase).toBeDefined();
      expect(femaleCharacter.personality.catchphrases).toContain(catchphrase);
    });

    it('应该能够获取角色语音设置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      const voiceSettings = characterManager.getVoiceSettings(femaleCharacter);
      expect(voiceSettings).toBeDefined();
      expect(voiceSettings.preferredGender).toBe('female');
      expect(voiceSettings.speechRate).toBeGreaterThan(0);
      expect(voiceSettings.volume).toBeGreaterThan(0);
    });

    it('男性角色的语音设置应该正确', () => {
      const maleCharacter = characterManager.getCharacterByGender('male');
      const voiceSettings = characterManager.getVoiceSettings(maleCharacter);
      expect(voiceSettings.preferredGender).toBe('male');
    });
  });

  describe('用户管理', () => {
    it('应该能够设置当前用户', () => {
      const child = {
        id: 'test-child-4',
        name: '测试用户',
        gender: 'male' as const,
      };

      characterManager.setCurrentChild(child);
      const currentChild = characterManager.getCurrentChild();
      expect(currentChild).toBeDefined();
      expect(currentChild?.id).toBe('test-child-4');
    });

    it('应该能够获取当前用户', () => {
      const child = {
        id: 'test-child-5',
        name: '测试用户',
        gender: 'female' as const,
      };

      characterManager.setCurrentChild(child);
      const currentChild = characterManager.getCurrentChild();
      expect(currentChild?.name).toBe('测试用户');
    });

    it('应该能够清除当前用户', () => {
      const child = {
        id: 'test-child-6',
        name: '测试用户',
        gender: 'male' as const,
      };

      characterManager.setCurrentChild(child);
      characterManager.setCurrentChild(null);
      const currentChild = characterManager.getCurrentChild();
      expect(currentChild).toBeNull();
    });
  });

  describe('角色配置验证', () => {
    it('女性角色应该包含完整的主题配置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      expect(femaleCharacter.themes).toBeDefined();
      expect(femaleCharacter.themes.length).toBeGreaterThan(0);
      expect(femaleCharacter.themes[0]).toHaveProperty('id');
      expect(femaleCharacter.themes[0]).toHaveProperty('name');
      expect(femaleCharacter.themes[0]).toHaveProperty('primaryColor');
    });

    it('男性角色应该包含完整的表情配置', () => {
      const maleCharacter = characterManager.getCharacterByGender('male');
      expect(maleCharacter.expressions).toBeDefined();
      expect(maleCharacter.expressions.length).toBeGreaterThan(0);
      expect(maleCharacter.expressions[0]).toHaveProperty('id');
      expect(maleCharacter.expressions[0]).toHaveProperty('name');
      expect(maleCharacter.expressions[0]).toHaveProperty('triggers');
    });

    it('角色应该包含个性配置', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      expect(femaleCharacter.personality).toBeDefined();
      expect(femaleCharacter.personality.traits).toBeDefined();
      expect(femaleCharacter.personality.speechStyle).toBeDefined();
      expect(femaleCharacter.personality.catchphrases).toBeDefined();
    });

    it('角色应该包含生日和星座信息', () => {
      const femaleCharacter = characterManager.getCharacterByGender('female');
      expect(femaleCharacter.birthday).toBeDefined();
      expect(femaleCharacter.birthday.lunar).toBeDefined();
      expect(femaleCharacter.birthday.solar).toBeDefined();
      expect(femaleCharacter.zodiac).toBeDefined();
    });
  });

  describe('错误处理', () => {
    it('应该处理无效的性别参数', () => {
      expect(() => {
        characterManager.getCharacterByGender('invalid' as any);
      }).toThrow('Character configuration not found for gender');
    });

    it('应该处理空的用户信息', () => {
      const character = characterManager.getCharacterForUser(undefined);
      expect(character).toBeDefined();
      expect(character.gender).toBe('female');
    });
  });

  describe('图片预加载', () => {
    beforeEach(() => {
      global.Image = class {
        src: string = '';
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;

        constructor() {
          process.nextTick(() => {
            if (this.onload) {
              this.onload();
            }
          });
        }
      } as any;
    });

    afterEach(() => {
      delete (global as any).Image;
    });

    it('应该能够预加载角色图片', async () => {
      await characterManager.preloadCharacterImages();
    });
  });
});
