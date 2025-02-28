import { HeroClasses, AttackType, HeroStance } from "types/graphql";

import { Modifier, ModifierOptions } from "./modifier";

import { attributesForAttack } from "../../combat/constants";
import { LocationData, MapNames } from "../../constants";

import type { Hero } from "../units/hero";

const DIMINISHING_HEALTH_MAGNITUDE = 100000000;
const MODIFIED_HEALTH_FACTOR = 2;

export class BasicHeroModifier extends Modifier<undefined> {
  parent: Hero;

  constructor(options: ModifierOptions<undefined>) {
    super(options);

    this.parent = options.parent as Hero;
  }

  resistancePenalty() {
    const location =
      LocationData[this.parent.hero.location.map as MapNames]?.locations[
        this.parent.hero.location.x
      ][this.parent.hero.location.y];

    switch (location.terrain) {
      // "land" | "water" | "forbidden" | "void"
      case "water":
        return 0.2;
      case "forbidden":
        return 0.4;
      case "void":
        return 0.6;
    }

    return 0;
  }

  getBonus(prop: string): number | void {
    switch (prop) {
      // passive resistances
      case "allResistances":
        return (
          this.parent.hero.skills.resilience / 100 - this.resistancePenalty()
        );

      // base damage types
      case "magicalResistance":
      case "physicalResistance":
        return Math.log(this.parent.stats.constitution) / 50;

      // elemental types scale off willpower..
      case "fireResistance":
      case "iceResistance":
      case "lightningResistance":
        return Math.log(this.parent.stats.willpower) / 60;

      case "blightResistance":
      case "holyResistance":
        return Math.log(this.parent.stats.wisdom) / 100;
        break;

      case "health":
        // old code:
        // hero.combat.health = Math.round(
        //   (hero.stats.constitution * 20 + hero.level * 20) * bonusHealth
        // );
        // maybe log(x/magnitude+1)*magnitude
        return (
          this.parent.baseValues.constitution * this.parent.stats.level +
          (Math.log(
            this.parent.stats.constitution / DIMINISHING_HEALTH_MAGNITUDE + 1,
          ) *
            DIMINISHING_HEALTH_MAGNITUDE) /
            MODIFIED_HEALTH_FACTOR +
          193 -
          this.parent.baseValues.health
        );
      // Math.pow(1.08, this.parent.stats.vitality)
      case "healthRegeneration":
        // asympotically approach 0.0 -> 1.0
        return 1 - Math.pow(0.995, this.parent.hero.skills.regeneration);
        break;
    }
    return;
  }

  getMultiplier(prop: string): number | void {
    const attackAttributes = attributesForAttack(this.parent.attackType);

    if (this.parent.opponent) {
      const victimAttributes = attributesForAttack(
        this.parent.opponent.attackType,
      );

      if (prop === victimAttributes.damageReduction) {
        return Math.pow(1.05, this.parent.hero.skills.resilience);
      }
    }
    if (
      this.parent.attackType === AttackType.Melee ||
      this.parent.attackType === AttackType.Smite ||
      this.parent.attackType === AttackType.Ranged ||
      (this.parent.attackType === AttackType.Cast &&
        (this.parent.class === HeroClasses.BattleMage ||
          this.parent.class === HeroClasses.DemonHunter))
    ) {
      if (prop === attackAttributes.toHit) {
        return Math.pow(1.05, this.parent.hero.skills.attackingAccuracy);
      }
      if (prop === attackAttributes.damage) {
        return Math.pow(1.05, this.parent.hero.skills.attackingDamage);
      }
    }

    if (
      this.parent.attackType === AttackType.Cast ||
      this.parent.attackType === AttackType.Smite ||
      this.parent.attackType === AttackType.Blood ||
      (this.parent.attackType === AttackType.Melee &&
        (this.parent.class === HeroClasses.BattleMage ||
          this.parent.class === HeroClasses.DemonHunter))
    ) {
      if (prop === attackAttributes.toHit) {
        return Math.pow(1.05, this.parent.hero.skills.castingAccuracy);
      }
      if (prop === attackAttributes.damage) {
        return Math.pow(1.05, this.parent.hero.skills.castingDamage);
      }
    }

    // vitality: 0,
    switch (prop) {
      case "health":
        if (!this.parent.stats.vitality) {
          return;
        }
        return Math.pow(1.08, this.parent.stats.vitality);
    }

    // resilience: 0,
    // regeneration: 0,
    return;
  }

  getExtraBonus(prop: string): number | void {
    return;
  }
}
