import { BaseModel } from "types/graphql";
import DatabaseInterface from "../interface";

export type ChatMessage = {
  message: string;
  from: string;
  id: number;
  time: number;
  heroId?: string;
  type: "chat" | "private" | "emote";
};

export type SystemMessage = {
  color: "success" | "primary" | "secondary" | "error";
  message: string;
};

type System = BaseModel & {
  chat: ChatMessage[];
  currentOffset: number;
  lastAberrationSpawn: number;
};

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
type PartialChatMessage = Optional<ChatMessage, "type">;
// type PartialSystem = Optional<System>;
type PartialSystem = Omit<System, "chat"> & {
  chat: PartialChatMessage[];
};

const systemSettingsKey = "system";

export default class SystemModel extends DatabaseInterface<System> {
  constructor() {
    super("system");
  }

  async getSystemSettings(): Promise<System> {
    try {
      return await this.get(systemSettingsKey);
    } catch (e) {
      const newSettings: System = {
        id: systemSettingsKey,
        chat: [],
        currentOffset: 0,
        lastAberrationSpawn: 0,
      };
      await this.put(newSettings);
      return newSettings;
    }
  }

  upgrade(data: PartialSystem): System {
    data.chat = data.chat.map((entry) => {
      if (!entry.type) {
        entry.type = "chat";
      }
      return entry;
    });

    data.lastAberrationSpawn = data.lastAberrationSpawn ?? 0;

    return data as System;
  }
}
