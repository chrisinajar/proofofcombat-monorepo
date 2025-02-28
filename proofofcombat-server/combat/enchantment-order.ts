import { EnchantmentType } from "types/graphql";

export const EnchantmentActivationOrder = [
  EnchantmentType.BonusStrength,
  EnchantmentType.BonusDexterity,
  EnchantmentType.BonusConstitution,
  EnchantmentType.BonusIntelligence,
  EnchantmentType.BonusWisdom,
  EnchantmentType.BonusWillpower,
  EnchantmentType.BonusLuck,
  EnchantmentType.BonusPhysical,
  EnchantmentType.BonusMental,
  EnchantmentType.BonusAllStats,
  EnchantmentType.MinusEnemyArmor,
  EnchantmentType.BonusArmor,
  EnchantmentType.MinusEnemyStrength,
  EnchantmentType.MinusEnemyDexterity,
  EnchantmentType.MinusEnemyConstitution,
  EnchantmentType.MinusEnemyIntelligence,
  EnchantmentType.MinusEnemyWisdom,
  EnchantmentType.MinusEnemyWillpower,
  EnchantmentType.MinusEnemyPhysical,
  EnchantmentType.MinusEnemyMental,
  EnchantmentType.MinusEnemyAllStats,
  EnchantmentType.WisDexWill,
  EnchantmentType.BigMelee,
  EnchantmentType.BigCaster,
  EnchantmentType.FishermansStrength,
  EnchantmentType.FishermansDexterity,
  EnchantmentType.FishermansConstitution,
  EnchantmentType.FishermansIntelligence,
  EnchantmentType.FishermansWisdom,
  EnchantmentType.FishermansWillpower,
  EnchantmentType.FishermansLuck,
  EnchantmentType.SuperDexterityStats,
  EnchantmentType.SuperWillpowerStats,
  EnchantmentType.SuperWisdomStats,
  EnchantmentType.DoubleAllStats,
  EnchantmentType.BonusWeaponTier,
  EnchantmentType.BonusArmorTier,
  EnchantmentType.BonusMeleeWeaponTier,
  EnchantmentType.BonusCasterWeaponTier,
  EnchantmentType.BonusRangedWeaponTier,
  EnchantmentType.BonusSmiteWeaponTier,
  EnchantmentType.RangedArmorPiercing,
  EnchantmentType.MeleeArmorPiercing,
  EnchantmentType.CasterArmorPiercing,
  EnchantmentType.SmiteArmorPiercing,
  EnchantmentType.VampireArmorPiercing,

  // damaging / healing
  EnchantmentType.StrengthSteal,
  EnchantmentType.DexteritySteal,
  EnchantmentType.ConstitutionSteal,
  EnchantmentType.IntelligenceSteal,
  EnchantmentType.WisdomSteal,
  EnchantmentType.WillpowerSteal,
  EnchantmentType.LuckSteal,
  EnchantmentType.AllStatsSteal,
  EnchantmentType.LifeSteal,
  EnchantmentType.LifeHeal,
  EnchantmentType.LifeDamage,
  EnchantmentType.Vampirism,
  EnchantmentType.SuperVampStats,
  EnchantmentType.SuperMeleeStats,
  EnchantmentType.SuperCasterStats,
  EnchantmentType.SuperVampMeleeStats,
  EnchantmentType.SuperVampSorcStats,
  EnchantmentType.SuperMeleeVampStats,
  EnchantmentType.SuperBattleMageStats,
  EnchantmentType.SuperSorcVampStats,
];

export const EnchantmentCounterSpellOrder = [
  // counter other counter spells
  // this is done implicitely in the counter spell logic now
  // EnchantmentType.CounterSpell,

  // big heals
  EnchantmentType.SuperVampStats,
  EnchantmentType.SuperVampMeleeStats,
  EnchantmentType.SuperVampSorcStats,
  EnchantmentType.SuperMeleeVampStats,
  EnchantmentType.SuperSorcVampStats,
  EnchantmentType.Vampirism,
  EnchantmentType.LifeSteal,
  EnchantmentType.LifeHeal,
  EnchantmentType.AllStatsSteal,

  // armor is actually stacked
  EnchantmentType.BonusArmor,
  EnchantmentType.BonusWeaponTier,
  EnchantmentType.BonusArmorTier,
  EnchantmentType.BonusMeleeWeaponTier,
  EnchantmentType.BonusCasterWeaponTier,
  EnchantmentType.BonusRangedWeaponTier,
  EnchantmentType.BonusSmiteWeaponTier,

  // remaining t4's
  EnchantmentType.DoubleAllStats,
  EnchantmentType.SuperMeleeStats,
  EnchantmentType.SuperCasterStats,
  EnchantmentType.SuperDexterityStats,
  EnchantmentType.SuperWillpowerStats,
  EnchantmentType.SuperWisdomStats,
  EnchantmentType.SuperBattleMageStats,
  EnchantmentType.BonusWeaponTier,
  EnchantmentType.BonusArmorTier,
  EnchantmentType.BonusMeleeWeaponTier,
  EnchantmentType.BonusCasterWeaponTier,
  EnchantmentType.BonusRangedWeaponTier,
  EnchantmentType.BonusSmiteWeaponTier,
  EnchantmentType.RangedArmorPiercing,
  EnchantmentType.MeleeArmorPiercing,
  EnchantmentType.CasterArmorPiercing,
  EnchantmentType.SmiteArmorPiercing,
  EnchantmentType.VampireArmorPiercing,

  // tier 3's
  EnchantmentType.BigMelee,
  EnchantmentType.BigCaster,

  // just good
  EnchantmentType.LifeDamage,
  EnchantmentType.WisDexWill,

  EnchantmentType.DoubleAccuracy,
  EnchantmentType.DoubleDodge,

  // steals
  EnchantmentType.StrengthSteal,
  EnchantmentType.DexteritySteal,
  EnchantmentType.ConstitutionSteal,
  EnchantmentType.IntelligenceSteal,
  EnchantmentType.WisdomSteal,
  EnchantmentType.WillpowerSteal,
  EnchantmentType.LuckSteal,

  EnchantmentType.MinusEnemyArmor,

  // minus group stats
  EnchantmentType.MinusEnemyAllStats,
  EnchantmentType.MinusEnemyPhysical,
  EnchantmentType.MinusEnemyMental,

  // minus stats
  EnchantmentType.MinusEnemyStrength,
  EnchantmentType.MinusEnemyDexterity,
  EnchantmentType.MinusEnemyConstitution,
  EnchantmentType.MinusEnemyIntelligence,
  EnchantmentType.MinusEnemyWisdom,
  EnchantmentType.MinusEnemyWillpower,

  // group boosts
  EnchantmentType.BonusAllStats,
  EnchantmentType.BonusPhysical,
  EnchantmentType.BonusMental,

  // minor boosts
  EnchantmentType.BonusStrength,
  EnchantmentType.BonusDexterity,
  EnchantmentType.BonusConstitution,
  EnchantmentType.BonusIntelligence,
  EnchantmentType.BonusWisdom,
  EnchantmentType.BonusWillpower,
  EnchantmentType.BonusLuck,
];
