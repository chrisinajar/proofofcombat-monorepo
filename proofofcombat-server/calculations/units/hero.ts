import {
  Hero as HeroData,
  HeroClasses,
  AttackType,
  InventoryItem as InventoryItemData,
  InventoryItemType,
  EnchantmentType,
} from "types/graphql";

import { BasicHeroModifier } from "../modifiers/basic-hero-modifier";
import { HeroClassModifier } from "../modifiers/hero-class-modifier";
import { HeroStanceModifier } from "../modifiers/hero-stance-modifier";
import { GenericArmorModifier } from "../modifiers/generic-armor-modifier";
import { InventoryItem } from "../items/inventory-item";

import { Unit } from "./unit";

export class Hero extends Unit {
  hero: HeroData;

  constructor(hero: HeroData) {
    super();

    Object.assign(this.baseValues, hero.stats, hero.skills, {
      health: hero.combat.maxHealth,
      level: hero.level,

      reducedDelay: 1,
      bonusExperience: 1,
      bonusSkillChance: 1,
    });

    this.hero = hero;
    this.class = hero.class;

    switch (hero.class) {
      case HeroClasses.Zealot:
      case HeroClasses.Paladin:
        this.attackType = AttackType.Smite;
        break;

      case HeroClasses.Vampire:
      case HeroClasses.BloodMage:
        this.attackType = AttackType.Blood;
        break;

      case HeroClasses.Ranger:
      case HeroClasses.Archer:
        this.attackType = AttackType.Ranged;
        break;

      case HeroClasses.Warlock:
      case HeroClasses.MasterWarlock:
      case HeroClasses.Wizard:
      case HeroClasses.MasterWizard:
      case HeroClasses.DemonHunter:
      case HeroClasses.BattleMage:
        this.attackType = AttackType.Cast;
        break;

      case HeroClasses.Monster:
      case HeroClasses.Gladiator:
      case HeroClasses.JackOfAllTrades:
      case HeroClasses.Gambler:
      case HeroClasses.Fighter:
      case HeroClasses.EnragedBerserker:
      case HeroClasses.Daredevil:
      case HeroClasses.Berserker:
      case HeroClasses.Adventurer:
        this.attackType = AttackType.Melee;
        break;
    }

    this.applyModifier(BasicHeroModifier, undefined);
    this.applyModifier(HeroClassModifier, undefined);
    this.applyModifier(HeroStanceModifier, undefined);

    this.equipItem(this.hero.equipment.leftHand);
    this.equipItem(this.hero.equipment.rightHand);
    this.equipItem(this.hero.equipment.bodyArmor);
    this.equipItem(this.hero.equipment.handArmor);
    this.equipItem(this.hero.equipment.legArmor);
    this.equipItem(this.hero.equipment.headArmor);
    this.equipItem(this.hero.equipment.footArmor);
    this.hero.equipment.accessories.forEach((item) => this.equipItem(item));

    this.hero.inventory
      .filter((i) => i.type === InventoryItemType.Quest)
      .forEach((questItem) => {
        this.equipItem(questItem);
      });

    // artifact which totally works right definitely complete feature
    this.equipArtifact(this.hero.equipment.artifact);

    if (this.hero.buffs.blessing) {
      this.equipEnchantment(this.hero.buffs.blessing);
    }
  }

  equipEnchantment(blessing: EnchantmentType) {
    this.equipItem({
      level: 1,
      enchantment: blessing,
      type: InventoryItemType.Quest,
      baseItem: "blessing",
      name: "Blessing",
    });
  }

  isHero(): boolean {
    return true;
  }

  static isHero(unit: Unit): unit is Hero {
    const hero = unit as Hero;
    return !!(hero.isHero && hero.isHero());
  }
}
