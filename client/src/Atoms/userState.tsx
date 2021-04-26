import { atom } from "recoil";
import { User } from '../types/types';

export const userState = atom({
	key: "userState",
	default: null as User | null,
});